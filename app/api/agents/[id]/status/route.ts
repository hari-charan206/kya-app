import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { logAudit } from '@/lib/audit'

// PATCH /api/agents/[id]/status
// Reactivation only. Revoking an agent goes through /api/revoke instead,
// since that route also revokes the agent's active credentials and writes
// a revocation_event row — reactivating here doesn't need any of that.
export async function PATCH(request: Request, { params }: any) {
  const resolvedParams = await params
  const id = resolvedParams.id
  const body = await request.json()
  const { status } = body

  if (status !== 'active') {
    return NextResponse.json(
      { error: "This endpoint only supports reactivating an agent. Use /api/revoke to revoke one." },
      { status: 400 }
    )
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('agents')
    .update({ status: 'active' })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  await logAudit({
    entity_type: 'agent',
    entity_id: id,
    action: 'agent_reactivated',
    actor: 'admin_dashboard',
    details: 'Agent reactivated from admin dashboard',
  })

  return NextResponse.json({ agent: data })
}
