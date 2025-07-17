import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limitParam = searchParams.get('limit')
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const limit = limitParam ? parseInt(limitParam, 10) : 50

    let query = supabase
      .from('availity_transactions')
      .select('*')
      .order('created_at', { ascending: false })

    if (status) query = query.eq('status', status)
    if (type) query = query.eq('type', type)
    if (limit) query = query.limit(limit)

    const { data, error } = await query

    if (error) {
      console.error('Fetch availity transactions error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data ?? [])
  } catch (err) {
    console.error('Availity transactions route error:', err)
    return NextResponse.json(
      { error: 'Failed to fetch transactions' },
      { status: 500 },
    )
  }
}
