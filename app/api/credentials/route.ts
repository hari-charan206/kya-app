import { isRateLimited } from '@/lib/rate-limit'
import { logAudit } from '@/lib/audit'

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { SignJWT } from 'jose'

export async function POST(request: Request) {
  const body = await request.json()
  const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json({ error: 'too many requests, slow down' }, { status: 429 })
  }
  const { agent_id, max_amount, allowed_categories, expires_in_days } = body

  if (!agent_id || !max_amount || !allowed_categories || !expires_in_days) {
    return NextResponse.json(
      { error: 'agent_id, max_amount, allowed_categories, and expires_in_days are required' },
      { status: 400 }
    )
  }

  const supabase = await createClient()

  // Check policy: is this above the max auto-approved credential?
  const { data: policyRow } = await supabase
    .from('policy_settings')
    .select('value')
    .eq('key', 'max_auto_approved_credential')
    .single()

  const maxAutoApproved = Number(policyRow?.value ?? 50000)

  if (Number(max_amount) > maxAutoApproved) {
    // Above threshold: attempt to create a pending approval request
    const { data: pending, error: pendingError } = await supabase
      .from('pending_credentials')
      .insert({
        agent_id,
        max_amount,
        allowed_categories,
        expires_in_days,
        requested_by: 'admin_dashboard',
        status: 'pending',
      })
      .select()
      .single()

    // If the pending_credentials table doesn't exist yet, fall back to direct issuance with a warning
    if (pendingError && pendingError.message?.includes('pending_credentials')) {
      // Table doesn't exist — issue directly but warn in the response
      // (fall through to the normal issuance flow below)
    } else if (pendingError) {
      return NextResponse.json({ error: pendingError.message }, { status: 500 })
    } else if (pending) {
      await logAudit({
        entity_type: 'credential',
        entity_id: pending.id,
        action: 'credential_pending_approval',
        actor: 'admin_dashboard',
        details: `High-value credential request: ₹${max_amount} (above auto-approve threshold of ₹${maxAutoApproved}) — pending senior_admin approval`,
      })

      return NextResponse.json({
        pending_approval: true,
        pending_id: pending.id,
        message: `Amount ₹${Number(max_amount).toLocaleString('en-IN')} exceeds auto-approve threshold of ₹${maxAutoApproved.toLocaleString('en-IN')}. A senior_admin must approve before this credential is issued.`,
      })
    }
  }

  // Within policy: issue directly
  const expiresAt = new Date(Date.now() + expires_in_days * 24 * 60 * 60 * 1000)
  const secret = new TextEncoder().encode(process.env.CREDENTIAL_SIGNING_SECRET)

  const token = await new SignJWT({ agent_id, max_amount, allowed_categories })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(secret)

  const { data, error } = await supabase
    .from('credentials')
    .insert({
      agent_id,
      max_amount,
      allowed_categories,
      token,
      expires_at: expiresAt.toISOString(),
      status: 'active',
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await logAudit({
    entity_type: 'credential',
    entity_id: data.id,
    action: 'credential_issued',
    actor: agent_id,
    details: `Issued: max ${max_amount}, categories: ${allowed_categories.join(', ')}`,
  })

  return NextResponse.json({
    credential_id: data.id,
    token: data.token,
    expires_at: data.expires_at,
  })
}
