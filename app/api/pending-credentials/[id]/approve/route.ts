import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { SignJWT } from 'jose'
import { logAudit } from '@/lib/audit'

// POST /api/pending-credentials/[id]/approve
export async function POST(request: Request, { params }: any) {
  const resolvedParams = await params
  const id = resolvedParams.id
  const body = await request.json().catch(() => ({}))
  const { approved_by } = body

  const supabase = await createClient()

  // Fetch the pending credential
  const { data: pending, error: fetchError } = await supabase
    .from('pending_credentials')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !pending) {
    return NextResponse.json({ error: 'Pending credential not found' }, { status: 404 })
  }

  if (pending.status !== 'pending') {
    return NextResponse.json({ error: `Already ${pending.status}` }, { status: 409 })
  }

  // Mark as approved
  const { error: updateError } = await supabase
    .from('pending_credentials')
    .update({
      status: 'approved',
      approved_by: approved_by ?? 'senior_admin',
      resolved_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  // Now actually issue the credential
  const expiresAt = new Date(Date.now() + pending.expires_in_days * 24 * 60 * 60 * 1000)
  const secret = new TextEncoder().encode(process.env.CREDENTIAL_SIGNING_SECRET)

  const token = await new SignJWT({
    agent_id: pending.agent_id,
    max_amount: pending.max_amount,
    allowed_categories: pending.allowed_categories,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresAt)
    .sign(secret)

  const { data: credential, error: credError } = await supabase
    .from('credentials')
    .insert({
      agent_id: pending.agent_id,
      max_amount: pending.max_amount,
      allowed_categories: pending.allowed_categories,
      token,
      expires_at: expiresAt.toISOString(),
      status: 'active',
    })
    .select()
    .single()

  if (credError) {
    return NextResponse.json({ error: credError.message }, { status: 500 })
  }

  await logAudit({
    entity_type: 'credential',
    entity_id: credential.id,
    action: 'credential_issued_after_approval',
    actor: approved_by ?? 'senior_admin',
    details: `High-value credential approved and issued: max ${pending.max_amount}, categories: ${pending.allowed_categories.join(', ')}`,
  })

  return NextResponse.json({
    credential_id: credential.id,
    token: credential.token,
    expires_at: credential.expires_at,
  })
}
