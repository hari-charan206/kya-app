import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { logAudit } from '@/lib/audit'

export async function POST(request: Request, { params }: any) {
  const resolvedParams = await params
  const id = resolvedParams.id
  const body = await request.json()
  const { resolution, rationale } = body

  if (!resolution || !rationale) {
    return NextResponse.json({ error: 'resolution and rationale are required' }, { status: 400 })
  }

  if (!['resolved', 'escalated', 'dismissed'].includes(resolution)) {
    return NextResponse.json({ error: 'resolution must be resolved, escalated, or dismissed' }, { status: 400 })
  }

  const supabase = await createClient()

  const { data: flag, error: flagError } = await supabase
    .from('anomaly_flags')
    .select('*')
    .eq('id', id)
    .single()

  if (flagError || !flag) {
    return NextResponse.json({ error: 'Flag not found' }, { status: 404 })
  }

  if (flag.status === 'resolved' || flag.status === 'dismissed') {
    return NextResponse.json({ error: 'Flag already resolved' }, { status: 409 })
  }

  const { error: updateError } = await supabase
    .from('anomaly_flags')
    .update({
      status: resolution,
      analyst_rationale: rationale,
      resolved_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 })
  }

  await logAudit({
    entity_type: 'anomaly_flag',
    entity_id: id,
    action: `flag_${resolution}`,
    actor: 'case_queue',
    details: `${resolution}: ${rationale}`,
  })

  return NextResponse.json({ success: true, status: resolution })
}
