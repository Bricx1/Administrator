import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body
    if (!id) {
      return NextResponse.json({ error: 'id required' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('integrations')
      .upsert({ id, ...updates })
      .select('id')
      .single()

    if (error) {
      console.error('Supabase upsert error:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true, id: data?.id }, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Failed to configure integration' },
      { status: 500 },
    )
  }
}
