// FINAL: Working /api/integrations/axxess/route.ts with FULL Logging & Safe Insert

import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('🟡 Received body:', body)

    const {
      user_id,
      username,
      password_encrypted,
      agency_id,
      environment = 'production',
      sync_patients = true,
      sync_orders = true,
      sync_documents = true,
      sync_physicians = true,
      sync_frequency = 'hourly'
    } = body

    // Required checks
    if (!user_id || !username || !password_encrypted || !agency_id) {
      console.warn('⚠️ Missing required fields')
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const payload = {
      user_id,
      username,
      password_encrypted,
      agency_id,
      environment,
      sync_patients,
      sync_orders,
      sync_documents,
      sync_physicians,
      sync_frequency,
      last_synced_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    console.log('📝 Attempting to insert into Supabase:', payload)

    const { data, error } = await supabaseAdmin
      .from('axxess_integrations')
      .insert([payload]) // DO NOT use upsert while testing!

    if (error) {
      console.error('❌ Supabase insert error:', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    console.log('✅ Supabase insert result:', data)
    return NextResponse.json({ success: true, data })
  } catch (err: any) {
    console.error('❌ Unexpected server error:', err)
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
