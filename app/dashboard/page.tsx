import { createClient } from '@/lib/supabase/server'
import OverviewChart from './overview-chart'

export const instant = false

export default async function OverviewPage() {
  const supabase = await createClient()

  const { count: activeAgents } = await supabase
    .from('agents').select('*', { count: 'exact', head: true }).eq('status', 'active')

  const { data: activeCreds } = await supabase
    .from('credentials').select('max_amount').eq('status', 'active')
  const totalExposure = (activeCreds ?? []).reduce((sum, c) => sum + Number(c.max_amount), 0)

  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  const { count: txLast24h } = await supabase
    .from('transactions').select('*', { count: 'exact', head: true }).gte('created_at', oneDayAgo)

  const { count: openFlags } = await supabase
    .from('anomaly_flags').select('*', { count: 'exact', head: true }).eq('status', 'open')

  const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const { count: revokedThisWeek } = await supabase
    .from('revocation_events').select('*', { count: 'exact', head: true }).gte('created_at', oneWeekAgo)

  const { data: recentTx } = await supabase
    .from('transactions').select('amount, created_at, decisions(decision_type)')
    .gte('created_at', oneDayAgo).order('created_at', { ascending: true })

  const chartData = (recentTx ?? []).map((t: any) => ({
    time: new Date(t.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    amount: t.amount,
  }))

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Overview</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatCard label="Active Agents" value={activeAgents ?? 0} />
        <StatCard label="Total Exposure" value={`₹${totalExposure.toLocaleString('en-IN')}`} />
        <StatCard label="Transactions (24h)" value={txLast24h ?? 0} />
        <StatCard label="Open Anomaly Flags" value={openFlags ?? 0} />
        <StatCard label="Revoked This Week" value={revokedThisWeek ?? 0} />
      </div>
      <div className="border border-zinc-800 rounded-lg p-4">
        <h2 className="text-sm text-zinc-400 mb-4">Transaction amounts, last 24h</h2>
        <OverviewChart data={chartData} />
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border border-zinc-800 rounded-lg p-4">
      <div className="text-xs text-zinc-500">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  )
}