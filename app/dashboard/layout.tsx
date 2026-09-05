import { createClient } from '@/lib/supabase/server'
import { getRole } from '@/lib/role'
import Link from 'next/link'
import InterfaceToggle from '@/components/interface-toggle'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const role = getRole(user?.email)

  return (
    <div className="dark min-h-screen bg-zinc-950 text-zinc-100">
      <div className="bg-amber-900/30 border-b border-amber-800 text-amber-200 text-sm px-6 py-2 flex items-center justify-between gap-4">
        <span>⚠ Demonstration/prototype system — not connected to real payment rails.</span>
        <InterfaceToggle />
      </div>
      <div className="flex">
        <aside className="w-56 border-r border-zinc-800 min-h-screen p-4 space-y-1">
          <div className="text-xs uppercase text-zinc-500 mb-4 px-2">KYA Admin</div>
          <NavLink href="/dashboard">Overview</NavLink>
          <NavLink href="/dashboard/agents">Agents</NavLink>
          <NavLink href="/dashboard/monitor">Live Monitor</NavLink>
          <NavLink href="/dashboard/flags">Case Queue</NavLink>
          <NavLink href="/dashboard/audit">Audit Log</NavLink>
          <NavLink href="/dashboard/credentials/new">Issue Credential</NavLink>
          <NavLink href="/dashboard/network">Network Graph</NavLink>
          {role === 'senior_admin' && <NavLink href="/dashboard/settings">Policy Settings</NavLink>}
          {role === 'senior_admin' && <NavLink href="/dashboard/pending-credentials">Pending Approvals</NavLink>}
          <NavLink href="/dashboard/agent-view">AI Interface</NavLink>
          <NavLink href="/developer">Developer Portal</NavLink>
          <NavLink href="/runbook">Runbook</NavLink>
          <div className="mt-8 px-2 text-xs text-zinc-500">
            {user?.email} · <span className="text-zinc-400">{role}</span>
          </div>
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="block px-2 py-1.5 rounded text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white">
      {children}
    </Link>
  )
}