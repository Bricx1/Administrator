import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(
  request: NextRequest,
  { params }: { params: { integrationId: string } },
) {
  if (!params.integrationId) {
    return NextResponse.json({ success: false, error: 'Invalid integrationId' }, { status: 400 })
  }
  try {
    console.log('[referral-rules]', params.integrationId)
    const {
      accepted_insurance,
      min_reimbursement,
      max_distance,
      required_services,
      excluded_diagnoses,
      msw_notifications,
    } = await request.json()

    const { error } = await supabaseAdmin.from('integration_referral_rules').upsert({
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
      { success: false, error: 'Failed to save referral rules' },
      { status: 500 },
    )
  }
}
