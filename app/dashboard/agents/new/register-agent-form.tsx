'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function RegisterAgentForm({ ownerUserId }: { ownerUserId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string

    const res = await fetch('/api/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ owner_user_id: ownerUserId, name }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error ?? 'Failed to register agent')
      return
    }

    router.push(`/dashboard/agents/${data.agent_id}`)
    router.refresh()
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-zinc-950 border border-zinc-800 rounded-lg p-6 space-y-4"
    >
      <div>
        <label className="block text-xs font-mono text-zinc-400 mb-1">Agent Name</label>
        <input
          type="text"
          name="name"
          required
          placeholder="e.g. Groceries Reorder Bot"
          className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
        />
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <div className="pt-2 flex justify-end gap-3">
        <Link
          href="/dashboard/agents"
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-xs font-medium transition-colors inline-flex items-center justify-center"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded text-xs font-medium transition-colors"
        >
          {loading ? 'Registering...' : 'Register Agent'}
        </button>
      </div>
    </form>
  )
}
