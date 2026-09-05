import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getRole } from '@/lib/role'
import SettingsForm from './settings-form'

export const instant = false

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const role = getRole(user?.email)

  if (role !== 'senior_admin') {
    redirect('/dashboard')
  }

  // Try to fetch settings — gracefully handle missing table
  let settingsMap: Record<string, any> = {}

  try {
    const { data: settings, error } = await supabase
      .from('policy_settings')
      .select('*')

    if (!error && settings) {
      for (const s of settings) {
        settingsMap[s.key] = s.value
      }
    }
  } catch {
    // Table doesn't exist — use defaults
  }

  const tableMissing = Object.keys(settingsMap).length === 0

  return (
    <div className="space-y-6">
      <div>
        <Link href="/dashboard" className="text-xs text-blue-400 hover:underline mb-2 inline-block">
          ← Back to Dashboard
        </Link>
        <h1 className="text-2xl font-semibold text-white">Policy Settings</h1>
        <p className="text-xs text-zinc-500 mt-1">
          Platform-wide rules governing credential issuance, verification, and failover behavior.
          Changes take effect immediately.
        </p>
      </div>

      {tableMissing && (
        <div className="bg-amber-950/30 border border-amber-900/50 rounded-lg p-4 text-xs text-amber-300">
          ⚠ The <code className="bg-zinc-800 px-1 rounded">policy_settings</code> table was not found.
          Settings below are using in-memory defaults. Run the migration to persist changes across restarts.
          <div className="mt-2 bg-zinc-950 border border-zinc-800 rounded p-2 font-mono text-zinc-500 text-[10px]">
            Run: supabase/migrations/0001_init.sql in your Supabase SQL Editor
          </div>
        </div>
      )}

      <SettingsForm settings={settingsMap} />
    </div>
  )
}
