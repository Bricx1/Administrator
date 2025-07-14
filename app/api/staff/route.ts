import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// Fetch all staff
export async function GET() {
  const { data, error } = await supabase
    .from('staff')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Fetch staff error:', error)
    return NextResponse.json({ error: 'Failed to fetch staff' }, { status: 500 })
  }

  return NextResponse.json(data)
}

// Add a new staff member
export async function POST(request: NextRequest) {
  try {
    const { name, email, role } = await request.json()
    const { data, error } = await supabase
      .from('staff')
      .insert({ name, email, role })
      .select()
      .single()

    if (error) {
      console.error('Add staff error:', error)
      return NextResponse.json({ error: 'Failed to add staff' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error('Add staff exception:', err)
    return NextResponse.json({ error: 'Failed to add staff' }, { status: 500 })
  }
}
