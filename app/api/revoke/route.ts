import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { logAudit } from '@/lib/audit'

export async function POST(request: Request) {
  const body = await request.json()
  const { agent_id, reason, revoked_by } = body

  if (!agent_id || !reason) {
    return NextResponse.json({ error: 'agent_id and reason are required' }, { status: 400 })
  }

  const supabase = await createClient()

  const { error: agentError } = await supabase
    .from('agents').update({ status: 'revoked' }).eq('id', agent_id)
  if (agentError) return NextResponse.json({ error: agentError.message }, { status: 500 })

  const { error: credError } = await supabase
    .from('credentials').update({ status: 'revoked' }).eq('agent_id', agent_id).eq('status', 'active')
  if (credError) return NextResponse.json({ error: credError.message }, { status: 500 })

  const { data: revocation, error: revError } = await supabase
    .from('revocation_events')
    .insert({ agent_id, reason, revoked_by: revoked_by ?? 'admin_dashboard' })
    .select().single()
  if (revError) return NextResponse.json({ error: revError.message }, { status: 500 })

  await logAudit({
    entity_type: 'agent', entity_id: agent_id, action: 'agent_revoked',
    actor: revoked_by ?? 'admin_dashboard', details: reason,
  })

  return NextResponse.json({ revoked: true, revocation_id: revocation.id })
}