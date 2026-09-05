import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getRole } from '@/lib/role'
import ApproveButton from './approve-button'

export const instant = false

export default async function PendingCredentialsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const role = getRole(user?.email)

  if (role !== 'senior_admin') {
    redirect('/dashboard')
  }

  // Try to fetch pending credentials — gracefully handle missing table
  let pending: any[] | null = null
  let tableMissing = false

  try {
    const result = await supabase
      .from('pending_credentials')
      .select('*, agents(name)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (result.error) {
      if (result.error.message?.includes('pending_credentials') || result.error.code === '42P01') {
        tableMissing = true
      } else {
        // Some other error — still show the page but log it
        console.error('Failed to fetch pending credentials:', result.error.message)
      }
    } else {
      pending = result.data
    }
  } catch {
    tableMissing = true
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard" className="text-xs text-blue-400 hover:underline mb-2 inline-block">
          ← Back to Dashboard
        </Link>
        <h1 className="text-2xl font-semibold text-white">Pending Credential Approvals</h1>
        <p className="text-xs text-zinc-500 mt-1">
          High-value credential requests exceeding the auto-approve threshold require your approval.
          When an admin issues a credential above the max_auto_approved_credential policy value,
          the request appears here instead of being issued immediately.
        </p>
      </div>

      {tableMissing && (
        <div className="bg-amber-950/30 border border-amber-900/50 rounded-lg p-6 space-y-3">
          <div className="text-amber-400 text-sm font-semibold">⏳ Pending approvals table not yet created</div>
          <p className="text-xs text-zinc-400">
            The <code className="bg-zinc-800 px-1 rounded text-amber-300">pending_credentials</code> table needs to be
            created in your Supabase database. Run the migration at{' '}
            <code className="bg-zinc-800 px-1 rounded text-zinc-300">supabase/migrations/0001_init.sql</code> against
            your Supabase project to enable the approval workflow.
          </p>
          <p className="text-xs text-zinc-500">
            Until then, credentials above the threshold will be issued directly (the policy gate is skipped gracefully).
          </p>
          <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs font-mono text-zinc-400 overflow-x-auto">
            <div className="text-zinc-600 mb-1"># In your Supabase SQL Editor, paste and run:</div>
            <div className="text-zinc-300">-- See supabase/migrations/0001_init.sql</div>
          </div>
        </div>
      )}

      {!tableMissing && (
        <div className="space-y-3">
          {(pending ?? []).map((p: any) => (
            <div key={p.id} className="bg-zinc-950 border border-amber-900/50 rounded-lg p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm font-semibold text-white mb-1">
                    {p.agents?.name ?? p.agent_id?.slice(0, 8)} — ₹{Number(p.max_amount).toLocaleString('en-IN')}
                  </div>
                  <div className="text-xs text-zinc-400 space-y-0.5">
                    <div>Categories: {p.allowed_categories?.join(', ')}</div>
                    <div>Expires in: {p.expires_in_days} days</div>
                    <div>Requested by: {p.requested_by}</div>
                    <div>Created: {new Date(p.created_at).toISOString().replace('T', ' ').substring(0, 19)}</div>
                  </div>
                </div>
                <ApproveButton pendingId={p.id} />
              </div>
            </div>
          ))}
          {(!pending || pending.length === 0) && (
            <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-8 text-center">
              <div className="text-2xl mb-2">✅</div>
              <div className="text-sm text-zinc-400 font-medium mb-1">No pending approvals</div>
              <div className="text-xs text-zinc-600 max-w-md mx-auto">
                When a credential is requested with an amount above the auto-approve threshold
                (currently ₹50,000), it appears here for your review before being issued.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
