import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/agents — list all agents (or scoped to developer if ?developer=1)
export async function GET(request: Request) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const developerMode = searchParams.get('developer') === '1'

  let query = supabase.from('agents').select('*').order('created_at', { ascending: false })

  if (developerMode) {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      query = query.eq('owner_user_id', user.id)
    }
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ agents: data })
}

// POST /api/agents — register a new agent
export async function POST(request: Request) {
  const body = await request.json()
  const { owner_user_id, name } = body

  if (!owner_user_id || !name) {
    return NextResponse.json(
      { error: 'owner_user_id and name are required' },
      { status: 400 }
    )
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('agents')
    .insert({ owner_user_id, name, status: 'active' })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ agent_id: data.id, status: data.status })
}