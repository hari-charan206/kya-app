import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import NetworkGraph from './network-graph'

export const instant = false

export default async function NetworkPage() {
  const supabase = await createClient()

  const { data: agents } = await supabase
    .from('agents')
    .select('id, name, status, owner_user_id')

  const { data: edges } = await supabase
    .from('network_edges')
    .select('*')

  // Build edge data with agent names
  const agentMap: Record<string, { name: string; status: string }> = {}
  for (const a of agents ?? []) {
    agentMap[a.id] = { name: a.name, status: a.status }
  }

  const enrichedEdges = (edges ?? []).map(e => ({
    ...e,
    source_name: agentMap[e.source_id]?.name ?? e.source_id.slice(0, 8),
    target_name: agentMap[e.target_id]?.name ?? e.target_id.slice(0, 8),
  }))

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard" className="text-xs text-blue-400 hover:underline mb-2 inline-block">
          ← Back to Dashboard
        </Link>
        <h1 className="text-2xl font-semibold text-white">Network Graph</h1>
        <p className="text-zinc-500 text-xs mt-1">
          Visualise relationships between agents to detect coordinated abuse. Edges are derived from
          shared owner IDs, shared device fingerprints, shared IPs, and other signals.
          <span className="text-zinc-600 ml-1">Schema: network_edges table with source_id, target_id, edge_type, confidence.</span>
        </p>
      </div>

      <NetworkGraph agents={agents ?? []} edges={enrichedEdges} />
    </div>
  )
}
