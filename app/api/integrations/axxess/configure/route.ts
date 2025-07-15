import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from '@/lib/supabase'
import { encrypt } from "@/lib/encryption"

interface ConfigureRequest {
  credentials: {
    username: string
    password: string
    agencyId: string
    environment?: string
  }
  syncSettings: {
    frequency: string
    dataTypes?: string[]
  }
}

export async function POST(request: NextRequest) {
  try {
    const { credentials, syncSettings } = (await request.json()) as Partial<ConfigureRequest>

    if (
      !credentials?.username ||
      !credentials.password ||
      !credentials.agencyId ||
      !syncSettings?.frequency
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      )
    }

    const { data, error } = await supabaseAdmin
      .from("axxess_integrations")
      .upsert({
        username: credentials.username,
        password: encrypt(credentials.password),
        agency_id: credentials.agencyId,
        environment: credentials.environment,
        sync_frequency: syncSettings.frequency,
        data_types: syncSettings.dataTypes ?? null,
        connected: true,
        connected_at: new Date().toISOString(),
      })
      .select("id")
      .single()

    if (error) {
      await logIntegrationError(error, { stage: "database" })
      return NextResponse.json(
        { success: false, error: "Failed to save configuration" },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (err) {
    await logIntegrationError(err, { stage: "server" })
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 })
  }
}

async function logIntegrationError(error: unknown, context?: Record<string, any>) {
  try {
    console.error("Axxess integration error:", error, context)
  } catch (logErr) {
    console.error("Failed to log integration error:", logErr)
  }
}
