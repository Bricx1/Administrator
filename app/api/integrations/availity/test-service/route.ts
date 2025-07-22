import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { testType } = await req.json();
    const start = Date.now();

    if (!testType) return NextResponse.json({ success: false, error: "Missing test type" }, { status: 400 });

    const { data: credentials, error } = await supabase.from("availity_integrations").select("*").single();
    if (error || !credentials) {
      return NextResponse.json({ success: false, error: "Credentials not found" }, { status: 404 });
    }

    // Simulate test (you can call real API here)
    await new Promise(res => setTimeout(res, 800));
    const duration = ((Date.now() - start) / 1000).toFixed(1);

    await supabase.from("availity_test_logs").insert({
      test_type: testType,
      status: "success",
      response_time: duration,
      message: "Service is available",
      metadata: {
        test_patient: {
          name: "Jane Doe",
          dob: "01/01/1980",
          member_id: "TEST123456"
        },
        test_payer: {
          payer_id: "12345",
          plan: "Test Plan A"
        }
      }
    });

    return NextResponse.json({ success: true, duration });
  } catch (err) {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
