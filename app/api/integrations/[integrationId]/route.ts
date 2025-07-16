// route.ts
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

const supabase = createClient()

export async function POST(
  req: NextRequest,
  { params }: { params: { integrationId: string } }
) {
  const id = params.integrationId

  if (!id) {
    return NextResponse.json({ success: false, error: "Missing integration id" }, { status: 400 })
  }

  // if using slug
  const { data, error } = await supabase
    .from("integrations")
    .update({ enabled: true })
    .eq("slug", id)
    .select()
    .single()

  if (error) {
    console.error("Failed to update integration:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, data })
}
