'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function InterfaceToggle() {
  const pathname = usePathname()
  const isAgentView = pathname.startsWith('/dashboard/agent-view')

  return (
    <div className="flex bg-zinc-900 border border-zinc-800 rounded-lg p-1 text-xs font-medium">
      <Link
        href="/dashboard"
        className={`px-3 py-1.5 rounded-md transition-colors ${
          !isAgentView ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        User interface
      </Link>
      <Link
        href="/dashboard/agent-view"
        className={`px-3 py-1.5 rounded-md transition-colors ${
          isAgentView ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        AI interface
      </Link>
    </div>
  )
}
