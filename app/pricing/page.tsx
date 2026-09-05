import Link from 'next/link'

export default function PricingPage() {
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
            <Link href="/how-it-works" className="text-zinc-600 hover:text-zinc-900">How it works</Link>
            <Link href="/pricing" className="text-zinc-900 font-medium">Pricing</Link>
            <Link href="/auth/login" className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800">
              Log in
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold mb-4 text-center">Simple, transparent pricing</h1>
        <p className="text-lg text-zinc-600 text-center mb-12 max-w-xl mx-auto">
          Start free. Scale with your agent fleet. No hidden fees.
        </p>

        <div className="grid grid-cols-3 gap-6 max-w-5xl mx-auto">
          <PricingCard
            name="Starter"
            price="Free"
            period="forever"
            description="For prototyping and testing your first agent integration."
            features={[
              'Up to 10 active agents',
              '1,000 verifications/month',
              'Standard anomaly detection',
              'Community support',
              'Single team member',
            ]}
            cta="Get started"
            ctaHref="/auth/sign-up"
            highlighted={false}
          />
          <PricingCard
            name="Growth"
            price="₹4,999"
            period="/month"
            description="For production agent fleets with real transaction volume."
            features={[
              'Up to 100 active agents',
              '50,000 verifications/month',
              'Advanced anomaly detection',
              'Priority email support',
              'Up to 5 team members',
              'CSV audit log export',
              'Custom policy thresholds',
            ]}
            cta="Start free trial"
            ctaHref="/auth/sign-up"
            highlighted={true}
          />
          <PricingCard
            name="Enterprise"
            price="Custom"
            period=""
            description="For high-volume platforms with compliance and SLA requirements."
            features={[
              'Unlimited agents',
              'Unlimited verifications',
              'Custom anomaly models',
              'Dedicated support + SLA',
              'Unlimited team members',
              'SOC2 compliance package',
              'Custom integrations + webhooks',
              'Network graph analysis',
            ]}
            cta="Contact sales"
            ctaHref="mailto:sales@kya.dev"
            highlighted={false}
          />
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-zinc-500">
            All plans include: cryptographic credentials, real-time verification, immutable audit trail, and fail-safe/fail-open configuration.
          </p>
        </div>
      </div>
    </div>
  )
}

function PricingCard({ name, price, period, description, features, cta, ctaHref, highlighted }: {
  name: string; price: string; period: string; description: string;
  features: string[]; cta: string; ctaHref: string; highlighted: boolean
}) {
  return (
    <div className={`rounded-xl p-6 border ${
      highlighted
        ? 'bg-zinc-950 text-white border-zinc-800 shadow-xl'
        : 'bg-white border-zinc-200'
    }`}>
      {highlighted && (
        <div className="text-xs font-medium text-emerald-400 mb-3 uppercase">Most popular</div>
      )}
      <h3 className="font-semibold text-lg mb-1">{name}</h3>
      <div className="mb-3">
        <span className="text-3xl font-bold">{price}</span>
        {period && <span className={`text-sm ml-1 ${highlighted ? 'text-zinc-400' : 'text-zinc-500'}`}>{period}</span>}
      </div>
      <p className={`text-sm mb-6 ${highlighted ? 'text-zinc-400' : 'text-zinc-600'}`}>{description}</p>
      <ul className="space-y-2 mb-6">
        {features.map((f, i) => (
          <li key={i} className={`text-sm flex items-start gap-2 ${highlighted ? 'text-zinc-300' : 'text-zinc-600'}`}>
            <span className="text-emerald-500 mt-0.5">✓</span>
            {f}
          </li>
        ))}
      </ul>
      <Link
        href={ctaHref}
        className={`block text-center py-2.5 rounded-lg text-sm font-medium transition-colors ${
          highlighted
            ? 'bg-white text-zinc-900 hover:bg-zinc-100'
            : 'bg-zinc-900 text-white hover:bg-zinc-800'
        }`}
      >
        {cta}
      </Link>
    </div>
  )
}
