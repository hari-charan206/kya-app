import { createClient } from '@/lib/supabase/server'
import AgentViewClient from './agent-view-client'

export const instant = false

export default async function AgentViewPage() {
  const supabase = await createClient()
  const { data: agents } = await supabase
    .from('agents')
    .select('id, name, status')
    .order('name', { ascending: true })

  return <AgentViewClient agents={agents ?? []} />
}
