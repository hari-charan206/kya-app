import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import RevokeButton from '@/components/revoke-button'

export const instant = false

interface AgentItem {
  id: string
  name: string
  status: string
  created_at: string
  client_id?: string
}

export default async function AgentsPage() {
  const supabase = await createClient()
  const { data: agents } = await supabase
    .from('agents')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Registered Agents</h1>
        <Link
          href="/dashboard/agents/new"
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors"
        >
          Register Agent
        </Link>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="text-zinc-500 border-b border-zinc-800">
            <tr>
              <th className="pb-2 pr-4">Agent Name</th>
              <th className="pb-2 pr-4">Status</th>
              <th className="pb-2 pr-4">Created At</th>
              <th className="pb-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="font-mono text-zinc-300">
            {(agents ?? []).map((agent: AgentItem) => (
              <tr key={agent.id} className="border-b border-zinc-900/50">
                <td className="py-3 pr-4 font-semibold text-white">
                  <Link href={`/dashboard/agents/${agent.id}`} className="hover:underline text-blue-400">
                    {agent.name}
                  </Link>
                </td>
                <td className="py-3 pr-4">
                  <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${
                    agent.status === 'active' 
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                      : 'bg-red-950 text-red-400 border border-red-800'
                  }`}>
                    {agent.status}
                  </span>
                </td>
                <td className="py-3 pr-4 text-zinc-500">
                  {new Date(agent.created_at).toISOString().replace('T', ' ').substring(0, 19)}
                </td>
                <td className="py-3 text-right">
                  <RevokeButton agentId={agent.id} currentStatus={agent.status} />
                </td>
              </tr>
            ))}
            {(!agents || agents.length === 0) && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-zinc-500">
                  No agents found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}