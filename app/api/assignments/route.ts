import { type NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

// Fetch all assignments
export async function GET() {
  const { data, error } = await supabase
    .from('assignments')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Fetch assignments error:', error)
    return NextResponse.json({ error: 'Failed to fetch assignments' }, { status: 500 })
  }

  return NextResponse.json(data)
}

// Create a new assignment
export async function POST(request: NextRequest) {
  try {
    const { staff_id, shift_id, status } = await request.json()
    const { data, error } = await supabase
      .from('assignments')
      .insert({ staff_id, shift_id, status })
      .select()
      .single()

    if (error) {
      console.error('Add assignment error:', error)
      return NextResponse.json({ error: 'Failed to create assignment' }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error('Add assignment exception:', err)
    return NextResponse.json({ error: 'Failed to create assignment' }, { status: 500 })
  }
}
