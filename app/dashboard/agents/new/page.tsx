import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import RegisterAgentForm from './register-agent-form'

export const instant = false

export default async function NewAgentPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <Link href="/dashboard/agents" className="text-xs text-blue-400 hover:underline mb-2 inline-block">
          ← Back to Agents
        </Link>
        <h1 className="text-2xl font-semibold text-white">Register Agent</h1>
        <p className="text-xs text-zinc-500 mt-1">
          Registering an agent just creates its identity record. It won&apos;t be able to do
          anything until you issue it a scoped credential.
        </p>
      </div>

      <RegisterAgentForm ownerUserId={user.id} />
    </div>
  )
}
