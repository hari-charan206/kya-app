'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface SettingsFormProps {
  settings: Record<string, any>
}

export default function SettingsForm({ settings }: SettingsFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const [maxAmount, setMaxAmount] = useState(Number(settings.max_auto_approved_credential ?? 50000))
  const [defaultExpiry, setDefaultExpiry] = useState(Number(settings.default_expiry_days ?? 30))
  const [failMode, setFailMode] = useState(settings.fail_mode ?? 'fail-safe')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSuccess(false)
    setError('')

    const updates = [
      { key: 'max_auto_approved_credential', value: maxAmount },
      { key: 'default_expiry_days', value: defaultExpiry },
      { key: 'fail_mode', value: failMode },
    ]

    try {
      const res = await fetch('/api/policy-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: updates }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error ?? 'Failed to save settings')
      }
      setSuccess(true)
      router.refresh()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to save settings'
      if (msg.includes('policy_settings')) {
        setError('The policy_settings table does not exist yet. Run the migration (supabase/migrations/0001_init.sql) in your Supabase SQL Editor first.')
      } else {
        setError(msg)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Credential Issuance Policy */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white mb-2">Credential Issuance Policy</h2>

        <div className="space-y-1">
          <label className="text-xs text-zinc-400 block">
            Max auto-approved credential amount (₹)
          </label>
          <p className="text-[11px] text-zinc-600 mb-2">
            Credentials issued above this amount require a secondary senior_admin approval before activation.
          </p>
          <input
            type="number"
            value={maxAmount}
            onChange={(e) => setMaxAmount(Number(e.target.value))}
            className="w-full max-w-xs bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs text-zinc-400 block">
            Default credential expiry (days)
          </label>
          <p className="text-[11px] text-zinc-600 mb-2">
            New credentials default to this expiry unless overridden.
          </p>
          <input
            type="number"
            value={defaultExpiry}
            onChange={(e) => setDefaultExpiry(Number(e.target.value))}
            className="w-full max-w-xs bg-zinc-900 border border-zinc-700 rounded px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Failover Policy */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-6 space-y-4">
        <h2 className="text-sm font-semibold text-white mb-2">System Failover Policy</h2>

        <div className="space-y-2">
          <label className="text-xs text-zinc-400 block">
            When the verification system is degraded or unreachable:
          </label>
          <p className="text-[11px] text-zinc-600 mb-3">
            This controls whether agent transactions are blocked (fail-safe) or allowed through (fail-open) during a system outage.
          </p>

          <div className="flex gap-4">
            <label className={`flex items-center gap-2 cursor-pointer p-3 rounded-lg border transition-colors ${
              failMode === 'fail-safe'
                ? 'border-red-800 bg-red-950/30'
                : 'border-zinc-800 bg-zinc-900/50'
            }`}>
              <input
                type="radio"
                name="fail_mode"
                value="fail-safe"
                checked={failMode === 'fail-safe'}
                onChange={() => setFailMode('fail-safe')}
                className="accent-red-500"
              />
              <div>
                <div className="text-xs font-medium text-white">Fail-safe (Block all)</div>
                <div className="text-[10px] text-zinc-500">Deny all transactions until the system recovers. Recommended for production.</div>
              </div>
            </label>

            <label className={`flex items-center gap-2 cursor-pointer p-3 rounded-lg border transition-colors ${
              failMode === 'fail-open'
                ? 'border-emerald-800 bg-emerald-950/30'
                : 'border-zinc-800 bg-zinc-900/50'
            }`}>
              <input
                type="radio"
                name="fail_mode"
                value="fail-open"
                checked={failMode === 'fail-open'}
                onChange={() => setFailMode('fail-open')}
                className="accent-emerald-500"
              />
              <div>
                <div className="text-xs font-medium text-white">Fail-open (Allow all)</div>
                <div className="text-[10px] text-zinc-500">Allow transactions through. Use only if downtime costs exceed fraud risk.</div>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded text-sm font-medium transition-colors"
        >
          {saving ? 'Saving...' : 'Save Policy Settings'}
        </button>
        {success && (
          <span className="text-xs text-emerald-400">Settings saved successfully.</span>
        )}
        {error && (
          <span className="text-xs text-red-400">{error}</span>
        )}
      </div>
    </form>
  )
}
