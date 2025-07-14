import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function PATCH(
  request: NextRequest,
  context: { params: { integrationId: string } },
) {
  const { integrationId } = context.params
  try {
    const { data: current, error: fetchError } = await supabase
      .from('integrations')
      .select('status, api_calls_today, last_sync')
      .eq('id', integrationId)
      .single()
    if (fetchError) throw fetchError

    const newStatus = !current?.status
    const { data, error } = await supabase
      .from('integrations')
      .update({ status: newStatus })
      .eq('id', integrationId)
      .select('status, last_sync, api_calls_today')
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (err) {
    console.error('Toggle integration error:', err)
    return NextResponse.json({ error: 'Failed to toggle integration' }, { status: 500 })
  }
}
