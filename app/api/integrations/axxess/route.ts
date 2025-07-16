// app/api/integrations/axxess/route.ts
import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"
import crypto from 'crypto'

// Simple encryption function (you should use a proper encryption library in production)
function encrypt(text: string): string {
  const algorithm = 'aes-256-cbc'
  const key = crypto.scryptSync(process.env.ENCRYPTION_KEY || 'default-key', 'salt', 32)
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv(algorithm, key, iv)
  
  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  
  return iv.toString('hex') + ':' + encrypted
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('🟡 Received request:', { 
      hasCredentials: !!body.credentials,
      hasSyncSettings: !!body.syncSettings 
    })

    const { credentials, syncSettings } = body

    // Validate required fields
    if (
      !credentials?.username ||
      !credentials?.password ||
      !credentials?.agencyId ||
      !credentials?.user_id ||
      !syncSettings?.frequency
    ) {
      console.warn('⚠️ Missing required fields')
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Prepare payload for database
    const payload = {
      user_id: credentials.user_id,
      username: credentials.username,
      password_encrypted: encrypt(credentials.password),
      agency_id: credentials.agencyId,
      environment: credentials.environment || 'production',
      sync_patients: syncSettings.patients ?? true,
      sync_orders: syncSettings.orders ?? true,
      sync_documents: syncSettings.documents ?? true,
      sync_physicians: syncSettings.physicians ?? true,
      sync_frequency: syncSettings.frequency,
      connected: true,
      connected_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    console.log('📝 Attempting to insert into Supabase:', {
      ...payload,
      password_encrypted: '[ENCRYPTED]'
    })

    // Insert into Supabase
    const { data, error } = await supabaseAdmin
      .from('axxess_integrations')
      .upsert(payload, { 
        onConflict: 'user_id',
        ignoreDuplicates: false 
      })
      .select('*')

    if (error) {
      console.error('❌ Supabase error:', error)
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    console.log('✅ Successfully saved integration:', data)
    return NextResponse.json({ success: true, data })

  } catch (err: any) {
    console.error('❌ Unexpected server error:', err)
    return NextResponse.json(
      { success: false, error: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}