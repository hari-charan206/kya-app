'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ApproveButton({ pendingId }: { pendingId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<'approved' | 'rejected' | null>(null)
  const [modal, setModal] = useState<'approve' | 'reject' | null>(null)
  const [rationale, setRationale] = useState('')

  const rejectPresets = [
    'Amount exceeds current risk tolerance for this agent type',
    'Agent has unresolved anomaly flags — pending investigation',
    'Insufficient documentation for scope requested',
  ]

  const approvePresets = [
    'Verified with requesting admin — approved for production use',
    'Agent history is clean — within acceptable risk parameters',
    'One-time elevated access for scheduled operation',
  ]

  async function handleConfirm() {
    setLoading(true)
    try {
      const endpoint = modal === 'approve'
        ? `/api/pending-credentials/${pendingId}/approve`
        : `/api/pending-credentials/${pendingId}/reject`

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          approved_by: 'senior_admin',
          ...(modal === 'reject' && { reason: rationale.trim() || 'No reason provided' }),
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'Failed')
      }

      setResult(modal === 'approve' ? 'approved' : 'rejected')
      setModal(null)
      setRationale('')
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Action failed')
    } finally {
      setLoading(false)
    }
  }

  if (result === 'approved') {
    return <span className="text-xs text-emerald-400 font-medium">✓ Approved & credential issued</span>
  }
  if (result === 'rejected') {
    return <span className="text-xs text-red-400 font-medium">✗ Rejected</span>
  }

  const presets = modal === 'approve' ? approvePresets : rejectPresets

  return (
    <>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => { setModal('approve'); setRationale(approvePresets[0]) }}
          disabled={loading}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded text-xs font-medium transition-colors"
        >
          Approve
        </button>
        <button
          onClick={() => { setModal('reject'); setRationale(rejectPresets[0]) }}
          disabled={loading}
          className="px-4 py-2 bg-red-600/80 hover:bg-red-500 disabled:opacity-50 text-white rounded text-xs font-medium transition-colors"
        >
          Reject
        </button>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => { setModal(null); setRationale('') }}>
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 w-full max-w-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-1">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm border ${
                modal === 'approve'
                  ? 'bg-emerald-950 border-emerald-800 text-emerald-400'
                  : 'bg-red-950 border-red-800 text-red-400'
              }`}>
                {modal === 'approve' ? '✓' : '✗'}
              </div>
              <h3 className="text-sm font-semibold text-white">
                {modal === 'approve' ? 'Approve Credential Request' : 'Reject Credential Request'}
              </h3>
            </div>
            <p className="text-xs text-zinc-500 mb-4 ml-11">
              {modal === 'approve'
                ? 'A signed credential will be issued immediately with the requested scope.'
                : 'The request will be marked as rejected. The requester can submit a new request later.'}
            </p>

            {/* Quick-select rationale */}
            <div className="mb-3">
              <div className="text-[10px] text-zinc-500 uppercase font-semibold mb-2">Quick select</div>
              <div className="space-y-1.5">
                {presets.map((preset, i) => (
                  <button
                    key={i}
                    onClick={() => setRationale(preset)}
                    className={`w-full text-left px-3 py-2 rounded-lg border text-xs transition-all ${
                      rationale === preset
                        ? modal === 'approve'
                          ? 'bg-emerald-950/40 border-emerald-700 text-white'
                          : 'bg-red-950/40 border-red-700 text-white'
                        : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <div className="text-[10px] text-zinc-500 uppercase font-semibold mb-1.5">Rationale (required for audit trail)</div>
              <textarea
                value={rationale}
                onChange={(e) => setRationale(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white font-mono h-16 resize-none focus:outline-none focus:border-blue-500 placeholder:text-zinc-600"
                placeholder="Explain your decision..."
              />
            </div>

            <div className="flex justify-between items-center pt-1">
              <button
                onClick={() => { setModal(null); setRationale('') }}
                disabled={loading}
                className="px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading || !rationale.trim()}
                className={`px-5 py-2 rounded-lg text-xs font-semibold text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors ${
                  modal === 'approve'
                    ? 'bg-emerald-600 hover:bg-emerald-500'
                    : 'bg-red-600 hover:bg-red-500'
                }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  modal === 'approve' ? 'Confirm Approval' : 'Confirm Rejection'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
