import { NextResponse } from 'next/server'

export async function GET(
  _request: Request,
  { params }: { params: { integrationId: string } },
) {
  try {
    const metrics = {
      integration_id: params.integrationId,
      api_calls_today: Math.floor(Math.random() * 50),
      uptime: Number((Math.random() * 100).toFixed(2)),
      success_rate: Number((90 + Math.random() * 10).toFixed(2)),
      avg_response: Number((Math.random() * 1000).toFixed(0)),
      recent_activity: [
        { event: 'sync', timestamp: new Date().toISOString() },
      ],
    }

    return NextResponse.json(metrics)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 })
  }
}
