import { createClient } from '@/lib/supabase/server'

export async function logAudit({
  entity_type,
  entity_id,
  action,
  actor,
  details,
}: {
  entity_type: string
  entity_id: string
  action: string
  actor: string
  details?: string
}) {
  const supabase = await createClient()
  const { error } = await supabase.from('audit_logs').insert({
    entity_type,
    entity_id,
    action,
    actor,
    details: details ?? null,
  })
  
  if (error) console.error('Audit log write failed:', error.message)
}