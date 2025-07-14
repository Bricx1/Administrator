import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  let supabase
  try {
    supabase = createServerClient()
  } catch (err) {
    console.error('Supabase client init failed:', err)
    return NextResponse.json(
      { error: 'Supabase client not configured' },
      { status: 500 },
    )
  }
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
    const message = err instanceof Error ? err.message : String(err)
    console.error('Unexpected integrations API error:', message)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
