'use client'

import { useState, useEffect } from 'react'

interface Agent {
  id: string
  name: string
  status: string
}

interface Credential {
  id: string
  max_amount: number
  allowed_categories: string[] | null
  token: string
  status: string
  expires_at: string | null
}

interface VerifyResult {
  decision: string
  reason: string
  transaction_id?: string
  outage?: boolean
}

interface AnomalyResult {
  flagged: boolean
  flag_id?: string
  risk_score?: number
  reason_codes?: string[]
}

export default function SandboxClient() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [selectedAgentId, setSelectedAgentId] = useState('')
  const [credentials, setCredentials] = useState<Credential[]>([])
  const [selectedCred, setSelectedCred] = useState<Credential | null>(null)
  const [amount, setAmount] = useState('1500')
  const [category, setCategory] = useState('groceries')
  const [loading, setLoading] = useState(false)

  const [verifyResult, setVerifyResult] = useState<VerifyResult | null>(null)
  const [anomalyResult, setAnomalyResult] = useState<AnomalyResult | null>(null)
  const [history, setHistory] = useState<Array<{
    time: string; amount: number; category: string; decision: string; reason: string; flagged: boolean
  }>>([])

  useEffect(() => {
    fetch('/api/agents?developer=1')
      .then(r => r.json())
      .then(data => setAgents(data.agents ?? []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!selectedAgentId) return
    fetch(`/api/agents/${selectedAgentId}`)
      .then(r => r.json())
      .then(data => {
        const creds = (data.credentials ?? []).filter((c: Credential) => c.status === 'active')
        setCredentials(creds)
        setSelectedCred(creds[0] ?? null)
      })
      .catch(() => {})
  }, [selectedAgentId])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const agentParam = params.get('agent')
    if (agentParam) setSelectedAgentId(agentParam)
  }, [])

  async function runSimulation() {
    if (!selectedCred) {
      alert('No active credential found for this agent. Issue one first from the Credentials page.')
      return
    }

    setLoading(true)
    setVerifyResult(null)
    setAnomalyResult(null)

    try {
      const verifyRes = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: selectedCred.token,
          amount: Number(amount),
          category,
        }),
      })
      const vData = await verifyRes.json()
      setVerifyResult(vData)

      if (vData.transaction_id) {
        const anomalyRes = await fetch('/api/anomaly-check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transaction_id: vData.transaction_id }),
        })
        const aData = await anomalyRes.json()
        setAnomalyResult(aData)

        setHistory(prev => [{
          time: new Date().toLocaleTimeString(),
          amount: Number(amount),
          category,
          decision: vData.decision,
          reason: vData.reason,
          flagged: aData.flagged,
        }, ...prev].slice(0, 20))
      }
    } catch (err) {
      setVerifyResult({ decision: 'error', reason: err instanceof Error ? err.message : 'Request failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Sandbox Playground</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Simulate an agent transaction against the real KYA verification and anomaly detection APIs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-zinc-200 rounded-xl p-6 space-y-4">
          <h2 className="font-semibold">Transaction Simulator</h2>

          <div>
            <label className="block text-xs text-zinc-500 mb-1">Select Agent</label>
            <select
              value={selectedAgentId}
              onChange={(e) => setSelectedAgentId(e.target.value)}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Choose an agent...</option>
              {agents.map(a => (
                <option key={a.id} value={a.id}>{a.name} ({a.status})</option>
              ))}
            </select>
          </div>

          {selectedCred && (
            <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3 text-xs">
              <div className="font-medium text-zinc-700 mb-1">Active Credential</div>
              <div className="text-zinc-500">
                Max: ₹{Number(selectedCred.max_amount).toLocaleString('en-IN')} · Categories: {selectedCred.allowed_categories?.join(', ')}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Amount (₹)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Category</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. groceries"
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>

          <button
            onClick={runSimulation}
            disabled={loading || !selectedCred}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-blue-500 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Running...' : 'Run Transaction →'}
          </button>

          <div className="flex gap-2 flex-wrap">
            <button onClick={() => { setAmount('1500'); setCategory('groceries') }} className="text-[10px] bg-zinc-100 text-zinc-600 px-2 py-1 rounded border border-zinc-200 hover:bg-zinc-200">
              ✅ Safe grocery
            </button>
            <button onClick={() => { setAmount('99999'); setCategory('groceries') }} className="text-[10px] bg-zinc-100 text-zinc-600 px-2 py-1 rounded border border-zinc-200 hover:bg-zinc-200">
              ❌ Over limit
            </button>
            <button onClick={() => { setAmount('2000'); setCategory('electronics') }} className="text-[10px] bg-zinc-100 text-zinc-600 px-2 py-1 rounded border border-zinc-200 hover:bg-zinc-200">
              ❌ Wrong category
            </button>
            {selectedCred && (
              <button onClick={() => { setAmount(String(Math.round(Number(selectedCred!.max_amount) * 0.9))); setCategory(selectedCred!.allowed_categories?.[0] ?? 'groceries') }} className="text-[10px] bg-amber-100 text-amber-700 px-2 py-1 rounded border border-amber-200 hover:bg-amber-200">
                ⚠️ Near ceiling
              </button>
            )}
          </div>
        </div>

        <div className="space-y-4">
          {verifyResult && (
            <div className={`border rounded-xl p-5 ${
              verifyResult.decision === 'approve'
                ? 'bg-emerald-50 border-emerald-200'
                : verifyResult.decision === 'deny'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-zinc-50 border-zinc-200'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-lg font-bold uppercase ${
                  verifyResult.decision === 'approve' ? 'text-emerald-700' : 'text-red-700'
                }`}>
                  {verifyResult.decision}
                </span>
                {verifyResult.outage && (
                  <span className="text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded border border-amber-200">
                    OUTAGE MODE
                  </span>
                )}
              </div>
              <p className="text-sm text-zinc-600">{verifyResult.reason}</p>
              {verifyResult.transaction_id && (
                <p className="text-[10px] text-zinc-400 mt-1 font-mono">tx: {verifyResult.transaction_id}</p>
              )}
            </div>
          )}

          {anomalyResult && (
            <div className={`border rounded-xl p-5 ${
              anomalyResult.flagged
                ? 'bg-amber-50 border-amber-200'
                : 'bg-emerald-50 border-emerald-200'
            }`}>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-sm font-bold ${anomalyResult.flagged ? 'text-amber-700' : 'text-emerald-700'}`}>
                  {anomalyResult.flagged ? '⚠️ FLAGGED' : '✅ No anomaly detected'}
                </span>
              </div>
              {anomalyResult.flagged && anomalyResult.reason_codes && (
                <div className="mt-2 space-y-1">
                  <div className="text-xs text-zinc-600">
                    Risk score: <span className="font-bold">{((anomalyResult.risk_score ?? 0) * 100).toFixed(0)}%</span>
                  </div>
                  {anomalyResult.reason_codes.map((code, i) => (
                    <div key={i} className="text-xs text-amber-700 bg-amber-100 border border-amber-200 rounded px-2 py-1">
                      {code}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {history.length > 0 && (
        <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
          <div className="p-4 border-b border-zinc-200">
            <h2 className="font-semibold text-sm">Simulation History</h2>
          </div>
          <table className="w-full text-xs text-left">
            <thead className="bg-zinc-50 border-b border-zinc-200">
              <tr>
                <th className="p-3 text-zinc-500 font-medium">Time</th>
                <th className="p-3 text-zinc-500 font-medium">Amount</th>
                <th className="p-3 text-zinc-500 font-medium">Category</th>
                <th className="p-3 text-zinc-500 font-medium">Decision</th>
                <th className="p-3 text-zinc-500 font-medium">Reason</th>
                <th className="p-3 text-zinc-500 font-medium">Flagged</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, i) => (
                <tr key={i} className="border-b border-zinc-100">
                  <td className="p-3 text-zinc-500 font-mono">{h.time}</td>
                  <td className="p-3">₹{h.amount.toLocaleString('en-IN')}</td>
                  <td className="p-3 text-zinc-600">{h.category}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      h.decision === 'approve'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {h.decision}
                    </span>
                  </td>
                  <td className="p-3 text-zinc-600 max-w-xs truncate">{h.reason}</td>
                  <td className="p-3">{h.flagged ? '⚠️' : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
