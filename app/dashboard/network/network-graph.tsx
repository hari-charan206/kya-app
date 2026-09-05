'use client'

import { useState } from 'react'

interface AgentNode {
  id: string
  name: string
  status: string
  owner_user_id?: string
}

interface Edge {
  source_id: string
  target_id: string
  edge_type: string
  confidence: number
  source_name?: string
  target_name?: string
}

export default function NetworkGraph({ agents, edges }: { agents: AgentNode[]; edges: Edge[] }) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  // Layout nodes in a circle
  const radius = 200
  const centerX = 300
  const centerY = 250

  const nodePositions: Record<string, { x: number; y: number }> = {}
  agents.forEach((agent, i) => {
    const angle = (i / agents.length) * 2 * Math.PI - Math.PI / 2
    nodePositions[agent.id] = {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    }
  })

  // Edge type colors
  const edgeColors: Record<string, string> = {
    shared_owner: '#ef4444',
    shared_device: '#f59e0b',
    shared_ip: '#3b82f6',
    shared_fingerprint: '#8b5cf6',
  }

  const edgeLabels: Record<string, string> = {
    shared_owner: 'Shared Owner',
    shared_device: 'Shared Device',
    shared_ip: 'Shared IP',
    shared_fingerprint: 'Shared Fingerprint',
  }

  const connectedNodes = new Set<string>()
  for (const edge of edges) {
    connectedNodes.add(edge.source_id)
    connectedNodes.add(edge.target_id)
  }

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 flex items-center gap-6 text-xs">
        <span className="text-zinc-500 font-semibold">Edge types:</span>
        {Object.entries(edgeLabels).map(([type, label]) => (
          <div key={type} className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 rounded" style={{ backgroundColor: edgeColors[type] }}></span>
            <span className="text-zinc-400">{label}</span>
          </div>
        ))}
        <span className="text-zinc-600 ml-auto">{edges.length} connections found</span>
      </div>

      {/* Graph */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 overflow-x-auto">
        <svg width="600" height="500" viewBox="0 0 600 500" className="mx-auto">
          {/* Edges */}
          {edges.map((edge, i) => {
            const from = nodePositions[edge.source_id]
            const to = nodePositions[edge.target_id]
            if (!from || !to) return null
            return (
              <g key={i}>
                <line
                  x1={from.x} y1={from.y}
                  x2={to.x} y2={to.y}
                  stroke={edgeColors[edge.edge_type] ?? '#555'}
                  strokeWidth={1.5}
                  strokeOpacity={0.5}
                  strokeDasharray={edge.edge_type === 'shared_ip' ? '4 4' : undefined}
                />
                <text
                  x={(from.x + to.x) / 2}
                  y={(from.y + to.y) / 2 - 6}
                  fill="#71717a"
                  fontSize="8"
                  textAnchor="middle"
                >
                  {edgeLabels[edge.edge_type] ?? edge.edge_type}
                </text>
              </g>
            )
          })}

          {/* Nodes */}
          {agents.map(agent => {
            const pos = nodePositions[agent.id]
            if (!pos) return null
            const isActive = agent.status === 'active'
            const isConnected = connectedNodes.has(agent.id)
            const isSelected = selectedNode === agent.id

            return (
              <g
                key={agent.id}
                onClick={() => setSelectedNode(selectedNode === agent.id ? null : agent.id)}
                className="cursor-pointer"
              >
                <circle
                  cx={pos.x} cy={pos.y} r={isSelected ? 24 : 20}
                  fill={isActive ? (isConnected ? '#1a1a2e' : '#0f172a') : '#1a0a0a'}
                  stroke={isSelected ? '#3b82f6' : (isConnected ? '#ef4444' : (isActive ? '#334155' : '#7f1d1d'))}
                  strokeWidth={isSelected ? 2.5 : (isConnected ? 2 : 1.5)}
                />
                <text
                  x={pos.x} y={pos.y + 1}
                  fill="white"
                  fontSize="9"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {agent.name.slice(0, 2).toUpperCase()}
                </text>
                <text
                  x={pos.x} y={pos.y + 34}
                  fill="#a1a1aa"
                  fontSize="10"
                  textAnchor="middle"
                >
                  {agent.name}
                </text>
                <text
                  x={pos.x} y={pos.y + 46}
                  fill={isActive ? '#4ade80' : '#f87171'}
                  fontSize="8"
                  textAnchor="middle"
                >
                  {agent.status}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Selected node details */}
      {selectedNode && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4">
          {(() => {
            const agent = agents.find(a => a.id === selectedNode)
            const connected = edges.filter(e => e.source_id === selectedNode || e.target_id === selectedNode)
            if (!agent) return null
            return (
              <div>
                <h3 className="font-semibold text-white text-sm mb-2">{agent.name}</h3>
                <div className="text-xs text-zinc-500 space-y-1">
                  <div>Status: <span className={agent.status === 'active' ? 'text-emerald-400' : 'text-red-400'}>{agent.status}</span></div>
                  <div>ID: <span className="font-mono text-zinc-400">{agent.id}</span></div>
                  {connected.length > 0 && (
                    <div className="mt-2">
                      <span className="text-zinc-400 font-semibold">Connections:</span>
                      <ul className="mt-1 space-y-0.5">
                        {connected.map((e, i) => {
                          const otherId = e.source_id === selectedNode ? e.target_id : e.source_id
                          const otherName = e.source_id === selectedNode ? (e.target_name ?? otherId) : (e.source_name ?? otherId)
                          return (
                            <li key={i} className="text-zinc-400">
                              → <span className="text-white">{otherName}</span> via{' '}
                              <span style={{ color: edgeColors[e.edge_type] }}>{edgeLabels[e.edge_type] ?? e.edge_type}</span>
                              {' '}({(e.confidence * 100).toFixed(0)}% confidence)
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )
          })()}
        </div>
      )}

      {/* Info */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4 text-xs text-zinc-500">
        <span className="text-zinc-400 font-semibold">How this works:</span> The network graph maps relationships between agents.
        Explicit edges are stored in the <code className="bg-zinc-800 px-1 rounded">network_edges</code> table
        (schema: source_id, target_id, edge_type, confidence). Inferred edges (shared owner) are computed at query time from
        the agents table. A red node border indicates an agent connected to another — click it to see the relationship details.
      </div>
    </div>
  )
}
