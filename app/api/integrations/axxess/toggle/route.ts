import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { email, password, agencyId, environment } = body

    
    const { data, error } = await supabaseAdmin
      .from('axxess_integrations') // ✅ match table name
      .upsert([
        {
          email,
          password,
          agency_id: agencyId,
          environment,
          enabled: true,
        }
      ])

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Integration saved!', data })
  } catch (err: any) {
    console.error('Route error:', err)
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 })
  }
}
