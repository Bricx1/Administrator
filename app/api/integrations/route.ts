import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')

  const baseQuery = supabase
    .from('integrations')
    .select('*')
    .order('created_at', { ascending: true })

  const { data, error } = category
    ? await baseQuery.eq('category', category)
    : await baseQuery

  if (error) {
    console.error('Fetch integrations error:', error)
    return NextResponse.json({ error: 'Failed to fetch integrations' }, { status: 500 })
  }

  return NextResponse.json(data)
}
