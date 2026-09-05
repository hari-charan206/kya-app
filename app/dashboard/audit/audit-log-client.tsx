'use client'

import { useState, useEffect } from 'react'

interface AuditEntry {
  id: string
  entity_type: string
  entity_id: string
  action: string
  actor: string
  details?: string
  created_at: string
}

interface AuditLogClientProps {
  agents: { id: string; name: string }[]
  actionOptions: string[]
  agentMap: Record<string, string>
}

const actionDescriptions: Record<string, { label: string; color: string }> = {
  agent_registered: { label: 'Agent Registered', color: 'blue' },
  agent_revoked: { label: 'Agent Revoked', color: 'red' },
  agent_reactivated: { label: 'Agent Reactivated', color: 'emerald' },
  credential_issued: { label: 'Credential Issued', color: 'emerald' },
  credential_issued_after_approval: { label: 'Credential Issued (Approved)', color: 'emerald' },
  credential_pending_approval: { label: 'Credential Pending', color: 'amber' },
  transaction_approved: { label: 'Transaction Approved', color: 'emerald' },
  transaction_denied_fail_safe: { label: 'Transaction Blocked (Outage)', color: 'amber' },
  flag_resolved: { label: 'Flag Resolved', color: 'emerald' },
  flag_escalated: { label: 'Flag Escalated', color: 'amber' },
  policy_updated: { label: 'Policy Updated', color: 'blue' },
  outage_activated: { label: 'Outage Simulated', color: 'red' },
  outage_deactivated: { label: 'Outage Ended', color: 'emerald' },
}

export default function AuditLogClient({ agents, actionOptions, agentMap }: AuditLogClientProps) {
  const [entries, setEntries] = useState<AuditEntry[]>([])
  const [loading, setLoading] = useState(true)

  // Filter state
  const [filterAgent, setFilterAgent] = useState('')
  const [filterAction, setFilterAction] = useState('')
  const [filterActor, setFilterActor] = useState('')
  const [filterFrom, setFilterFrom] = useState('')
  const [filterTo, setFilterTo] = useState('')

  async function fetchLogs() {
    setLoading(true)
    const params = new URLSearchParams()
    if (filterAgent) params.set('agent', filterAgent)
    if (filterAction) params.set('action', filterAction)
    if (filterActor) params.set('actor', filterActor)
    if (filterFrom) params.set('from', filterFrom)
    if (filterTo) params.set('to', filterTo + 'T23:59:59')

    const res = await fetch(`/api/audit-log?${params.toString()}`)
    const data = await res.json()
    setEntries(data.entries ?? [])
    setLoading(false)
  }

  useEffect(() => {
    fetchLogs()
  }, [filterAgent, filterAction, filterActor, filterFrom, filterTo])

  function resolveEntity(entry: AuditEntry): string {
    // Try to resolve agent names from entity_id or details
    if (entry.entity_type === 'agent' || entry.entity_type === 'credential') {
      const name = agentMap[entry.entity_id]
      if (name) return `${entry.entity_type}: ${name}`
    }
    // Try to extract agent name from details
    const match = entry.details?.match(/"?(GroceryBot|TravelPlanner|BillPayAssist|PriceHunter|SubManager|ExpenseTracker)"?/)
    if (match) return `${entry.entity_type}: ${match[1]}`
    return entry.entity_type
  }

  function exportCSV() {
    const headers = ['Timestamp', 'Action', 'Entity', 'Actor', 'Details']
    const rows = entries.map(e => [
      new Date(e.created_at).toISOString(),
      e.action,
      resolveEntity(e),
      e.actor,
      `"${(e.details ?? '').replace(/"/g, '""')}"`,
    ])
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `kya-audit-log-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-zinc-400 uppercase">Filters</h2>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-zinc-600">{entries.length} entries</span>
            <button
              onClick={exportCSV}
              disabled={entries.length === 0}
              className="px-3 py-1.5 rounded text-xs font-medium bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700 transition-colors disabled:opacity-40"
            >
              ↓ Export CSV
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div>
            <label className="block text-[10px] text-zinc-500 mb-1">Agent</label>
            <select
              value={filterAgent}
              onChange={(e) => setFilterAgent(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-xs text-zinc-300 font-mono"
            >
              <option value="">All agents</option>
              {agents.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] text-zinc-500 mb-1">Action</label>
            <select
              value={filterAction}
              onChange={(e) => setFilterAction(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-xs text-zinc-300 font-mono"
            >
              <option value="">All actions</option>
              {actionOptions.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] text-zinc-500 mb-1">Actor</label>
            <input
              type="text"
              value={filterActor}
              onChange={(e) => setFilterActor(e.target.value)}
              placeholder="e.g. admin_hcharan"
              className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-xs text-zinc-300 font-mono"
            />
          </div>
          <div>
            <label className="block text-[10px] text-zinc-500 mb-1">From</label>
            <input
              type="date"
              value={filterFrom}
              onChange={(e) => setFilterFrom(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-xs text-zinc-300 font-mono"
            />
          </div>
          <div>
            <label className="block text-[10px] text-zinc-500 mb-1">To</label>
            <input
              type="date"
              value={filterTo}
              onChange={(e) => setFilterTo(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded px-2 py-1.5 text-xs text-zinc-300 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 overflow-x-auto">
        {loading ? (
          <div className="py-6 text-center text-zinc-500 text-sm">Loading audit log...</div>
        ) : (
          <table className="w-full text-xs text-left">
            <thead className="text-zinc-500 border-b border-zinc-800">
              <tr>
                <th className="pb-2 pr-4">Timestamp</th>
                <th className="pb-2 pr-4">Action</th>
                <th className="pb-2 pr-4">Entity</th>
                <th className="pb-2 pr-4">Actor</th>
                <th className="pb-2">Details</th>
              </tr>
            </thead>
            <tbody className="font-mono text-zinc-300">
              {entries.map((log) => {
                const actionInfo = actionDescriptions[log.action]
                const color = actionInfo?.color ?? 'zinc'
                return (
                  <tr key={log.id} className="border-b border-zinc-900/50 hover:bg-zinc-900/30">
                    <td className="py-3 pr-4 text-zinc-500 whitespace-nowrap">
                      {new Date(log.created_at).toISOString().replace('T', ' ').substring(0, 19)}
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        color === 'emerald' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : color === 'red' ? 'bg-red-950 text-red-400 border border-red-800'
                        : color === 'amber' ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : color === 'blue' ? 'bg-blue-950 text-blue-400 border border-blue-800'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                      }`}>
                        {actionInfo?.label ?? log.action}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-zinc-400">
                      {resolveEntity(log)}
                    </td>
                    <td className="py-3 pr-4 font-semibold text-white">
                      {log.actor}
                    </td>
                    <td className="py-3 text-zinc-400 max-w-xs truncate">
                      {log.details ?? '—'}
                    </td>
                  </tr>
                )
              })}
              {entries.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-zinc-500">
                    No audit log entries match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
