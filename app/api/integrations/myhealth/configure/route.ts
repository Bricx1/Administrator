import { type NextRequest, NextResponse } from 'next/server'
import supabase from '@/lib/supabaseClient'

export async function POST(request: NextRequest) {
  try {
    const { api_key, secret, url } = await request.json()

    console.log('Saving MyHealth configuration...')
    await supabase.from('integration_settings').insert({ platform: 'myhealth', api_key, secret, url })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('MyHealth configuration error:', error)
    return NextResponse.json({ error: 'Failed to save configuration' }, { status: 500 })
  }
}
