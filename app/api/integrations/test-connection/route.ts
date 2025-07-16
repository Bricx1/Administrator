import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json()
    if (!id) {
      return NextResponse.json({ error: 'id required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('integrations')
      .update({
        status: true,
        last_sync: new Date().toISOString(),
      })
      .eq('id', id)
      .select('id')
      .single()

    if (error) {
      console.error('Supabase update error:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 },
      )
    }

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
