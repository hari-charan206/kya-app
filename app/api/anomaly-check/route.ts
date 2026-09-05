import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const body = await request.json()
  const { transaction_id } = body
  if (!transaction_id) return NextResponse.json({ error: 'transaction_id is required' }, { status: 400 })

  const supabase = await createClient()
  const { data: tx, error: txError } = await supabase.from('transactions').select('*').eq('id', transaction_id).single()
  if (txError || !tx) return NextResponse.json({ error: 'transaction not found' }, { status: 404 })

  const { data: credential } = await supabase.from('credentials').select('max_amount').eq('id', tx.credential_id).single()
  const { data: pastTx } = await supabase
    .from('transactions').select('created_at').eq('agent_id', tx.agent_id).neq('id', transaction_id)

  const reasonCodes: string[] = []

  // Rule 1: amount close to the ceiling
  if (credential && tx.amount > 0.8 * credential.max_amount) {
    reasonCodes.push(`amount is over 80% of the agent's max_amount`)
  }

  // Rule 2: unusual hour vs this agent's own history
  if (pastTx && pastTx.length >= 3) {
    const hours = pastTx.map((t: any) => new Date(t.created_at).getHours())
    const minHour = Math.min(...hours), maxHour = Math.max(...hours)
    const txHour = new Date(tx.created_at).getHours()
    if (txHour < minHour - 1 || txHour > maxHour + 1) {
      reasonCodes.push(`transaction hour (${txHour}:00) is outside this agent's usual ${minHour}:00–${maxHour}:00 range`)
    }
  }

  // Rule 3: frequency spike in the last hour
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const { count } = await supabase
    .from('transactions').select('*', { count: 'exact', head: true })
    .eq('agent_id', tx.agent_id).gte('created_at', oneHourAgo)
  if ((count ?? 0) > 5) {
    reasonCodes.push(`more than 5 transactions from this agent in the last hour`)
  }

  if (reasonCodes.length === 0) {
    return NextResponse.json({ flagged: false })
  }

  const riskScore = Math.min(0.3 + reasonCodes.length * 0.25, 0.95)

  const { data: flag, error: flagError } = await supabase
    .from('anomaly_flags')
    .insert({
      transaction_id, agent_id: tx.agent_id, risk_score: riskScore,
      reason: reasonCodes.join('; '), reason_codes: reasonCodes, status: 'open',
    })
    .select().single()

  if (flagError) return NextResponse.json({ error: flagError.message }, { status: 500 })

  return NextResponse.json({ flagged: true, flag_id: flag.id, risk_score: riskScore, reason_codes: reasonCodes })
}