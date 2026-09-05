import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import RevokeButton from '@/components/revoke-button'

export const instant = false

interface PageProps {
  params: Promise<{ id: string }> | { id: string }
}

export default async function AgentDetailPage({ params }: PageProps) {
  const resolvedParams = await params
  const agentId = resolvedParams.id

  const supabase = await createClient()
  const { data: agent, error } = await supabase
    .from('agents')
    .select('*')
    .eq('id', agentId)
    .single()

  if (error || !agent) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/dashboard/agents" className="text-xs text-blue-400 hover:underline mb-2 inline-block">
            ← Back to Agents
          </Link>
          <h1 className="text-2xl font-semibold text-white">{agent.name}</h1>
        </div>
        <RevokeButton agentId={agent.id} currentStatus={agent.status} />
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-6 space-y-4 font-mono text-xs text-zinc-300">
        <div>
          <span className="text-zinc-500 block mb-1">Agent ID</span>
          <span className="text-white">{agent.id}</span>
        </div>
        <div>
          <span className="text-zinc-500 block mb-1">Status</span>
          <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold inline-block ${
            agent.status === 'active' 
              ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
              : 'bg-red-950 text-red-400 border border-red-800'
          }`}>
            {agent.status}
          </span>
        </div>
        <div>
          <span className="text-zinc-500 block mb-1">Created At</span>
          <span>{new Date(agent.created_at).toISOString().replace('T', ' ').substring(0, 19)}</span>
        </div>
      </div>
    </div>
  )
}