// /app/api/integrations/[integrationId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET a single integration by ID
export async function GET(
  _request: NextRequest,
  { params }: { params: { integrationId: string } }
) {
  try {
    const { data, error } = await supabase
      .from('integrations')
      .select('*')
      .eq('id', params.integrationId)
      .single()

    if (error) throw error

    if (!data) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error('[GET Integration Error]', err)
    return NextResponse.json(
      { error: 'Failed to fetch integration' },
      { status: 500 }
    )
  }
}

// POST to update integration status or fields
export async function POST(
  request: NextRequest,
  { params }: { params: { integrationId: string } }
) {
  try {
    const body = await request.json()

    // Ensure ID is included for upsert
    const updates = { ...body, id: params.integrationId }

    const { data, error } = await supabase
      .from('integrations')
      .upsert(updates, { onConflict: 'id' })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (err) {
    console.error('[POST Integration Error]', err)
    return NextResponse.json(
      { error: 'Failed to update integration' },
      { status: 500 }
    )
  }
}
