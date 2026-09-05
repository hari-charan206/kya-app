import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// GET /api/network — returns agents and their edges for graph visualization
export async function GET() {
  const supabase = await createClient()

  const { data: agents } = await supabase
    .from('agents')
    .select('id, name, status, owner_user_id')

  const { data: edges } = await supabase
    .from('network_edges')
    .select('*')

  // Also infer owner-sharing edges from the agents data
  const ownerMap: Record<string, string[]> = {}
  for (const agent of agents ?? []) {
    const owner = agent.owner_user_id
    if (!ownerMap[owner]) ownerMap[owner] = []
    ownerMap[owner].push(agent.id)
  }

  // Generate inferred edges for agents sharing the same owner
  const inferredEdges: Array<{ source_id: string; target_id: string; edge_type: string; confidence: number }> = []
  for (const agentIds of Object.values(ownerMap)) {
    for (let i = 0; i < agentIds.length; i++) {
      for (let j = i + 1; j < agentIds.length; j++) {
        const exists = (edges ?? []).some(e =>
          (e.source_id === agentIds[i] && e.target_id === agentIds[j]) ||
          (e.source_id === agentIds[j] && e.target_id === agentIds[i])
        )
        if (!exists) {
          inferredEdges.push({
            source_id: agentIds[i],
            target_id: agentIds[j],
            edge_type: 'shared_owner',
            confidence: 1.0,
          })
        }
      }
    }
  }

  return NextResponse.json({
    nodes: (agents ?? []).map(a => ({
      id: a.id,
      name: a.name,
      status: a.status,
      type: 'agent',
    })),
    edges: [...(edges ?? []), ...inferredEdges],
  })
}
