import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Setup Supabase admin client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { username, password, environment } = await req.json();

    // Simulate test connection
    await new Promise((r) => setTimeout(r, 1000));

    if (!username || !password) {
      return NextResponse.json({ success: false, message: "Missing credentials" }, { status: 400 });
    }

    const apiVersion = "v2.1";
    const services = {
      eligibility: "available",
      priorAuth: "available",
      billing: "available",
    };

    // Save to Supabase
    const { error } = await supabase.from("extendedcare_test_connections").insert([
      {
        api_version: apiVersion,
        eligibility_status: services.eligibility,
        prior_auth_status: services.priorAuth,
        billing_status: services.billing,
      },
    ]);

    if (error) {
      console.error("❌ Supabase Insert Error:", error);
      return NextResponse.json({ success: false, message: "Database error" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Connection successful",
      apiVersion,
      services,
    });
  } catch (err) {
    console.error("❌ Connection Test Error:", err);
    return NextResponse.json({ success: false, message: "Unexpected error" }, { status: 500 });
  }
}
