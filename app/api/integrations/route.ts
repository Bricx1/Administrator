import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function GET() {
  const { data, error } = await supabase
    .from('integrations')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Fetch integrations error:', error)
    return NextResponse.json({ error: 'Failed to fetch integrations' }, { status: 500 })
  }

  return NextResponse.json(data)
}
