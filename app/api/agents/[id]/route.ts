import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Using 'any' for params to easily support both Next.js 14 and 15
export async function GET(request: Request, { params }: any) {
  const supabase = await createClient()
  
  // Await params to fix Next.js 15 dynamic route changes
  const resolvedParams = await params
  const id = resolvedParams.id

  const { data: agent, error: agentError } = await supabase.from('agents').select('*').eq('id', id).single()
  
  if (agentError) {
    return NextResponse.json({ error: 'Could not load agent' }, { status: 500 })
  }

  if (!agent) {
    return NextResponse.json({ error: 'Agent truly not in DB' }, { status: 404 })
  }

  const [{ data: credentials }, { data: transactions }, { data: revocations }] = await Promise.all([
    supabase.from('credentials').select('*').eq('agent_id', id).order('issued_at', { ascending: false }),
    supabase.from('transactions').select('*, decisions(*)').eq('agent_id', id).order('created_at', { ascending: false }),
    supabase.from('revocation_events').select('*').eq('agent_id', id).order('created_at', { ascending: false }),
  ])

  return NextResponse.json({ agent, credentials, transactions, revocations })
}