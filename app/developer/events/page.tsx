import { createClient } from '@/lib/supabase/server'

export const instant = false

export default async function DeveloperEventsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get user's agents
  const { data: agents } = await supabase
    .from('agents')
    .select('id, name')
    .eq('owner_user_id', user?.id ?? '')

  const agentIds = (agents ?? []).map(a => a.id)
  const agentMap: Record<string, string> = {}
  for (const a of agents ?? []) agentMap[a.id] = a.name

  // Get decisions for user's agents' transactions
  const { data: events } = await supabase
    .from('decisions')
    .select('*, transactions!inner(agent_id, amount, category)')
    .in('transactions.agent_id', agentIds.length > 0 ? agentIds : ['__none__'])
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Event Log</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Webhook/event log showing what KYA has decided for your agents&apos; transactions. In production, these would be delivered to your registered webhook URL in real time.
        </p>
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr>
              <th className="p-3 font-semibold text-zinc-600">Timestamp</th>
              <th className="p-3 font-semibold text-zinc-600">Agent</th>
              <th className="p-3 font-semibold text-zinc-600">Event Type</th>
              <th className="p-3 font-semibold text-zinc-600">Amount</th>
              <th className="p-3 font-semibold text-zinc-600">Category</th>
              <th className="p-3 font-semibold text-zinc-600">Decision</th>
              <th className="p-3 font-semibold text-zinc-600">Reason</th>
            </tr>
          </thead>
          <tbody>
            {(events ?? []).map((event: any) => {
              const tx = event.transactions
              return (
                <tr key={event.id} className="border-b border-zinc-100">
                  <td className="p-3 text-zinc-500 font-mono whitespace-nowrap">
                    {new Date(event.created_at).toISOString().replace('T', ' ').substring(0, 19)}
                  </td>
                  <td className="p-3 font-medium">
                    {agentMap[tx?.agent_id] ?? tx?.agent_id?.slice(0, 8) ?? '—'}
                  </td>
                  <td className="p-3">
                    <span className="text-[10px] bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded font-medium">
                      transaction.{event.decision_type === 'approve' ? 'approved' : 'denied'}
                    </span>
                  </td>
                  <td className="p-3">₹{Number(tx?.amount ?? 0).toLocaleString('en-IN')}</td>
                  <td className="p-3 text-zinc-600">{tx?.category ?? '—'}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      event.decision_type === 'approve'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {event.decision_type}
                    </span>
                  </td>
                  <td className="p-3 text-zinc-600 max-w-xs truncate">{event.reason}</td>
                </tr>
              )
            })}
            {(!events || events.length === 0) && (
              <tr>
                <td colSpan={7} className="p-8 text-center text-zinc-500">
                  No events yet. Run a transaction in the Sandbox to see events here.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
