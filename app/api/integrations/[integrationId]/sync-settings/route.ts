import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(
  request: NextRequest,
  { params }: { params: { integrationId: string } },
) {
  try {
    const { data_types, sync_frequency } = await request.json()
    if (!Array.isArray(data_types) || !sync_frequency) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }
    const { error } = await supabase.from('integration_sync_settings').upsert({
      integration_id: params.integrationId,
      data_types,
      sync_frequency,
      updated_at: new Date().toISOString(),
    })
    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}
