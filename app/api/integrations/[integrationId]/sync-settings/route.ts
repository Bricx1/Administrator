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
    console.log('[sync-settings]', params.integrationId)
    const { data_types, sync_frequency } = await request.json()

    const { error } = await supabaseAdmin.from('integration_sync_settings').upsert({
      integration_id: params.integrationId,
      data_types,
      sync_frequency,
      updated_at: new Date().toISOString(),
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { success: false, error: 'Failed to save sync settings' },
      { status: 500 },
    )
  }
}
