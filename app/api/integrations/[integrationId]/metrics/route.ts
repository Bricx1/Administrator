import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

function mockMetrics(id: string) {
  return {
    integration_id: id,
    api_calls_today: Math.floor(Math.random() * 100),
    uptime: 99.8,
    success_rate: 0.97,
    avg_response: 120,
    recent_activity: [
      { message: 'Sync completed', timestamp: new Date().toISOString() },
    ],
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { integrationId: string } },
) {
  try {
    const { data } = await supabase
      .from('integration_metrics')
      .select('*')
      .eq('integration_id', params.integrationId)
      .single()
    if (!data) {
      return NextResponse.json(mockMetrics(params.integrationId))
    }
    return NextResponse.json(data)
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Failed to load metrics' },
      { status: 500 },
    )
  }
}
