'use client'

import { useState } from 'react'
import Link from 'next/link'

const endpoints = [
  {
    id: 'issue-credential',
    title: 'Issue Credential',
    method: 'POST',
    path: '/api/credentials',
    description: 'Create a scoped, signed credential for an AI agent. The credential defines the agent\'s spend limit, allowed transaction categories, and expiry.',
    requestBody: `{
  "agent_id": "a1111111-1111-1111-1111-111111111111",
  "max_amount": 5000,
  "allowed_categories": ["groceries", "utilities"],
  "expires_in_days": 30
}`,
    responseSuccess: `{
  "credential_id": "c1111111-...",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "expires_at": "2026-10-05T00:00:00Z"
}`,
    responseHighValue: `{
  "pending_approval": true,
  "pending_id": "p1111111-...",
  "message": "Amount ₹100,000 exceeds auto-approve threshold of ₹50,000. A senior_admin must approve."
}`,
    curl: `curl -X POST https://your-project.supabase.co/api/credentials \\
  -H "Content-Type: application/json" \\
  -d '{
    "agent_id": "a1111111-1111-1111-1111-111111111111",
    "max_amount": 5000,
    "allowed_categories": ["groceries", "utilities"],
    "expires_in_days": 30
  }'`,
    python: `import requests

response = requests.post(
    "https://your-project.supabase.co/api/credentials",
    json={
        "agent_id": "a1111111-1111-1111-1111-111111111111",
        "max_amount": 5000,
        "allowed_categories": ["groceries", "utilities"],
        "expires_in_days": 30,
    }
)
print(response.json())`,
    node: `const response = await fetch("/api/credentials", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    agent_id: "a1111111-1111-1111-1111-111111111111",
    max_amount: 5000,
    allowed_categories: ["groceries", "utilities"],
    expires_in_days: 30,
  }),
});
const data = await response.json();`,
  },
  {
    id: 'verify-transaction',
    title: 'Verify Transaction',
    method: 'POST',
    path: '/api/verify',
    description: 'The real-time hot-path verification. Checks the credential\'s signature, expiry, revocation status, amount, and category — and returns an approve/deny decision with a human-readable reason.',
    requestBody: `{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "amount": 2500,
  "category": "groceries"
}`,
    responseSuccess: `{
  "decision": "approve",
  "reason": "within scope",
  "transaction_id": "t1000001-..."
}`,
    responseDenied: `{
  "decision": "deny",
  "reason": "amount exceeds max_amount of 5000",
  "transaction_id": "t1000002-..."
}`,
    curl: `curl -X POST https://your-project.supabase.co/api/verify \\
  -H "Content-Type: application/json" \\
  -d '{
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "amount": 2500,
    "category": "groceries"
  }'`,
    python: `response = requests.post(
    "https://your-project.supabase.co/api/verify",
    json={
        "token": "eyJhbGciOiJIUzI1NiIs...",
        "amount": 2500,
        "category": "groceries",
    }
)`,
    node: `const response = await fetch("/api/verify", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    token: "eyJhbGciOiJIUzI1NiIs...",
    amount: 2500,
    category: "groceries",
  }),
});`,
  },
  {
    id: 'revoke-agent',
    title: 'Revoke Agent',
    method: 'POST',
    path: '/api/revoke',
    description: 'Instantly revoke an agent\'s authority. This flips the agent status to revoked, invalidates all active credentials, and writes a revocation event and audit log entry.',
    requestBody: `{
  "agent_id": "a1111111-1111-1111-1111-111111111111",
  "reason": "Agent behaviour indicates compromise",
  "revoked_by": "admin_dashboard"
}`,
    responseSuccess: `{
  "revoked": true,
  "revocation_id": "r1111111-..."
}`,
    curl: `curl -X POST https://your-project.supabase.co/api/revoke \\
  -H "Content-Type: application/json" \\
  -d '{
    "agent_id": "a1111111-1111-1111-1111-111111111111",
    "reason": "Agent behaviour indicates compromise"
  }'`,
    python: `response = requests.post(
    "https://your-project.supabase.co/api/revoke",
    json={
        "agent_id": "a1111111-1111-1111-1111-111111111111",
        "reason": "Agent behaviour indicates compromise",
    }
)`,
    node: `const response = await fetch("/api/revoke", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    agent_id: "a1111111-1111-1111-1111-111111111111",
    reason: "Agent behaviour indicates compromise",
  }),
});`,
  },
  {
    id: 'query-agent',
    title: 'Query Agent Status',
    method: 'GET',
    path: '/api/agents/{id}',
    description: 'Retrieve an agent\'s full profile: status, credentials, transaction history with decisions, and revocation events.',
    requestBody: null,
    responseSuccess: `{
  "agent": {
    "id": "a1111111-...",
    "name": "GroceryBot",
    "status": "active",
    "created_at": "2026-08-22T00:00:00Z"
  },
  "credentials": [...],
  "transactions": [
    {
      "id": "t1000001-...",
      "amount": 1200,
      "category": "groceries",
      "decisions": [{ "decision_type": "approve", "reason": "within scope" }]
    }
  ],
  "revocations": []
}`,
    curl: `curl https://your-project.supabase.co/api/agents/a1111111-1111-1111-1111-111111111111`,
    python: `response = requests.get(
    "https://your-project.supabase.co/api/agents/a1111111-1111-1111-1111-111111111111"
)`,
    node: `const response = await fetch("/api/agents/a1111111-...");`,
  },
  {
    id: 'anomaly-check',
    title: 'Anomaly Check',
    method: 'POST',
    path: '/api/anomaly-check',
    description: 'Run behavioural anomaly detection on a transaction. Checks ceiling proximity, unusual timing, and frequency spikes. Returns a risk score and reason codes if flagged.',
    requestBody: `{
  "transaction_id": "t1000001-1111-1111-1111-111111111111"
}`,
    responseSuccess: `{
  "flagged": false
}`,
    responseFlagged: `{
  "flagged": true,
  "flag_id": "f1111111-...",
  "risk_score": 0.55,
  "reason_codes": [
    "amount is over 80% of the agent's max_amount"
  ]
}`,
    curl: `curl -X POST https://your-project.supabase.co/api/anomaly-check \\
  -H "Content-Type: application/json" \\
  -d '{"transaction_id": "t1000001-..."}'`,
    python: `response = requests.post(
    "https://your-project.supabase.co/api/anomaly-check",
    json={"transaction_id": "t1000001-..."}
)`,
    node: `const response = await fetch("/api/anomaly-check", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ transaction_id: "t1000001-..." }),
});`,
  },
]

const sidebarItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'authentication', label: 'Authentication' },
  { id: 'issue-credential', label: 'Issue Credential' },
  { id: 'verify-transaction', label: 'Verify Transaction' },
  { id: 'revoke-agent', label: 'Revoke Agent' },
  { id: 'query-agent', label: 'Query Agent Status' },
  { id: 'anomaly-check', label: 'Anomaly Check' },
  { id: 'errors', label: 'Error Codes' },
]

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('overview')
  const [codeLang, setCodeLang] = useState<'curl' | 'python' | 'node'>('curl')

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <nav className="border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">K</span>
            </div>
            <span className="font-semibold text-lg">KYA</span>
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/docs" className="text-zinc-900 font-medium">Docs</Link>
            <Link href="/how-it-works" className="text-zinc-600 hover:text-zinc-900">How it works</Link>
            <Link href="/auth/login" className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800">
              Log in
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-56 border-r border-zinc-100 p-6 sticky top-0 h-screen overflow-y-auto">
          <div className="text-xs uppercase text-zinc-400 font-semibold mb-4">API Reference</div>
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveSection(item.id)
                document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })
              }}
              className={`block w-full text-left text-sm py-1.5 px-2 rounded transition-colors mb-0.5 ${
                activeSection === item.id
                  ? 'bg-zinc-100 text-zinc-900 font-medium'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
              }`}
            >
              {item.label}
            </button>
          ))}
        </aside>

        {/* Content */}
        <main className="flex-1 max-w-3xl p-8">
          <div id="overview" className="mb-12">
            <h1 className="text-3xl font-bold mb-4">API Reference</h1>
            <p className="text-zinc-600 leading-relaxed">
              KYA provides RESTful endpoints for issuing credentials, verifying transactions, revoking agents,
              and querying status. All requests and responses use JSON.
            </p>
            <div className="mt-4 bg-zinc-50 border border-zinc-200 rounded-lg p-4 text-sm">
              <div className="font-medium mb-1">Base URL</div>
              <code className="text-xs bg-zinc-100 px-2 py-1 rounded">https://your-project.supabase.co</code>
            </div>
          </div>

          <div id="authentication" className="mb-12">
            <h2 className="text-xl font-bold mb-3">Authentication</h2>
            <p className="text-zinc-600 text-sm leading-relaxed mb-3">
              API routes are accessible without authentication in this demo build (the proxy bypasses auth for /api/* paths).
              In production, requests would require a Supabase session token or API key in the Authorization header.
            </p>
          </div>

          {endpoints.map(ep => (
            <div key={ep.id} id={ep.id} className="mb-12 scroll-mt-20">
              <div className="flex items-center gap-3 mb-3">
                <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${
                  ep.method === 'GET' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {ep.method}
                </span>
                <code className="text-sm font-mono text-zinc-700">{ep.path}</code>
              </div>
              <h2 className="text-xl font-bold mb-2">{ep.title}</h2>
              <p className="text-zinc-600 text-sm leading-relaxed mb-4">{ep.description}</p>

              {ep.requestBody && (
                <div className="mb-4">
                  <h3 className="text-xs font-semibold text-zinc-500 uppercase mb-2">Request body</h3>
                  <pre className="bg-zinc-950 text-zinc-300 text-xs p-4 rounded-lg overflow-x-auto font-mono">
                    {ep.requestBody}
                  </pre>
                </div>
              )}

              <div className="mb-4">
                <h3 className="text-xs font-semibold text-zinc-500 uppercase mb-2">Response</h3>
                {ep.responseSuccess && (
                  <pre className="bg-zinc-950 text-zinc-300 text-xs p-4 rounded-lg overflow-x-auto font-mono mb-2">
                    {ep.responseSuccess}
                  </pre>
                )}
                {(ep as any).responseDenied && (
                  <pre className="bg-zinc-950 text-red-300 text-xs p-4 rounded-lg overflow-x-auto font-mono mb-2">
                    {(ep as any).responseDenied}
                  </pre>
                )}
                {(ep as any).responseHighValue && (
                  <pre className="bg-zinc-950 text-amber-300 text-xs p-4 rounded-lg overflow-x-auto font-mono">
                    {(ep as any).responseHighValue}
                  </pre>
                )}
                {(ep as any).responseFlagged && (
                  <pre className="bg-zinc-950 text-amber-300 text-xs p-4 rounded-lg overflow-x-auto font-mono mt-2">
                    {(ep as any).responseFlagged}
                  </pre>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xs font-semibold text-zinc-500 uppercase">Code samples</h3>
                  <div className="flex bg-zinc-100 rounded p-0.5">
                    {(['curl', 'python', 'node'] as const).map(lang => (
                      <button
                        key={lang}
                        onClick={() => setCodeLang(lang)}
                        className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                          codeLang === lang ? 'bg-white shadow text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'
                        }`}
                      >
                        {lang === 'node' ? 'Node.js' : lang.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
                <pre className="bg-zinc-950 text-zinc-300 text-xs p-4 rounded-lg overflow-x-auto font-mono">
                  {(ep as any)[codeLang] ?? '# Example not available'}
                </pre>
              </div>
            </div>
          ))}

          <div id="errors" className="mb-12">
            <h2 className="text-xl font-bold mb-3">Error Codes</h2>
            <div className="border border-zinc-200 rounded-lg overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-zinc-50 border-b border-zinc-200">
                  <tr>
                    <th className="p-3 font-semibold">Code</th>
                    <th className="p-3 font-semibold">Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-zinc-100"><td className="p-3 font-mono">400</td><td className="p-3">Missing required fields</td></tr>
                  <tr className="border-b border-zinc-100"><td className="p-3 font-mono">401</td><td className="p-3">Invalid or expired credential token</td></tr>
                  <tr className="border-b border-zinc-100"><td className="p-3 font-mono">403</td><td className="p-3">Scope violation — amount, category, or revoked</td></tr>
                  <tr className="border-b border-zinc-100"><td className="p-3 font-mono">404</td><td className="p-3">Credential or agent not found</td></tr>
                  <tr className="border-b border-zinc-100"><td className="p-3 font-mono">409</td><td className="p-3">Already resolved / already revoked</td></tr>
                  <tr className="border-b border-zinc-100"><td className="p-3 font-mono">429</td><td className="p-3">Rate limit exceeded</td></tr>
                  <tr><td className="p-3 font-mono">503</td><td className="p-3">System degraded — fail-safe mode active</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
