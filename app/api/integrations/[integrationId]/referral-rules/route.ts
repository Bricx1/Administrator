import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(
  request: NextRequest,
  { params }: { params: { integrationId: string } },
) {
  try {
    const {
      accepted_insurance,
      min_reimbursement,
      max_distance,
      required_services,
      excluded_diagnoses,
      msw_notifications,
    } = await request.json()
    if (!Array.isArray(accepted_insurance)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }
    const { error } = await supabase.from('integration_referral_rules').upsert({
      integration_id: params.integrationId,
      accepted_insurance,
      min_reimbursement,
      max_distance,
      required_services,
      excluded_diagnoses,
      msw_notifications,
      updated_at: new Date().toISOString(),
    })
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Failed to save referral rules' },
      { status: 500 },
    )
  }
}
