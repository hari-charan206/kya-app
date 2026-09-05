import { NextResponse } from 'next/server'
import { setSystemOutage, getSystemOutage } from '@/app/api/verify/route'
import { logAudit } from '@/lib/audit'

// POST /api/system-outage — toggle the outage simulation
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const { active } = body

  const newState = typeof active === 'boolean' ? active : !getSystemOutage()
  setSystemOutage(newState)

  await logAudit({
    entity_type: 'system',
    entity_id: 'outage_simulation',
    action: newState ? 'outage_activated' : 'outage_deactivated',
    actor: 'senior_admin',
    details: newState
      ? 'System outage simulation activated — all verify calls will follow fail_mode policy'
      : 'System outage simulation deactivated — normal verification resumed',
  })

  return NextResponse.json({
    outage_active: newState,
    message: newState
      ? 'Outage simulation active. POST /api/verify calls now follow the configured fail_mode policy.'
      : 'Outage simulation ended. Normal verification resumed.',
  })
}

// GET /api/system-outage — check current outage status
export async function GET() {
  return NextResponse.json({ outage_active: getSystemOutage() })
}
