import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { logAudit } from '@/lib/audit'

// GET /api/policy-settings — read all policy settings
export async function GET() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('policy_settings')
    .select('*')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ settings: data })
}

// POST /api/policy-settings — update one or more policy settings
export async function POST(request: Request) {
  const body = await request.json()
  const { settings } = body

  if (!Array.isArray(settings) || settings.length === 0) {
    return NextResponse.json({ error: 'settings array is required' }, { status: 400 })
  }

  const supabase = await createClient()

  for (const { key, value } of settings) {
    const { error } = await supabase
      .from('policy_settings')
      .upsert({
        key,
        value: value,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'key' })

    if (error) {
      return NextResponse.json({ error: `Failed to update ${key}: ${error.message}` }, { status: 500 })
    }

    await logAudit({
      entity_type: 'policy_settings',
      entity_id: key,
      action: 'policy_updated',
      actor: 'senior_admin',
      details: `Updated ${key} to ${JSON.stringify(value)}`,
    })
  }

  return NextResponse.json({ success: true })
}
