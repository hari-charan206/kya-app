import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { logAudit } from '@/lib/audit'

// POST /api/pending-credentials/[id]/reject
export async function POST(request: Request, { params }: any) {
  const resolvedParams = await params
  const id = resolvedParams.id
  const body = await request.json().catch(() => ({}))
  const { rejected_by, reason } = body

  const supabase = await createClient()

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

  const { error: updateError } = await supabase
    .from('pending_credentials')
    .update({
      status: 'rejected',
      approved_by: rejected_by ?? 'senior_admin',
      resolved_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  await logAudit({
    entity_type: 'credential',
    entity_id: id,
    action: 'credential_rejected',
    actor: rejected_by ?? 'senior_admin',
    details: `High-value credential request rejected: ₹${pending.max_amount} for agent ${pending.agent_id}${reason ? ` — ${reason}` : ''}`,
  })

  return NextResponse.json({ success: true, status: 'rejected' })
}
