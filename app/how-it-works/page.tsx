'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function HowItWorksPage() {
  const [showTechnical, setShowTechnical] = useState(false)

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
            <Link href="/docs" className="text-zinc-600 hover:text-zinc-900">Docs</Link>
            <Link href="/how-it-works" className="text-zinc-900 font-medium">How it works</Link>
            <Link href="/pricing" className="text-zinc-600 hover:text-zinc-900">Pricing</Link>
            <Link href="/auth/login" className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800">
              Log in
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold mb-4">How KYA works</h1>
        <p className="text-lg text-zinc-600 mb-8">
          A four-step lifecycle that keeps AI agent transactions safe, scoped, and auditable.
        </p>

        {/* Technical toggle */}
        <div className="flex items-center gap-3 mb-12 bg-zinc-50 border border-zinc-200 rounded-lg px-4 py-3 inline-flex">
          <span className="text-sm text-zinc-600">View mode:</span>
          <button
            onClick={() => setShowTechnical(false)}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              !showTechnical ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Executive
          </button>
          <button
            onClick={() => setShowTechnical(true)}
            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
              showTechnical ? 'bg-zinc-900 text-white' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Technical
          </button>
        </div>

        {/* Steps */}
        <div className="space-y-16">
          <Step
            number={1}
            title="Issue a credential"
            executive="When a developer registers an AI agent, KYA creates a scoped permission slip — a short-lived, signed digital token that says exactly what this agent is allowed to do: maximum spend per transaction, which categories (groceries, travel, utilities, etc.), and when the permission expires. This is not a master key — it's a limited, time-bound pass."
            technical="The developer calls POST /api/credentials with agent_id, max_amount, allowed_categories, and expires_in_days. KYA checks the policy_settings table: if the amount exceeds max_auto_approved_credential, the request is routed to a pending_credentials row requiring senior_admin approval. Otherwise, a JWT is signed with HS256 using CREDENTIAL_SIGNING_SECRET, containing the scope claims, and stored in the credentials table with status='active'. The token is returned to the caller."
            color="blue"
          />
          <Step
            number={2}
            title="Verify every transaction"
            executive="Before any money moves, the merchant or payment system sends the agent's credential plus the transaction details (amount, category) to KYA. KYA checks in real time: Is the credential real? Is it still valid? Is this purchase within the allowed amount and category? The whole check takes less than 12 milliseconds. If anything fails, the transaction is denied with a clear reason."
            technical="POST /api/verify receives token, amount, and category. The verification engine: (1) decodes and verifies the JWT signature, (2) looks up the credential in the database and checks status != 'revoked', (3) checks amount <= max_amount and category in allowed_categories, (4) inserts a transactions row and a decisions row with the outcome and reason. If the system outage flag is active, the fail_mode policy (fail-safe or fail-open) determines whether to block or allow the transaction."
            color="emerald"
          />
          <Step
            number={3}
            title="Monitor behaviour"
            executive="Even if a transaction is technically within scope, KYA watches for behavioural anomalies. Is this agent suddenly making purchases at 3am when it normally operates 9am–6pm? Is the transaction amount close to the maximum limit? Is there an unusual spike in transaction frequency? When something looks off, KYA flags it for human review — never auto-blocking, but surfacing the risk with a score and plain-language reasoning."
            technical="POST /api/anomaly-check takes a transaction_id. The engine computes three rule-based signals: (1) amount > 80% of max_amount (ceiling proximity), (2) transaction hour outside the agent's historical ±1 hour range (unusual timing), (3) more than 5 transactions from this agent in the last hour (frequency spike). Each triggered rule adds a human-readable reason_code. If any rules trigger, a risk_score is calculated (0.3 + 0.25 per rule, capped at 0.95) and an anomaly_flags row is created with status='open' for the case queue."
            color="amber"
          />
          <Step
            number={4}
            title="Revoke instantly"
            executive="If an agent goes rogue, is compromised, or a review decides it should be shut down, KYA can revoke it instantly. A single action: the agent's status flips to 'revoked', all its active credentials are invalidated, a revocation event is logged with the reason and who did it, and every future verification request is denied immediately. The full history is in the audit log."
            technical="POST /api/revoke takes agent_id and reason. The revocation service: (1) sets agents.status = 'revoked', (2) sets all credentials.status = 'revoked' for that agent_id, (3) inserts a revocation_events row with the reason and revoked_by, (4) writes an audit_logs entry. The next POST /api/verify call for that agent will hit the credential.status check and return deny: 'agent access has been revoked'."
            color="red"
          />
        </div>

        <div className="mt-20 text-center">
          <Link href="/docs" className="bg-zinc-900 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-zinc-800 inline-block">
            Explore the API docs →
          </Link>
        </div>
      </div>
    </div>
  )
}

function Step({ number, title, executive, technical, color }: {
  number: number; title: string; executive: string; technical: string; color: string
}) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    emerald: 'bg-emerald-50 border-emerald-200 text-emerald-600',
    amber: 'bg-amber-50 border-amber-200 text-amber-600',
    red: 'bg-red-50 border-red-200 text-red-600',
  }
  return (
    <div className="flex gap-6">
      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center font-bold text-lg flex-shrink-0 ${colorMap[color]}`}>
        {number}
      </div>
      <div>
        <h2 className="text-xl font-bold mb-3">{title}</h2>
        <p className="text-zinc-600 leading-relaxed">{executive}</p>
        <div className="mt-3 text-xs text-zinc-400 italic border-l-2 border-zinc-200 pl-3">
          {technical}
        </div>
      </div>
    </div>
  )
}
