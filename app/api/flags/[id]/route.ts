import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request, { params }: any) {
  const resolvedParams = await params
  const id = resolvedParams.id

  const supabase = await createClient()
  const { data: flag, error } = await supabase
    .from('anomaly_flags')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !flag) {
    return NextResponse.json({ error: 'Flag not found' }, { status: 404 })
  }

  return NextResponse.json(flag)
}
