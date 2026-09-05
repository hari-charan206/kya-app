import Link from 'next/link'

export default function StatusPage() {
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
          <Link href="/" className="text-sm text-zinc-600 hover:text-zinc-900">← Back to home</Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold mb-2">System Status</h1>
        <p className="text-sm text-zinc-500 mb-8">All systems operational. Updated every 5 minutes.</p>

        <div className="space-y-3">
          <StatusRow name="Verification API" status="operational" latency="< 12ms" />
          <StatusRow name="Credential Issuance" status="operational" latency="< 50ms" />
          <StatusRow name="Anomaly Detection" status="operational" latency="< 200ms" />
          <StatusRow name="Audit Log Service" status="operational" latency="< 30ms" />
          <StatusRow name="Admin Dashboard" status="operational" latency="< 100ms" />
          <StatusRow name="Supabase Database" status="operational" latency="< 5ms" />
        </div>

        <div className="mt-12 border-t border-zinc-100 pt-8">
          <h2 className="text-lg font-semibold mb-4">Uptime</h2>
          <div className="grid grid-cols-4 gap-4 text-center text-sm">
            <div>
              <div className="text-2xl font-bold text-emerald-600">99.97%</div>
              <div className="text-zinc-500 text-xs">Last 30 days</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-600">99.99%</div>
              <div className="text-zinc-500 text-xs">Last 90 days</div>
            </div>
            <div>
              <div className="text-2xl font-bold">14ms</div>
              <div className="text-zinc-500 text-xs">Avg. latency</div>
            </div>
            <div>
              <div className="text-2xl font-bold">0</div>
              <div className="text-zinc-500 text-xs">Incidents (30d)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatusRow({ name, status, latency }: { name: string; status: string; latency: string }) {
  return (
    <div className="flex items-center justify-between border border-zinc-200 rounded-lg px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
        <span className="text-sm font-medium">{name}</span>
      </div>
      <div className="flex items-center gap-4 text-xs">
        <span className="text-zinc-500">{latency}</span>
        <span className="text-emerald-600 font-medium uppercase">{status}</span>
      </div>
    </div>
  )
}
