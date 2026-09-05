import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import IssueForm from './issue-form'

export const instant = false

export default async function NewCredentialPage() {
  const supabase = await createClient()

  // Only active agents can receive a new credential
  const { data: agents } = await supabase
    .from('agents')
    .select('id, name')
    .eq('status', 'active')
    .order('name', { ascending: true })

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <Link href="/dashboard" className="text-xs text-blue-400 hover:underline mb-2 inline-block">
          ← Back to Dashboard
        </Link>
        <h1 className="text-2xl font-semibold text-white">Issue New Credential</h1>
        <p className="text-xs text-zinc-500 mt-1">
          A credential is a scoped, signed, short-lived permission slip — not a master key.
          Set the spend limit, allowed categories, and expiry that this agent is bound to.
        </p>
      </div>

      {(!agents || agents.length === 0) ? (
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-6 text-sm text-zinc-400">
          No active agents yet.{' '}
          <Link href="/dashboard/agents/new" className="text-blue-400 hover:underline">
            Register an agent first
          </Link>
          .
        </div>
      ) : (
        <IssueForm agents={agents} />
      )}
    </div>
  )
}
