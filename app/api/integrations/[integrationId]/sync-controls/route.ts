import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(
  request: NextRequest,
  { params }: { params: { integrationId: string } },
) {
  try {
    const {
      auto_eligibility_check,
      auto_prior_auth,
      real_time_updates,
      sync_interval,
    } = await request.json()

    const { error } = await supabase.from('integration_sync_controls').upsert({
      integration_id: params.integrationId,
      auto_eligibility_check,
      auto_prior_auth,
      real_time_updates,
      sync_interval,
      updated_at: new Date().toISOString(),
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Failed to save sync controls' },
      { status: 500 },
    )
  }
}
