import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from '@/lib/supabase/server'

interface ToggleRequest {
  integrationId: string
  isEnabled: boolean
}

export async function POST(request: NextRequest) {
  try {
    const { integrationId, isEnabled } = (await request.json()) as Partial<ToggleRequest>

    if (!integrationId || typeof isEnabled !== "boolean") {
      return NextResponse.json(
        { success: false, error: "Invalid payload" },
        { status: 400 },
      )
    }

    const updates = isEnabled
      ? { connected: true, connected_at: new Date().toISOString() }
      : { connected: false, connected_at: null }

    const { error } = await supabaseAdmin
      .from("axxess_integrations")
      .update(updates)
      .eq("id", integrationId)
      .select("id")
      .single()

    if (error) {
      await logIntegrationError(error, { stage: "toggle" })
      return NextResponse.json(
        { success: false, error: "Database update failed" },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    await logIntegrationError(err, { stage: "toggle" })
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
