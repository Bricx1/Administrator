import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export const dynamic = "force-dynamic" // ✅ Required to avoid static optimization

export async function POST(
  req: NextRequest,
  context: { params: Record<string, string> }
) {
  const integrationId = context.params?.integrationId

  if (!integrationId) {
    return NextResponse.json(
      { success: false, error: "Missing integrationId" },
      { status: 400 }
    )
  }

  try {
    const { enabled } = await req.json()

    if (typeof enabled !== "boolean") {
      return NextResponse.json(
        { success: false, error: "Missing or invalid 'enabled'" },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from("integrations")
      .update({
        enabled,
        status: enabled ? "connected" : "disconnected",
        updated_at: new Date().toISOString(),
      })
      .eq("slug", integrationId) // change to .eq("id", integrationId) if using UUID instead of slug
      .select()
      .single()

   if (error || !data) {
  return NextResponse.json(
    { success: false, error: error?.message ?? "Update failed" },
    { status: 500 }
  )
}


    return NextResponse.json({
      success: true,
      enabled: data.enabled,
      status: data.status,
    })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Unexpected error" },
      { status: 500 }
    )
  }
}
