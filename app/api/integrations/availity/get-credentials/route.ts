import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { decrypt } from "@/lib/encryption";

export async function GET() {
  const { data, error } = await supabase
    .from("availity_integrations")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !data) {
    return NextResponse.json({ success: false, error: error?.message || "No credentials found" });
  }

  return NextResponse.json({
    success: true,
    data: {
      ...data,
      password: decrypt(data.password),
    },
  });
}
