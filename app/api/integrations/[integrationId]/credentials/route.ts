import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { encrypt } from '@/lib/encryption'

export async function POST(
  request: NextRequest,
  { params }: { params: { integrationId: string } },
) {
  if (!params.integrationId) {
    return NextResponse.json(
      { success: false, message: 'Invalid integrationId', data: null },
      { status: 400 },
    )
  }
  try {
    console.log('[credentials:post]', params.integrationId)
    const { email, password, agencyId, environment } = await request.json()

    if (!email || !password || !agencyId) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields', data: null },
        { status: 400 },
      )
    }

    const { data, error } = await supabaseAdmin
      .from('axxess_integrations')
      .upsert({
        email,
        password: encrypt(password),
        agency_id: agencyId,
        environment,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      console.error('[supabase] failed to save credentials', error)
      return NextResponse.json(
        { success: false, message: 'Failed to save credentials', data: null },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true, message: 'Credentials saved', data })
  } catch (err) {
    console.error('[credentials] unexpected error', err)
    return NextResponse.json(
      { success: false, message: 'Server error', data: null },
      { status: 500 },
    )
  }
}
