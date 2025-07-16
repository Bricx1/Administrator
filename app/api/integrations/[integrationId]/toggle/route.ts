import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

interface TogglePayload {
  enabled: boolean
}

export async function POST(
  request: NextRequest,
  { params }: { params: { integrationId: string } },
) {
  try {
    const id = params.integrationId
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Missing integration id' },
        { status: 400 },
      )
    }

    let body: TogglePayload | undefined
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON body' },
        { status: 400 },
      )
    }

    if (!body || typeof body.enabled !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'Invalid payload' },
        { status: 400 },
      )
    }

    const { data, error } = await supabase
      .from('integrations')
      .update({
        enabled: body.enabled,
        status: body.enabled,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('enabled')
      .single()

    if (error) {
      console.error('Failed to update integration:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 },
      )
    }

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Not found' },
        { status: 404 },
      )
    }

    return NextResponse.json({ success: true, enabled: data.enabled })
  } catch (err) {
    console.error('Toggle integration error:', err)
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 },
    )
  }
}
