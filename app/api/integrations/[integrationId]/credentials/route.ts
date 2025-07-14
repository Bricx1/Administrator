import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import crypto from 'crypto'

function encryptPassword(password: string) {
  const key = crypto
    .createHash('sha256')
    .update(process.env.CREDENTIAL_SECRET || 'secret')
    .digest()
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv('aes-256-ctr', key, iv)
  const encrypted = Buffer.concat([cipher.update(password, 'utf8'), cipher.final()])
  return { encrypted: encrypted.toString('hex'), iv: iv.toString('hex') }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { integrationId: string } },
) {
  try {
    const { username, password, agencyId, environment } = await request.json()
    if (!username || !password || !environment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    const { encrypted, iv } = encryptPassword(password)
    const { error } = await supabase.from('integration_credentials').upsert({
      integration_id: params.integrationId,
      username,
      password: encrypted,
      iv,
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
