'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewAgentForm({ ownerUserId }: { ownerUserId: string }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const response = await fetch('/api/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ owner_user_id: ownerUserId, name }),
    })

    setIsLoading(false)

    if (!response.ok) {
      const data = await response.json()
      setError(data.error ?? 'Failed to register agent.')
      return
    }

    router.push('/dashboard/agents')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-zinc-950 border border-zinc-800 rounded-lg p-6">
      <div>
        <label className="block text-sm text-zinc-400 mb-1">Agent Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="e.g. GroceryBot"
          className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-sm"
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={isLoading || !name}
        className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg py-2 text-sm font-medium"
      >
        {isLoading ? 'Registering...' : 'Register Agent'}
      </button>
    </form>
  )
}