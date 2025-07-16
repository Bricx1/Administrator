import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

interface MyTableRow {
  id: string
  name: string
  email: string
  created_at: string
}

export async function POST(request: NextRequest) {
  try {
    const { name, email } = await request.json()
    const { data, error } = await supabase
      .from<MyTableRow>("my_table")
      .insert({ name, email })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name, email } = await request.json()

    const { data, error } = await supabase
      .from<MyTableRow>("my_table")
      .update({ name, email })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data })
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body" }, { status: 400 })
  }
}
