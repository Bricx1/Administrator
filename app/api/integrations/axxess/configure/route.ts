import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Optional type safety
interface AxxessIntegration {
  id: string;
  username: string;
  password: string;
  agency_id: string;
  environment: string;
  sync_settings?: any;
  created_at?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password, agencyId, environment, syncSettings } = body;

    if (!username || !password || !agencyId) {
      return NextResponse.json(
        { success: false, error: "Missing required credentials" },
        { status: 400 }
      );
    }

 const { data, error } = await supabase
  .from<AxxessIntegration, AxxessIntegration>("axxess_integrations")
  .insert([
    {
      username,
      password,
      agency_id: agencyId,
      environment,
      sync_settings: syncSettings || null,
    },
  ])
  .select(); // so we can use data?.[0]?.id


    if (error) {
      console.error("❌ Supabase insert error:", error);
      return NextResponse.json({ success: false, error: "Database insert failed" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "✅ Integration saved to Supabase",
      id: data?.[0]?.id ?? null,
    });
  } catch (error) {
    console.error("❌ Server error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
