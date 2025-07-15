import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    console.log('[integrations:configure]')
    const body = await request.json()
    const { id, ...updates } = body
    if (!id) {
      return NextResponse.json({ success: false, error: 'id required' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('integrations')
      .upsert({ id, ...updates })

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { success: false, error: 'Failed to configure integration' },
      { status: 500 },
    )
  }
}
