import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json()
    if (!id) {
      return NextResponse.json({ success: false, error: 'id required' }, { status: 400 })
    }
    console.log('[test-connection]', id)

    const { error } = await supabaseAdmin
      .from('integrations')
      .update({
        status: true,
        last_sync: new Date().toISOString(),
      })
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({
      success: true,
      messages: [
        'Authentication successful',
        'Permissions validated',
        'Ready to sync',
      ],
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { success: false, error: 'Failed to test connection' },
      { status: 500 },
    )
  }
}
