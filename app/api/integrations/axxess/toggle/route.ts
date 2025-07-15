import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

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

    const { error } = await supabase
      .from("axxess_integrations")
      .update(updates)
      .eq("id", integrationId)

    if (error) {
      console.error("Axxess toggle update error:", error)
      return NextResponse.json(
        { success: false, error: "Database update failed" },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("Axxess toggle route error:", err)
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 })
  }
}
