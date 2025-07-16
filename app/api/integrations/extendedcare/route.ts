import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

const supabase = createClient()

export async function POST(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname.endsWith("/test-connection")) {
    return handleTestConnection(req)
  }

  if (pathname.endsWith("/configure")) {
    return handleSaveConfiguration(req)
  }

  return NextResponse.json({ error: "Invalid endpoint" }, { status: 404 })
}

async function handleTestConnection(req: NextRequest) {
  try {
    const body = await req.json()
    const { username, password, clientId, clientSecret, environment } = body

    if (!username || !password || !clientId || !clientSecret) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Simulate success criteria (replace with real API logic)
    const isConnected = username && password.length >= 6

    return NextResponse.json({ success: isConnected })
  } catch (error) {
    console.error("Connection test error:", error)
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    )
  }
}

async function handleSaveConfiguration(req: NextRequest) {
  try {
    const body = await req.json()
    const { credentials, syncSettings, referralMetrics } = body

    if (!credentials?.clientId) {
      return NextResponse.json(
        { success: false, error: "Missing clientId in credentials" },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("extendedcare_config")
      .upsert(
        {
          client_id: credentials.clientId,
          credentials,
          sync_settings: syncSettings,
          referral_metrics: referralMetrics,
        },
        { onConflict: "client_id" }
      )
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("Save configuration error:", error)
    return NextResponse.json(
      { success: false, error: "Failed to save configuration" },
      { status: 500 }
    )
  }
}
