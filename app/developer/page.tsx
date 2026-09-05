import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const instant = false

export default async function DeveloperDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Show agents owned by this user
  const { data: agents } = await supabase
    .from('agents')
    .select('*')
    .eq('owner_user_id', user?.id ?? '')
    .order('created_at', { ascending: false })

  const activeCount = (agents ?? []).filter(a => a.status === 'active').length
  const { count: txCount } = await supabase
    .from('transactions')
    .select('*', { count: 'exact', head: true })
    .in('agent_id', (agents ?? []).map(a => a.id))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Agents</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Agents you&apos;ve registered under your account. Issue credentials and simulate transactions in the Sandbox.
          </p>
        </div>
        <Link
          href="/dashboard/agents/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-500 transition-colors"
        >
          Register Agent
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-zinc-200 rounded-xl p-4">
          <div className="text-xs text-zinc-500">Your Agents</div>
          <div className="text-2xl font-bold mt-1">{agents?.length ?? 0}</div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-4">
          <div className="text-xs text-zinc-500">Active</div>
          <div className="text-2xl font-bold mt-1 text-emerald-600">{activeCount}</div>
        </div>
        <div className="bg-white border border-zinc-200 rounded-xl p-4">
          <div className="text-xs text-zinc-500">Total Transactions</div>
          <div className="text-2xl font-bold mt-1">{txCount ?? 0}</div>
        </div>
      </div>

      {/* Agent list */}
      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr>
              <th className="p-3 font-semibold text-zinc-600">Agent Name</th>
              <th className="p-3 font-semibold text-zinc-600">Status</th>
              <th className="p-3 font-semibold text-zinc-600">Created</th>
              <th className="p-3 font-semibold text-zinc-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(agents ?? []).map((agent: any) => (
              <tr key={agent.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                <td className="p-3 font-medium">{agent.name}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    agent.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {agent.status}
                  </span>
                </td>
                <td className="p-3 text-zinc-500">
                  {new Date(agent.created_at).toLocaleDateString()}
                </td>
                <td className="p-3 text-right">
                  <Link href={`/developer/sandbox?agent=${agent.id}`} className="text-blue-600 hover:underline">
                    Test in Sandbox →
                  </Link>
                </td>
              </tr>
            ))}
            {(!agents || agents.length === 0) && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-zinc-500">
                  No agents registered yet. <Link href="/dashboard/agents/new" className="text-blue-600 hover:underline">Register your first agent →</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
