import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  _request: NextRequest,
  { params }: { params: { integrationId: string } }
) {
  if (!params.integrationId || params.integrationId.length < 3) {
    return NextResponse.json({ success: false, error: 'Invalid integrationId' }, { status: 400 })
  }
  try {
    console.log('[integration:get]', params.integrationId)
    const { data, error } = await supabaseAdmin
      .from('integrations')
      .select('*')
      .eq('id', params.integrationId)
      .single()

    if (error) throw error
    if (!data) {
      return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch integration' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { integrationId: string } }
) {
  if (!params.integrationId || params.integrationId.length < 3) {
    return NextResponse.json({ success: false, error: 'Invalid integrationId' }, { status: 400 })
  }
  try {
    console.log('[integration:post]', params.integrationId)
    const body = await request.json()
    const updates = { ...body, id: params.integrationId }
    const { data, error } = await supabaseAdmin
      .from('integrations')
      .upsert(updates)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { success: false, error: 'Failed to update integration' },
      { status: 500 }
    )
  }
}
