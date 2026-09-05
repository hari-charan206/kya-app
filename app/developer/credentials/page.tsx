import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const instant = false

export default async function DeveloperCredentialsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Get user's agents
  const { data: agents } = await supabase
    .from('agents')
    .select('id, name')
    .eq('owner_user_id', user?.id ?? '')

  const agentIds = (agents ?? []).map(a => a.id)
  const agentMap: Record<string, string> = {}
  for (const a of agents ?? []) agentMap[a.id] = a.name

  // Get credentials for user's agents
  const { data: credentials } = await supabase
    .from('credentials')
    .select('*')
    .in('agent_id', agentIds.length > 0 ? agentIds : ['__none__'])
    .order('issued_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Credentials</h1>
        <p className="text-sm text-zinc-500 mt-1">
          View, rotate, and revoke credentials for your registered agents.
        </p>
      </div>

      <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden">
        <table className="w-full text-xs text-left">
          <thead className="bg-zinc-50 border-b border-zinc-200">
            <tr>
              <th className="p-3 font-semibold text-zinc-600">Agent</th>
              <th className="p-3 font-semibold text-zinc-600">Status</th>
              <th className="p-3 font-semibold text-zinc-600">Max Amount</th>
              <th className="p-3 font-semibold text-zinc-600">Categories</th>
              <th className="p-3 font-semibold text-zinc-600">Expires</th>
              <th className="p-3 font-semibold text-zinc-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(credentials ?? []).map((cred: any) => (
              <tr key={cred.id} className="border-b border-zinc-100">
                <td className="p-3 font-medium">{agentMap[cred.agent_id] ?? cred.agent_id.slice(0, 8)}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    cred.status === 'active'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {cred.status}
                  </span>
                </td>
                <td className="p-3">₹{Number(cred.max_amount).toLocaleString('en-IN')}</td>
                <td className="p-3 text-zinc-600">{cred.allowed_categories?.join(', ') ?? '—'}</td>
                <td className="p-3 text-zinc-500">
                  {cred.expires_at ? new Date(cred.expires_at).toLocaleDateString() : '—'}
                </td>
                <td className="p-3 text-right text-zinc-400">
                  {cred.status === 'active' && (
                    <span className="text-[10px]">Issued {new Date(cred.issued_at).toLocaleDateString()}</span>
                  )}
                </td>
              </tr>
            ))}
            {(!credentials || credentials.length === 0) && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-zinc-500">
                  No credentials yet.{' '}
                  <Link href="/dashboard/credentials/new" className="text-blue-600 hover:underline">
                    Issue one →
                  </Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
