import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

interface IntegrationRow {
  id: string
  status: boolean
}

export async function POST(
  request: NextRequest,
  { params }: { params: { integrationId: string } },
) {
  try {
    if (!params.integrationId) {
      return NextResponse.json(
        { success: false, error: 'Missing integration id' },
        { status: 400 },
      )
    }

    const { enabled } = await request.json()

    if (typeof enabled !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'Invalid payload' },
        { status: 400 },
      )
    }

    const { data, error } = await supabase
      .from('integrations')
      .update({ status: enabled })
      .eq('id', params.integrationId)
      .select('status')
      .single()

    if (error) {
      console.error('Failed to update integration status', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, enabled: data.status })
  } catch (err) {
    console.error('Toggle integration error:', err)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
