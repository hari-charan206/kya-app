import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { logAudit } from '@/lib/audit'

// Simple in-memory outage flag (set via /api/system-outage)
let systemOutageActive = false

export function setSystemOutage(active: boolean) {
  systemOutageActive = active
}

export function getSystemOutage() {
  return systemOutageActive
}

async function logDecision(
  supabase: any,
  transactionId: string,
  decisionType: 'approve' | 'deny',
  reason: string
) {
  await supabase.from('decisions').insert({ transaction_id: transactionId, decision_type: decisionType, reason })
}

export async function POST(request: Request) {
  const body = await request.json()
  const { token, amount, category } = body

  if (!token || !amount || !category) {
    return NextResponse.json({ error: 'token, amount, and category are required' }, { status: 400 })
  }

  const supabase = await createClient()

  // --- FAILOVER CHECK ---
  // Read the fail_mode policy and check if system outage is active
  const { data: policyRow } = await supabase
    .from('policy_settings')
    .select('value')
    .eq('key', 'fail_mode')
    .single()

  const failMode = policyRow?.value ?? 'fail-safe'

  if (systemOutageActive) {
    if (failMode === 'fail-safe') {
      // Create a minimal transaction and deny it
      const { data: credential } = await supabase
        .from('credentials').select('id').eq('token', token).single()

      let failSafeTxId: string | undefined

      if (credential) {
        const { data: tx } = await supabase
          .from('transactions')
          .insert({ credential_id: credential.id, agent_id: 'unknown', amount, category })
          .select().single()

        if (tx) {
          failSafeTxId = tx.id
          await logDecision(supabase, tx.id, 'deny', 'System degraded — transaction blocked (fail-safe mode)')
          await logAudit({
            entity_type: 'transaction', entity_id: tx.id, action: 'transaction_denied_fail_safe',
            actor: 'system_outage', details: `Blocked due to system outage in fail-safe mode: ₹${amount} ${category}`,
          })
        }
      }

      return NextResponse.json({
        decision: 'deny',
        reason: 'System degraded — transaction blocked (fail-safe mode)',
        transaction_id: failSafeTxId,
        outage: true,
      }, { status: 503 })
    } else {
      // fail-open: allow the transaction through without full verification
      return NextResponse.json({
        decision: 'approve',
        reason: 'System degraded — transaction allowed through (fail-open mode). WARNING: scope not verified.',
        outage: true,
      })
    }
  }

  // --- NORMAL VERIFICATION PATH ---
  const secret = new TextEncoder().encode(process.env.CREDENTIAL_SIGNING_SECRET)

  let payload
  try {
    const result = await jwtVerify(token, secret)
    payload = result.payload
  } catch {
    return NextResponse.json({ decision: 'deny', reason: 'invalid or expired token' }, { status: 401 })
  }

  const { agent_id, max_amount, allowed_categories } = payload as {
    agent_id: string; max_amount: number; allowed_categories: string[]
  }

  const { data: credential, error: credError } = await supabase
    .from('credentials').select('*').eq('token', token).single()

  if (credError || !credential) {
    return NextResponse.json({ decision: 'deny', reason: 'credential not found' }, { status: 404 })
  }

  // Creates the transaction row FIRST, then logs the decision
  const { data: transaction, error: txError } = await supabase
    .from('transactions')
    .insert({ credential_id: credential.id, agent_id, amount, category })
    .select().single()

  if (txError) {
    return NextResponse.json({ error: txError.message }, { status: 500 })
  }

  if (credential.status !== 'active') {
    const reason = `agent access has been revoked`
    await logDecision(supabase, transaction.id, 'deny', reason)
    return NextResponse.json({ decision: 'deny', reason, transaction_id: transaction.id }, { status: 403 })
  }

  if (amount > max_amount) {
    const reason = `amount exceeds max_amount of ${max_amount}`
    await logDecision(supabase, transaction.id, 'deny', reason)
    return NextResponse.json({ decision: 'deny', reason, transaction_id: transaction.id }, { status: 403 })
  }

  if (!allowed_categories.includes(category)) {
    const reason = `category '${category}' not allowed`
    await logDecision(supabase, transaction.id, 'deny', reason)
    return NextResponse.json({ decision: 'deny', reason, transaction_id: transaction.id }, { status: 403 })
  }

  await logDecision(supabase, transaction.id, 'approve', 'within scope')
  await logAudit({
    entity_type: 'transaction', entity_id: transaction.id, action: 'transaction_approved',
    actor: agent_id, details: `₹${amount} approved for ${category}`,
  })

  return NextResponse.json({ decision: 'approve', reason: 'within scope', transaction_id: transaction.id })
}
