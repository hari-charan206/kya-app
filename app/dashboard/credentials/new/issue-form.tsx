'use client'
import { useState, useEffect } from 'react'

export default function IssueForm({ agents }: { agents: { id: string, name: string }[] }) {
  const [loading, setLoading] = useState(false)
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [pendingInfo, setPendingInfo] = useState<{ pending_id: string; message: string } | null>(null)
  const [maxThreshold, setMaxThreshold] = useState<number>(50000)

  // Fetch the current policy threshold on mount
  useEffect(() => {
    fetch('/api/policy-settings')
      .then(r => r.json())
      .then(data => {
        const settings = data.settings ?? []
        const maxRow = settings.find((s: any) => s.key === 'max_auto_approved_credential')
        if (maxRow) setMaxThreshold(Number(maxRow.value))
      })
      .catch(() => {})
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setToken('')
    setError('')
    setPendingInfo(null)

    const formData = new FormData(e.currentTarget)
    const body = {
      agent_id: formData.get('agent_id'),
      max_amount: Number(formData.get('max_amount')),
      allowed_categories: (formData.get('categories') as string).split(',').map(s => s.trim()),
      expires_in_days: Number(formData.get('expires_in_days')),
    }

    const res = await fetch('/api/credentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error ?? 'Failed to issue credential')
      return
    }

    if (data.pending_approval) {
      setPendingInfo({ pending_id: data.pending_id, message: data.message })
      return
    }

    if (data.token) setToken(data.token)
  }

  const amountExceedsThreshold = (amount: number) => amount > maxThreshold

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4 border border-zinc-800 p-4 rounded-lg bg-zinc-900/20">
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Select Agent</label>
          <select name="agent_id" required className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm text-white">
            {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">Max Amount (₹)</label>
          <input
            type="number"
            name="max_amount"
            defaultValue={5000}
            required
            className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm text-white"
          />
          <div className="text-[10px] text-zinc-600 mt-1">
            Auto-approve threshold: ₹{maxThreshold.toLocaleString('en-IN')} — amounts above this require senior_admin approval.
          </div>
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">Allowed Categories (comma separated)</label>
          <input type="text" name="categories" defaultValue="groceries, utilities" required className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm text-white" />
        </div>

        <div>
          <label className="block text-sm text-zinc-400 mb-1">Expires in (Days)</label>
          <input type="number" name="expires_in_days" defaultValue={7} required className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm text-white" />
        </div>

        {error && (
          <div className="bg-red-950/30 border border-red-900 rounded-lg px-3 py-2 text-xs text-red-400">
            {error}
          </div>
        )}

        <button disabled={loading} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded text-sm font-medium w-full disabled:opacity-50">
          {loading ? 'Generating...' : 'Issue Signed JWT'}
        </button>
      </form>

      {/* Success: credential issued */}
      {token && (
        <div className="p-4 bg-emerald-950/30 border border-emerald-900 rounded-lg space-y-2">
          <div className="text-emerald-400 text-sm font-semibold">✓ Credential Issued Successfully</div>
          <div className="text-[11px] text-zinc-500">This credential is now active and ready to verify transactions.</div>
          <textarea readOnly value={token} className="w-full bg-zinc-950 border border-zinc-800 text-xs font-mono p-2 rounded h-24 text-zinc-300" />
        </div>
      )}

      {/* Pending approval */}
      {pendingInfo && (
        <div className="p-4 bg-amber-950/30 border border-amber-900 rounded-lg space-y-2">
          <div className="text-amber-400 text-sm font-semibold">⏳ Pending Senior Admin Approval</div>
          <div className="text-xs text-zinc-400">{pendingInfo.message}</div>
          <div className="text-[11px] text-zinc-500">
            A senior admin must review and approve this request from the{' '}
            <span className="text-amber-400 font-medium">Pending Approvals</span> page before the credential is issued.
          </div>
          <div className="text-[10px] text-zinc-600 font-mono">Request ID: {pendingInfo.pending_id}</div>
        </div>
      )}
    </div>
  )
}
