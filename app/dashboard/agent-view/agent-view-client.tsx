'use client'

import { useEffect, useState } from 'react'

interface AgentSummary {
  id: string
  name: string
  status: string
}

interface Credential {
  id: string
  max_amount: number
  allowed_categories: string[] | null
  expires_at: string | null
  status: string
  issued_at?: string
}

interface Decision {
  decision_type: 'approve' | 'deny'
  reason: string
}

interface Transaction {
  id: string
  amount: number
  category: string
  created_at: string
  decisions: Decision[] | Decision | null
}

interface AgentDetail {
  agent: AgentSummary
  credentials: Credential[]
  transactions: Transaction[]
}

export default function AgentViewClient({ agents }: { agents: AgentSummary[] }) {
  const [selectedId, setSelectedId] = useState(agents[0]?.id ?? '')
  const [detail, setDetail] = useState<AgentDetail | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!selectedId) return
    setLoading(true)
    fetch(`/api/agents/${selectedId}`)
      .then((res) => res.json())
      .then((data) => setDetail(data))
      .finally(() => setLoading(false))
  }, [selectedId])

  const activeCredential = detail?.credentials.find((c) => c.status === 'active')

  return (
    <div className="-m-6 min-h-[calc(100vh-49px)] bg-gradient-to-b from-sky-50 to-white text-zinc-900 p-8 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold">AI Interface</h1>
          <p className="text-sm text-zinc-500">
            This is the view of KYA an AI agent effectively has of itself — its own scope and its own transaction outcomes. It cannot see other agents, other users, or edit its own limits.
          </p>
        </div>
        {agents.length > 0 && (
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="bg-white border border-sky-200 rounded-lg px-3 py-2 text-sm shadow-sm focus:outline-none focus:border-sky-400"
          >
            {agents.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.status})
              </option>
            ))}
          </select>
        )}
      </div>

      {agents.length === 0 && (
        <div className="bg-white border border-sky-100 rounded-xl p-8 text-center text-zinc-500 shadow-sm">
          No agents registered yet.
        </div>
      )}

      {loading && <div className="text-sm text-zinc-500">Loading agent scope…</div>}

      {!loading && detail && (
        <>
          <div className="bg-white border border-sky-100 rounded-xl p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">{detail.agent.name}</h2>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  detail.agent.status === 'active'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {detail.agent.status}
              </span>
            </div>

            {activeCredential ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <ScopeStat label="Max spend per transaction" value={`₹${Number(activeCredential.max_amount).toLocaleString('en-IN')}`} />
                <ScopeStat
                  label="Allowed categories"
                  value={activeCredential.allowed_categories?.join(', ') || 'Any'}
                />
                <ScopeStat
                  label="Expires"
                  value={activeCredential.expires_at ? new Date(activeCredential.expires_at).toLocaleDateString() : 'No expiry set'}
                />
              </div>
            ) : (
              <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                No active credential — this agent cannot be verified for any transaction right now.
              </p>
            )}
          </div>

          <div className="bg-white border border-sky-100 rounded-xl p-6 shadow-sm">
            <h2 className="font-semibold mb-4">My recent transaction decisions</h2>
            <div className="space-y-2">
              {detail.transactions.length === 0 && (
                <p className="text-sm text-zinc-500">No transactions attempted yet.</p>
              )}
              {detail.transactions.map((tx) => {
                const decision = Array.isArray(tx.decisions) ? tx.decisions[0] : tx.decisions
                const approved = decision?.decision_type === 'approve'
                return (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between border border-sky-50 rounded-lg px-4 py-3 bg-sky-50/40"
                  >
                    <div>
                      <div className="text-sm font-medium">
                        ₹{Number(tx.amount).toLocaleString('en-IN')} · {tx.category}
                      </div>
                      <div className="text-xs text-zinc-500">
                        {new Date(tx.created_at).toLocaleString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${
                          approved ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {decision?.decision_type ?? 'pending'}
                      </span>
                      <div className="text-xs text-zinc-500 mt-1 max-w-xs">{decision?.reason}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function ScopeStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-sky-50 rounded-lg px-3 py-2">
      <div className="text-[11px] uppercase text-sky-500 font-semibold">{label}</div>
      <div className="text-sm font-medium mt-0.5">{value}</div>
    </div>
  )
}
