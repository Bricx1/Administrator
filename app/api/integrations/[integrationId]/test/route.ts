import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { integrationId: string } },
) {
  try {
    const { action } = await request.json()

    const responses = ['success', 'pending', 'failed'] as const
    const status = responses[Math.floor(Math.random() * responses.length)]

    const result = { action, status, timestamp: new Date().toISOString() }

    return NextResponse.json({ success: true, result })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Failed to run test' },
      { status: 500 },
    )
  }
}
