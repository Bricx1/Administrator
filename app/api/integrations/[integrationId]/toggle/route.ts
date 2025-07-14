import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(
  request: NextRequest,
  { params }: { params: { integrationId: string } },
) {
  try {
    const { enabled } = await request.json()
    if (typeof enabled !== 'boolean') {
      return NextResponse.json({ error: 'enabled required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('integration_configs')
      .update({ enabled })
      .eq('id', params.integrationId)
      .select('id, enabled')
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, connected: data.enabled })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Failed to toggle integration' },
      { status: 500 },
    )
  }
}
