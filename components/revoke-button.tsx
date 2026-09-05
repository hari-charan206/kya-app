'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface RevokeButtonProps {
  agentId: string
  currentStatus?: string
}

const reasonOptions = [
  { value: 'agent_compromised', label: 'Agent Compromised', icon: '🔓', desc: 'Behaviour indicates it may be hacked or hijacked' },
  { value: 'policy_violation', label: 'Policy Violation', icon: '⚠️', desc: 'Repeatedly exceeded its allowed scope' },
  { value: 'user_request', label: 'User Request', icon: '👤', desc: 'The owning user asked to shut it down' },
  { value: 'suspicious_activity', label: 'Suspicious Activity', icon: '🔍', desc: 'Anomaly flags indicate abnormal patterns' },
  { value: 'other', label: 'Other Reason', icon: '📝', desc: 'Provide a custom reason below' },
]

export default function RevokeButton({ agentId, currentStatus = 'active' }: RevokeButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState(currentStatus)
  const [showReasonModal, setShowReasonModal] = useState(false)
  const [selectedReason, setSelectedReason] = useState('')
  const [customReason, setCustomReason] = useState('')

  function getResolvedReason(): string {
    if (selectedReason === 'other') return customReason.trim() || 'No reason provided'
    const opt = reasonOptions.find(o => o.value === selectedReason)
    return opt ? `${opt.label}: ${opt.desc}` : 'Revoked from admin dashboard'
  }

  const handleRevoke = async () => {
    const reasonText = getResolvedReason()
    try {
      setIsLoading(true)
      const response = await fetch('/api/revoke', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent_id: agentId, reason: reasonText }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error ?? 'Failed to revoke agent')
      }

      setStatus('revoked')
      setShowReasonModal(false)
      setSelectedReason('')
      setCustomReason('')
      router.refresh()
    } catch (error) {
      console.error('Error revoking agent:', error)
      alert(error instanceof Error ? error.message : 'Failed to revoke. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleReactivate = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/agents/${agentId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'active' }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error ?? 'Failed to activate agent')
      }

      setStatus('active')
      router.refresh()
    } catch (error) {
      console.error('Error activating agent:', error)
      alert(error instanceof Error ? error.message : 'Failed to activate. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const isRevoked = status === 'revoked'

  return (
    <>
      <button
        onClick={() => isRevoked ? handleReactivate() : setShowReasonModal(true)}
        disabled={isLoading}
        className={`px-3 py-1 rounded text-xs font-medium transition-colors disabled:opacity-50 ${
          isRevoked
            ? 'bg-emerald-950 text-emerald-400 hover:bg-emerald-900 border border-emerald-800'
            : 'bg-red-950 text-red-400 hover:bg-red-900 border border-red-800'
        }`}
      >
        {isLoading ? 'Processing...' : isRevoked ? 'Activate' : 'Revoke'}
      </button>

      {showReasonModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => !isLoading && setShowReasonModal(false)}
        >
          <div
            className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 w-full max-w-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-lg bg-red-950 border border-red-800 flex items-center justify-center text-red-400 text-sm">
                ⛔
              </div>
              <h3 className="text-sm font-semibold text-white">Revoke Agent</h3>
            </div>
            <p className="text-xs text-zinc-500 mb-5 ml-11">
              Select a reason for the audit trail. This will immediately invalidate all active credentials.
            </p>

            {/* Toggle bar options */}
            <div className="space-y-2 mb-4">
              {reasonOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedReason(opt.value)}
                  disabled={isLoading}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-all text-xs ${
                    selectedReason === opt.value
                      ? 'bg-red-950/40 border-red-700 text-white'
                      : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base">{opt.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold">{opt.label}</div>
                      <div className="text-[10px] opacity-60 mt-0.5">{opt.desc}</div>
                    </div>
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      selectedReason === opt.value
                        ? 'border-red-500 bg-red-500'
                        : 'border-zinc-600'
                    }`}>
                      {selectedReason === opt.value && (
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Custom reason input (shown only when "Other" is selected) */}
            {selectedReason === 'other' && (
              <div className="mb-4">
                <textarea
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2 text-xs text-white font-mono h-16 resize-none focus:outline-none focus:border-red-500 placeholder:text-zinc-600"
                  placeholder="Type your reason here..."
                  autoFocus
                />
              </div>
            )}

            {/* Warning */}
            {selectedReason && selectedReason !== 'other' && (
              <div className="mb-4 bg-amber-950/30 border border-amber-900/50 rounded-lg px-3 py-2 text-[11px] text-amber-300">
                ⚠ This action is permanent and will be recorded in the immutable audit log with your selected reason.
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-between items-center pt-1">
              <button
                onClick={() => {
                  setShowReasonModal(false)
                  setSelectedReason('')
                  setCustomReason('')
                }}
                disabled={isLoading}
                className="px-3 py-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRevoke}
                disabled={isLoading || !selectedReason || (selectedReason === 'other' && !customReason.trim())}
                className="px-5 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-lg text-xs font-semibold transition-colors"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Revoking...
                  </span>
                ) : (
                  'Confirm Revoke'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
