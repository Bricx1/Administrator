import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(req: NextRequest) {
  try {
    const { agencyId } = await req.json()

    // Example: Fetch patients for this agency
    const { data, error } = await supabase
      .from("patients")
      .select("*")
      .eq("agency_id", agencyId)

    if (error) {
      console.error("Supabase fetch error:", error)
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (err) {
    console.error("Server error:", err)
    return NextResponse.json({ success: false, error: "Unexpected error" }, { status: 500 })
  }
}
