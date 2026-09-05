'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface FlagActionsProps {
  flagId: string
  currentStatus: string
}

const rationalePresets: Record<string, string[]> = {
  resolved: [
    'Reviewed — false positive, normal usage pattern',
    'Reviewed — within acceptable risk tolerance',
    'Reviewed — agent scope was recently updated, flag is stale',
  ],
  escalated: [
    'Requires deeper investigation before resolution',
    'Multiple flags from same agent in 24h — pattern review needed',
    'User contacted about suspicious activity — awaiting response',
  ],
}

export default function FlagActions({ flagId, currentStatus }: FlagActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState<'approve' | 'escalate' | 'revoke' | null>(null)
  const [rationale, setRationale] = useState('')
  const [showPresets, setShowPresets] = useState(false)

  const currentPresets = modal && modal !== 'revoke' ? (rationalePresets[modal] ?? []) : [
    'Flagged activity indicates agent may be compromised',
    'Agent exceeded scope limits multiple times',
  ]

  async function handleConfirm() {
    if (!rationale.trim()) {
      alert('A rationale is required for the audit trail.')
      return
    }

    setLoading(true)
    try {
      if (modal === 'approve' || modal === 'escalate') {
        const res = await fetch(`/api/flags/${flagId}/resolve`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            resolution: modal === 'approve' ? 'resolved' : 'escalated',
            rationale: rationale.trim(),
          }),
        })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error ?? 'Failed to update flag')
        }
      } else if (modal === 'revoke') {
        // Resolve the flag first
        const resolveRes = await fetch(`/api/flags/${flagId}/resolve`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resolution: 'resolved', rationale: `[REVOKED] ${rationale.trim()}` }),
        })
        if (!resolveRes.ok) throw new Error('Failed to resolve flag')

        // Get agent_id from the flag
        const flagRes = await fetch(`/api/flags/${flagId}`)
        const flagData = await flagRes.json()

        if (flagData.agent_id) {
          const revokeRes = await fetch('/api/revoke', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              agent_id: flagData.agent_id,
              reason: rationale.trim(),
              revoked_by: 'case_queue',
            }),
          })
          if (!revokeRes.ok) {
            const data = await revokeRes.json().catch(() => ({}))
            throw new Error(data.error ?? 'Failed to revoke agent')
          }
        }
      }

      setModal(null)
      setRationale('')
      setShowPresets(false)
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to complete action')
    } finally {
      setLoading(false)
    }
  }

  const modalConfig = {
    approve: { title: 'Approve Flag', color: 'emerald', icon: '✓', desc: 'Mark this flag as reviewed — a false positive or acceptable risk.' },
    escalate: { title: 'Escalate Flag', color: 'amber', icon: '↑', desc: 'Escalate to senior review. The flag stays open for deeper investigation.' },
    revoke: { title: 'Revoke Agent', color: 'red', icon: '⛔', desc: 'This agent will be immediately shut down. All credentials invalidated.' },
  }

  return (
    <>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => { setModal('approve'); setRationale(rationalePresets.resolved[0]); setShowPresets(true) }}
          disabled={loading}
          className="px-3 py-1.5 rounded text-xs font-medium bg-emerald-950 text-emerald-400 hover:bg-emerald-900 border border-emerald-800 transition-colors disabled:opacity-50"
        >
          Approve
        </button>
        <button
          onClick={() => { setModal('escalate'); setRationale(rationalePresets.escalated[0]); setShowPresets(true) }}
          disabled={loading}
          className="px-3 py-1.5 rounded text-xs font-medium bg-amber-950 text-amber-400 hover:bg-amber-900 border border-amber-800 transition-colors disabled:opacity-50"
        >
          Escalate
        </button>
        <button
          onClick={() => { setModal('revoke'); setRationale('Flagged activity indicates agent may be compromised'); setShowPresets(true) }}
          disabled={loading}
          className="px-3 py-1.5 rounded text-xs font-medium bg-red-950 text-red-400 hover:bg-red-900 border border-red-800 transition-colors disabled:opacity-50"
        >
          Revoke
        </button>
      </div>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => { setModal(null); setRationale(''); setShowPresets(false) }}>
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 w-full max-w-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center gap-3 mb-1">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm border ${
                modal === 'approve' ? 'bg-emerald-950 border-emerald-800 text-emerald-400'
                : modal === 'escalate' ? 'bg-amber-950 border-amber-800 text-amber-400'
                : 'bg-red-950 border-red-800 text-red-400'
              }`}>
                {modalConfig[modal].icon}
              </div>
              <h3 className="text-sm font-semibold text-white">{modalConfig[modal].title}</h3>
            </div>
            <p className="text-xs text-zinc-500 mb-4 ml-11">{modalConfig[modal].desc}</p>

            {/* Quick-select rationale presets */}
            {showPresets && currentPresets.length > 0 && (
              <div className="mb-3">
                <div className="text-[10px] text-zinc-500 uppercase font-semibold mb-2">Quick select</div>
                <div className="space-y-1.5">
                  {currentPresets.map((preset, i) => (
                    <button
                      key={i}
                      onClick={() => setRationale(preset)}
                      className={`w-full text-left px-3 py-2 rounded-lg border text-xs transition-all ${
                        rationale === preset
                          ? modal === 'approve' ? 'bg-emerald-950/40 border-emerald-700 text-white'
                            : modal === 'escalate' ? 'bg-amber-950/40 border-amber-700 text-white'
                            : 'bg-red-950/40 border-red-700 text-white'
                          : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Free-text rationale */}
            <div className="mb-4">
              <div className="text-[10px] text-zinc-500 uppercase font-semibold mb-1.5">Rationale (required for audit trail)</div>
              <textarea
                value={rationale}
                onChange={(e) => setRationale(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white font-mono h-16 resize-none focus:outline-none focus:border-blue-500 placeholder:text-zinc-600"
                placeholder="Explain your decision..."
              />
            </div>

            {modal === 'revoke' && (
              <div className="mb-4 bg-amber-950/30 border border-amber-900/50 rounded-lg px-3 py-2 text-[11px] text-amber-300">
                ⚠ This will immediately invalidate all of the agent&apos;s active credentials. This action is permanent and will be recorded in the immutable audit log.
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between items-center pt-1">
              <button
                onClick={() => { setModal(null); setRationale(''); setShowPresets(false) }}
                disabled={loading}
                className="px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading || !rationale.trim()}
                className={`px-5 py-2 rounded-lg text-xs font-semibold text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors ${
                  modal === 'approve' ? 'bg-emerald-600 hover:bg-emerald-500'
                  : modal === 'escalate' ? 'bg-amber-600 hover:bg-amber-500'
                  : 'bg-red-600 hover:bg-red-500'
                }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  `Confirm ${modal === 'approve' ? 'Approval' : modal === 'escalate' ? 'Escalation' : 'Revocation'}`
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
