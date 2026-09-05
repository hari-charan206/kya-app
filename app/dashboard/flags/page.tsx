import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import FlagActions from './flag-actions'

export const instant = false

export default async function FlagsPage() {
  const supabase = await createClient()
  const { data: flags } = await supabase
    .from('anomaly_flags')
    .select('*, agents(name)')
    .order('created_at', { ascending: false })

  const openFlags = (flags ?? []).filter(f => f.status === 'open')
  const escalatedFlags = (flags ?? []).filter(f => f.status === 'escalated')
  const resolvedFlags = (flags ?? []).filter(f => f.status === 'resolved' || f.status === 'dismissed')

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard" className="text-xs text-blue-400 hover:underline mb-2 inline-block">
          ← Back to Dashboard
        </Link>
        <h1 className="text-2xl font-semibold text-white">Case Queue</h1>
        <p className="text-zinc-500 text-xs mt-1 max-w-2xl">
          When the anomaly detection engine spots a transaction that&apos;s technically within scope but behaviourally unusual
          — near the spend ceiling, at an odd hour, or with a frequency spike — it creates a flag here. Your job as an analyst
          is to review each flag and decide: <span className="text-emerald-400">Approve</span> (false positive),
          <span className="text-amber-400"> Escalate</span> (needs deeper investigation), or
          <span className="text-red-400"> Revoke</span> (shut the agent down). Every decision requires a written rationale
          that gets permanently logged in the audit trail.
        </p>
      </div>

      {/* Status summary bar */}
      <div className="flex gap-4">
        <div className="bg-red-950/30 border border-red-900/50 rounded-lg px-4 py-2 flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-zinc-400">Open</span>
          <span className="text-sm font-bold text-red-400">{openFlags.length}</span>
        </div>
        <div className="bg-amber-950/30 border border-amber-900/50 rounded-lg px-4 py-2 flex items-center gap-2">
          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
          <span className="text-xs text-zinc-400">Escalated</span>
          <span className="text-sm font-bold text-amber-400">{escalatedFlags.length}</span>
        </div>
        <div className="bg-emerald-950/30 border border-emerald-900/50 rounded-lg px-4 py-2 flex items-center gap-2">
          <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
          <span className="text-xs text-zinc-400">Resolved</span>
          <span className="text-sm font-bold text-emerald-400">{resolvedFlags.length}</span>
        </div>
      </div>

      {/* Open flags first */}
      {openFlags.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-red-400 uppercase mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
            Needs Review ({openFlags.length})
          </h2>
          <div className="space-y-3">
            {openFlags.map((flag: any) => (
              <FlagCard key={flag.id} flag={flag} />
            ))}
          </div>
        </div>
      )}

      {/* Escalated */}
      {escalatedFlags.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-amber-400 uppercase mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
            Escalated ({escalatedFlags.length})
          </h2>
          <div className="space-y-3">
            {escalatedFlags.map((flag: any) => (
              <FlagCard key={flag.id} flag={flag} />
            ))}
          </div>
        </div>
      )}

      {/* Resolved */}
      {resolvedFlags.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-emerald-400 uppercase mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
            Resolved ({resolvedFlags.length})
          </h2>
          <div className="space-y-3">
            {resolvedFlags.map((flag: any) => (
              <FlagCard key={flag.id} flag={flag} />
            ))}
          </div>
        </div>
      )}

      {(flags ?? []).length === 0 && (
        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-12 text-center">
          <div className="text-2xl mb-2">🛡️</div>
          <div className="text-sm text-zinc-400 font-medium mb-1">No anomaly flags</div>
          <div className="text-xs text-zinc-600 max-w-md mx-auto">
            The anomaly detection engine monitors every verified transaction for unusual patterns.
            When something looks off — high spend, odd hours, frequency spikes — it creates a flag here for your review.
          </div>
        </div>
      )}
    </div>
  )
}

function FlagCard({ flag }: { flag: any }) {
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${
              flag.status === 'open'
                ? 'bg-red-950 text-red-400 border border-red-800'
                : flag.status === 'escalated'
                  ? 'bg-amber-950 text-amber-400 border border-amber-800'
                  : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
            }`}>
              {flag.status}
            </span>
            <span className="text-xs text-zinc-500">
              Risk: <span className={`font-semibold ${
                flag.risk_score >= 0.7 ? 'text-red-400' : flag.risk_score >= 0.5 ? 'text-amber-400' : 'text-zinc-300'
              }`}>{(flag.risk_score * 100).toFixed(0)}%</span>
            </span>
            <span className="text-xs text-zinc-500">
              Agent: <span className="text-white font-medium">{flag.agents?.name ?? flag.agent_id?.slice(0, 8)}</span>
            </span>
          </div>

          <p className="text-sm text-zinc-300 mb-1">{flag.reason}</p>

          {flag.reason_codes && flag.reason_codes.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {(Array.isArray(flag.reason_codes) ? flag.reason_codes : []).map((code: string, i: number) => (
                <span key={i} className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded border border-zinc-700">
                  {code}
                </span>
              ))}
            </div>
          )}

          <div className="text-[10px] text-zinc-600">
            {new Date(flag.created_at).toISOString().replace('T', ' ').substring(0, 19)}
            {flag.analyst_rationale && (
              <span className="ml-2 text-zinc-400">• Resolved: {flag.analyst_rationale}</span>
            )}
          </div>
        </div>

        {(flag.status === 'open' || flag.status === 'escalated') && (
          <FlagActions flagId={flag.id} currentStatus={flag.status} />
        )}
      </div>
    </div>
  )
}
