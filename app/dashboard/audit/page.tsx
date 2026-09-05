import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import AuditLogClient from './audit-log-client'

export const instant = false

export default async function AuditPage() {
  const supabase = await createClient()

  // Fetch all agents for the filter dropdown
  const { data: agents } = await supabase
    .from('agents')
    .select('id, name')

  // Fetch distinct actions for the filter
  const { data: actions } = await supabase
    .from('audit_logs')
    .select('action')

  const uniqueActions = [...new Set((actions ?? []).map((a: any) => a.action))].sort()

  // Build agent name map for entity resolution
  const agentMap: Record<string, string> = {}
  for (const a of agents ?? []) agentMap[a.id] = a.name

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard" className="text-xs text-blue-400 hover:underline mb-2 inline-block">
          ← Back to Dashboard
        </Link>
        <h1 className="text-2xl font-semibold text-white">Audit Log</h1>
        <p className="text-zinc-500 text-xs mt-1 max-w-2xl">
          Every action in the system — credential issued, transaction approved or denied, agent revoked, flag resolved,
          policy changed — is permanently recorded here with the actor, timestamp, and rationale.
          This is your compliance trail: if a regulator, user, or leadership asks &quot;why did this happen?&quot;,
          the answer is in this log. Entries are append-only and cannot be modified.
        </p>
      </div>

      <AuditLogClient agents={agents ?? []} actionOptions={uniqueActions} agentMap={agentMap} />
    </div>
  )
}
