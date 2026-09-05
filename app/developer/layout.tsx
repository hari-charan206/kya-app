import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DeveloperLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900">
      <nav className="bg-white border-b border-zinc-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 bg-zinc-900 rounded-lg flex items-center justify-center">
                <span className="text-white text-[10px] font-bold">K</span>
              </div>
              <span className="font-semibold">KYA</span>
            </Link>
            <span className="text-xs text-zinc-400 border-l border-zinc-200 pl-6">Developer Portal</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-zinc-500">{user.email}</span>
            <Link href="/dashboard" className="text-blue-600 hover:underline">Admin Dashboard →</Link>
          </div>
        </div>
      </nav>

      <div className="flex">
        <aside className="w-52 border-r border-zinc-200 bg-white min-h-[calc(100vh-53px)] p-4 space-y-1">
          <div className="text-[10px] uppercase text-zinc-400 font-semibold mb-3 px-2">Developer</div>
          <DevNavLink href="/developer">My Agents</DevNavLink>
          <DevNavLink href="/developer/sandbox">Sandbox</DevNavLink>
          <DevNavLink href="/developer/credentials">Credentials</DevNavLink>
          <DevNavLink href="/developer/events">Event Log</DevNavLink>
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

function DevNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block px-3 py-2 rounded text-sm text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
    >
      {children}
    </Link>
  )
}
