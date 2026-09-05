import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const instant = false

interface Transaction {
  id: string
  amount: number
  category: string
  agent_id: string
  created_at: string
  credentials?: { max_amount?: number; agent_id?: string }
  agents?: { name?: string }
}

interface Decision {
  decision_type: 'approve' | 'deny'
  reason: string
  created_at: string
  transactions?: Transaction
}

export default async function MonitorPage() {
  const supabase = await createClient()

  // Fetch recent decisions with joined transaction data
  const { data: decisions } = await supabase
    .from('decisions')
    .select('*, transactions(*, agents(name))')
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Link href="/dashboard" className="text-xs text-blue-400 hover:underline mb-2 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-2xl font-semibold text-white">Live Transaction Monitor</h1>
          <p className="text-xs text-zinc-500 mt-1">Real-time feed of agent transactions and verification decisions.</p>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead className="text-zinc-500 border-b border-zinc-800">
            <tr>
              <th className="pb-2 pr-4">Timestamp</th>
              <th className="pb-2 pr-4">Agent</th>
              <th className="pb-2 pr-4">Amount</th>
              <th className="pb-2 pr-4">Category</th>
              <th className="pb-2 pr-4">Decision</th>
              <th className="pb-2">Reason</th>
            </tr>
          </thead>
          <tbody className="font-mono text-zinc-300">
            {(decisions ?? []).map((decision: any) => {
              const tx = decision.transactions
              const agent = tx?.agents
              const isApprove = decision.decision_type === 'approve'
              return (
                <tr key={decision.id} className="border-b border-zinc-900/50">
                  <td className="py-3 pr-4 text-zinc-500">
                    {new Date(decision.created_at).toISOString().replace('T', ' ').substring(0, 19)}
                  </td>
                  <td className="py-3 pr-4 font-semibold text-white">
                    {agent?.name ?? tx?.agent_id?.slice(0, 8) ?? '—'}
                  </td>
                  <td className="py-3 pr-4">
                    ₹{Number(tx?.amount ?? 0).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 pr-4 text-zinc-400">
                    {tx?.category ?? '—'}
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${
                      isApprove
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : 'bg-red-950 text-red-400 border border-red-800'
                    }`}>
                      {decision.decision_type}
                    </span>
                  </td>
                  <td className="py-3 text-zinc-400 truncate max-w-xs">
                    {decision.reason}
                  </td>
                </tr>
              )
            })}
            {(!decisions || decisions.length === 0) && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-zinc-500">
                  No transactions yet. Verify a transaction via the API to see it here.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
