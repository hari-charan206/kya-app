'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function RunbookPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <nav className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">K</span>
            </div>
            <span className="font-semibold text-lg">KYA</span>
          </Link>
          <Link href="/dashboard" className="text-sm text-zinc-400 hover:text-white">← Back to Dashboard</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">Incident Response Runbook</h1>
        <p className="text-zinc-500 text-sm mb-8">Internal reference for the risk/ops team. Follow these steps when an incident occurs.</p>

        <RunbookSection
          title="Scenario 1: Agent exhibiting anomalous behaviour"
          severity="Medium"
          steps={[
            'Open Case Queue (/dashboard/flags) and find the flagged transactions.',
            'Review the reason codes and risk score for each flag.',
            'Check the agent\'s full history in the Agents page — click the agent name.',
            'If the activity is legitimate: Approve the flag with a rationale explaining why.',
            'If the activity is suspicious but not confirmed malicious: Escalate with a rationale and notify the user.',
            'If the agent is confirmed compromised: Revoke from the flag card. This instantly invalidates all credentials and writes to the audit trail.',
            'Notify the affected user and document the incident in the audit log.',
          ]}
        />
        <RunbookSection
          title="Scenario 2: Credential issued above threshold without approval"
          severity="High"
          steps={[
            'Check the Audit Log (/dashboard/audit) for credential_issued events.',
            'Find the credential that exceeded max_auto_approved_credential.',
            'Revoke the agent if the issuance was unauthorized.',
            'If the credential was legitimately needed, approve it retroactively via the pending credentials queue.',
            'Update policy_settings if the threshold needs adjustment.',
          ]}
        />
        <RunbookSection
          title="Scenario 3: System outage — verification degraded"
          severity="Critical"
          steps={[
            'Confirm the outage: check the Status page and Supabase dashboard.',
            'Decide fail_mode: if set to fail-safe, all transactions are blocked. If fail-open, they pass through unverified.',
            'If you need to toggle the mode: update fail_mode in Policy Settings.',
            'To simulate the outage for testing: POST /api/system-outage with {"active": true}.',
            'When the system recovers: POST /api/system-outage with {"active": false} or {"active": false}.',
            'Review all transactions that occurred during the outage period.',
            'File an incident report with the audit log export.',
          ]}
        />
        <RunbookSection
          title="Scenario 4: Bulk compromise — multiple agents affected"
          severity="Critical"
          steps={[
            'Immediately revoke all affected agents via the Case Queue or API.',
            'Revoke all active credentials for the compromised owner_user_id.',
            'Check the Audit Log for the timeline of the compromise.',
            'Review the Network Graph view for shared infrastructure patterns.',
            'Notify all affected users.',
            'Rotate CREDENTIAL_SIGNING_SECRET if the signing key may have been exposed.',
            'File a full incident report for compliance.',
          ]}
        />
        <RunbookSection
          title="Scenario 5: User requests agent shutdown"
          severity="Low"
          steps={[
            'Verify the user\'s identity (internal process).',
            'Find the agent in the Agents page.',
            'Revoke the agent with the user\'s stated reason as the rationale.',
            'Confirm the agent\'s status shows "revoked" in the table.',
            'Inform the user that the shutdown is effective immediately.',
          ]}
        />
      </div>
    </div>
  )
}

function RunbookSection({ title, severity, steps }: {
  title: string; severity: string; steps: string[]
}) {
  const [expanded, setExpanded] = useState(false)

  const severityColors: Record<string, string> = {
    Low: 'bg-emerald-950 text-emerald-400 border-emerald-800',
    Medium: 'bg-amber-950 text-amber-400 border-amber-800',
    High: 'bg-orange-950 text-orange-400 border-orange-800',
    Critical: 'bg-red-950 text-red-400 border-red-800',
  }

  return (
    <div className="border border-zinc-800 rounded-lg mb-4 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-zinc-900/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${severityColors[severity]}`}>
            {severity}
          </span>
          <span className="font-semibold text-sm">{title}</span>
        </div>
        <span className="text-zinc-500 text-xs">{expanded ? '▲' : '▼'}</span>
      </button>
      {expanded && (
        <div className="px-4 pb-4 border-t border-zinc-800 pt-3">
          <ol className="space-y-2 text-sm text-zinc-400">
            {steps.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-zinc-600 font-mono text-xs mt-0.5">{i + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}
