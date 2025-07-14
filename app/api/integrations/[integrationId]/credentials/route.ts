import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { encrypt } from '@/lib/encryption'

export async function POST(
  request: NextRequest,
  { params }: { params: { integrationId: string } },
) {
  try {
    const { username, password, agencyId, environment } = await request.json()
    const encryptedPassword = password ? encrypt(password) : null

    const { error } = await supabase.from('integration_credentials').upsert({
      integration_id: params.integrationId,
      username,
      password: encryptedPassword,
      agency_id: agencyId,
      environment,
      updated_at: new Date().toISOString(),
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: 'Failed to save credentials' },
      { status: 500 },
    )
  }
}
