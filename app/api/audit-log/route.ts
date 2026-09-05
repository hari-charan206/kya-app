import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const agentId = searchParams.get('agent')
  const action = searchParams.get('action')
  const actor = searchParams.get('actor')
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  const supabase = await createClient()
  let query = supabase.from('audit_logs').select('*').order('created_at', { ascending: false })

  if (agentId) query = query.eq('entity_id', agentId)
  if (action) query = query.eq('action', action)
  if (actor) query = query.eq('actor', actor)
  if (from) query = query.gte('created_at', from)
  if (to) query = query.lte('created_at', to)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ entries: data })
}