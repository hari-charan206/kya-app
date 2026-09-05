'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function NewCredentialForm({ agents }: { agents: { id: string; name: string }[] }) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const form = new FormData(e.currentTarget)
    const response = await fetch('/api/credentials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agent_id: form.get('agentId'),
        max_amount: parseFloat(form.get('maxAmount') as string),
        allowed_categories: (form.get('categories') as string).split(',').map((c) => c.trim()),
        expires_in_days: parseInt(form.get('expiresInDays') as string, 10),
      }),
    })

    setIsLoading(false)
    if (!response.ok) {
      const data = await response.json()
      setError(data.error ?? 'Failed to create credential.')
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-950 border border-zinc-800 rounded-lg p-6 space-y-4">
      <div>
        <label className="block text-xs font-mono text-zinc-400 mb-1">Select Agent</label>
        <select name="agentId" required className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-white font-mono">
          <option value="">-- Choose active agent --</option>
          {agents.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-mono text-zinc-400 mb-1">Max Amount (₹)</label>
        <input type="number" name="maxAmount" required step="0.01" placeholder="e.g. 3000"
          className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-white font-mono" />
      </div>
      <div>
        <label className="block text-xs font-mono text-zinc-400 mb-1">Allowed Categories (comma-separated)</label>
        <input type="text" name="categories" required placeholder="e.g. groceries, utilities"
          className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-white font-mono" />
      </div>
      <div>
        <label className="block text-xs font-mono text-zinc-400 mb-1">Expires In (days)</label>
        <input type="number" name="expiresInDays" required defaultValue={30}
          className="w-full bg-zinc-900 border border-zinc-800 rounded px-3 py-2 text-xs text-white font-mono" />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      <div className="pt-2 flex justify-end gap-3">
        <Link href="/dashboard" className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-xs font-medium">Cancel</Link>
        <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded text-xs font-medium">
          {isLoading ? 'Creating...' : 'Create Credential'}
        </button>
      </div>
    </form>
  )
}