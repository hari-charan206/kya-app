'use client'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

export default function OverviewChart({ data }: { data: { time: string; amount: number }[] }) {
  if (data.length === 0) {
    return <div className="text-sm text-zinc-500">No transactions in the last 24 hours yet.</div>
  }
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
        <XAxis dataKey="time" stroke="#71717a" fontSize={11} />
        <YAxis stroke="#71717a" fontSize={11} />
        <Tooltip contentStyle={{ background: '#18181b', border: '1px solid #3f3f46' }} />
        <Line type="monotone" dataKey="amount" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}