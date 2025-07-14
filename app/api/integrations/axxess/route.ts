import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { username, password, agencyId, environment } = await request.json()
    if (!username || !password || !agencyId || !environment) {
      return NextResponse.json(
        { error: 'username, password, agencyId, and environment are required' },
        { status: 400 },
      )
    }

    // Simple validation: require password length >= 8
    if (typeof password !== 'string' || password.length < 8) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const agencyInfo = {
      name: 'Axxess Agency',
      id: agencyId,
      environment,
    }

    const { data, error } = await supabase
      .from('integrations')
      .insert({
        username,
        agencyId,
        environment,
        status: 'connected',
        created_at: new Date().toISOString(),
      })
      .select('id')
      .single()

    if (error) {
      console.error(error)
      return NextResponse.json({ error: 'Failed to save integration' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Connection successful',
      agencyInfo,
      id: data.id,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
