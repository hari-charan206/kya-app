import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      {/* Nav */}
      <nav className="border-b border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">K</span>
            </div>
            <span className="font-semibold text-lg">KYA</span>
            <span className="text-xs text-zinc-400 ml-1">Know Your Agent</span>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <Link href="/docs" className="text-zinc-600 hover:text-zinc-900 transition-colors">Docs</Link>
            <Link href="/how-it-works" className="text-zinc-600 hover:text-zinc-900 transition-colors">How it works</Link>
            <Link href="/auth/login" className="text-zinc-600 hover:text-zinc-900 transition-colors">Log in</Link>
            <Link href="/auth/sign-up" className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors">
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium px-3 py-1 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
            Now in public beta — SOC2-ready architecture
          </div>
          <h1 className="text-5xl font-bold tracking-tight leading-tight mb-6">
            The trust layer for<br />
            <span className="bg-gradient-to-r from-zinc-900 to-zinc-500 bg-clip-text text-transparent">agentic commerce</span>
          </h1>
          <p className="text-lg text-zinc-600 leading-relaxed mb-8 max-w-2xl">
            AI agents are shopping, booking, and paying on behalf of humans — but payment systems have no way to verify
            who they are, what they're allowed to do, or whether they've gone rogue. KYA issues scoped, verifiable
            credentials to every agent, monitors behaviour in real time, and lets you revoke access instantly.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/auth/sign-up" className="bg-zinc-900 text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors">
              Start building →
            </Link>
            <Link href="/docs" className="border border-zinc-200 text-zinc-700 px-6 py-3 rounded-lg text-sm font-medium hover:bg-zinc-50 transition-colors">
              Read the docs
            </Link>
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="border-y border-zinc-100 bg-zinc-50/50">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-8">
            <div>
              <span className="font-semibold text-zinc-900 text-lg">99.97%</span>
              <span className="ml-1">uptime SLA</span>
            </div>
            <div>
              <span className="font-semibold text-zinc-900 text-lg">&lt;12ms</span>
              <span className="ml-1">p95 verify latency</span>
            </div>
            <div>
              <span className="font-semibold text-zinc-900 text-lg">SOC2</span>
              <span className="ml-1">ready architecture</span>
            </div>
            <div>
              <span className="font-semibold text-zinc-900 text-lg">2,400+</span>
              <span className="ml-1">agents verified today</span>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold mb-4">The problem</h2>
        <p className="text-zinc-600 text-lg max-w-2xl mb-12">
          Today, an AI agent can present itself as authorized to make a purchase — but the payment system has
          no reliable way to check. API keys don't prove identity, don't enforce limits, and don't expire.
        </p>
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-red-50 border border-red-100 rounded-xl p-6">
            <div className="text-red-600 font-semibold mb-2">No identity verification</div>
            <p className="text-sm text-zinc-600">A stolen API key looks identical to a legitimate one. The system can't tell who's really calling.</p>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-xl p-6">
            <div className="text-red-600 font-semibold mb-2">No scope enforcement</div>
            <p className="text-sm text-zinc-600">A grocery bot with full API access can buy anything — there's no way to limit spend or category.</p>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-xl p-6">
            <div className="text-red-600 font-semibold mb-2">No instant revocation</div>
            <p className="text-sm text-zinc-600">If an agent goes rogue, you can't shut it down in real time. Key rotation is slow and breaks other integrations.</p>
          </div>
        </div>
      </section>

      {/* Lifecycle Visualization */}
      <section className="bg-zinc-950 text-white py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4">How KYA works</h2>
          <p className="text-zinc-400 text-lg max-w-2xl mb-16">
            Four steps — from issuing a scoped permission slip to revoking it instantly.
          </p>
          <div className="grid grid-cols-4 gap-8">
            <LifecycleStep
              number="01"
              title="Issue"
              description="Create a scoped, signed, short-lived credential for each agent — with explicit spend limits, allowed categories, and expiry."
              color="blue"
            />
            <LifecycleStep
              number="02"
              title="Verify"
              description="Every agent transaction is checked against the credential in real time — amount, category, expiry, revocation status — before any money moves."
              color="emerald"
            />
            <LifecycleStep
              number="03"
              title="Monitor"
              description="Behavioural anomaly detection watches for unusual patterns — late-night spikes, spend ceiling approaches, frequency anomalies — and flags them for review."
              color="amber"
            />
            <LifecycleStep
              number="04"
              title="Revoke"
              description="Instantly kill an agent's authority. Every future request is denied immediately, with a full audit trail of who revoked and why."
              color="red"
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <h2 className="text-3xl font-bold mb-12">Built for fintech-grade security</h2>
        <div className="grid grid-cols-2 gap-8">
          <FeatureCard
            title="Cryptographic credentials"
            description="Every credential is a signed JWT encoding the agent's exact scope. No shared secrets, no API keys that never expire."
          />
          <FeatureCard
            title="Real-time verification"
            description="Sub-12ms verification checks signature, revocation, expiry, amount, and category in a single synchronous hot path."
          />
          <FeatureCard
            title="Immutable audit trail"
            description="Every decision, every revocation, every policy change — logged permanently with actor, rationale, and timestamp."
          />
          <FeatureCard
            title="Fail-safe by default"
            description="Choose between fail-safe (block all) and fail-open (allow all) during outages. Configurable per your risk appetite."
          />
          <FeatureCard
            title="Role-based access"
            description="Senior admins can configure policy. Analysts can review and resolve flags. Everyone sees what they need, nothing more."
          />
          <FeatureCard
            title="Developer-first APIs"
            description="RESTful endpoints with code samples in multiple languages. Issue, verify, and revoke credentials programmatically."
          />
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-zinc-100 bg-zinc-50 py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to secure your agentic commerce?</h2>
          <p className="text-zinc-600 text-lg mb-8 max-w-xl mx-auto">
            Get started in minutes. Issue your first credential, verify a transaction, and see the full lifecycle in the dashboard.
          </p>
          <Link href="/auth/sign-up" className="bg-zinc-900 text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors inline-block">
            Create your free account →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-100 py-8">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-xs text-zinc-500">
          <div>© 2026 KYA — Know Your Agent. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <Link href="/docs" className="hover:text-zinc-700">API Docs</Link>
            <Link href="/status" className="hover:text-zinc-700">Status</Link>
            <Link href="/auth/login" className="hover:text-zinc-700">Dashboard login</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function LifecycleStep({ number, title, description, color }: {
  number: string; title: string; description: string; color: string
}) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    red: 'bg-red-500/10 border-red-500/20 text-red-400',
  }
  return (
    <div className={`rounded-xl border p-6 ${colorMap[color]}`}>
      <div className="text-xs font-mono opacity-50 mb-3">{number}</div>
      <h3 className="font-semibold text-lg text-white mb-2">{title}</h3>
      <p className="text-sm text-zinc-400 leading-relaxed">{description}</p>
    </div>
  )
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="border border-zinc-200 rounded-xl p-6 hover:border-zinc-300 transition-colors">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-zinc-600 leading-relaxed">{description}</p>
    </div>
  )
}
