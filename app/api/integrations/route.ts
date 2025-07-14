import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const categoryParam = searchParams.get('category')
    const category =
      typeof categoryParam === 'string' && categoryParam.trim().length > 0
        ? categoryParam
        : undefined

    let query = supabase
      .from('integrations')
      .select('*')
      .order('created_at', { ascending: true })

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query

    if (error) {
      console.error('Fetch integrations error:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 },
      )
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error('Unexpected integrations API error:', err)
    return NextResponse.json(
      { success: false, error: 'Unexpected server error' },
      { status: 500 },
    )
  }
}
