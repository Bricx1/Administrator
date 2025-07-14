import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const { name, api_key, endpoint_url } = await request.json()

    if (!name || !api_key || !endpoint_url) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('integration_configs')
      .insert({
        name,
        api_key,
        endpoint_url,
        enabled: true,
      })
      .select('id')
      .single()

    if (error) {
      console.error(error)
      return NextResponse.json({ error: 'Failed to save config' }, { status: 500 })
    }

    return NextResponse.json({ success: true, id: data.id })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

