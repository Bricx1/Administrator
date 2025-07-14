import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(
  _req: NextRequest,
  context: { params: { integrationId: string } },
) {
  const { integrationId } = context.params
  try {
    const { data: current, error: fetchError } = await supabase
      .from('integrations')
      .select('api_calls_today')
      .eq('id', integrationId)
      .single()
    if (fetchError) throw fetchError

    const { data, error } = await supabase
      .from('integrations')
      .update({
        last_sync: new Date().toISOString(),
        api_calls_today: (current?.api_calls_today || 0) + 1,
      })
      .eq('id', integrationId)
      .select('last_sync, api_calls_today')
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (err) {
    console.error('Sync integration error:', err)
    return NextResponse.json({ error: 'Failed to sync integration' }, { status: 500 })
  }
}
