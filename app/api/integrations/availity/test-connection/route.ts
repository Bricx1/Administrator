import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { decrypt } from "@/lib/encryption";

export async function POST(req: NextRequest) {
  try {
    const { testType, patient, payer } = await req.json();
    const startTime = Date.now();

    if (!testType) {
      return NextResponse.json({ success: false, error: "Missing test type" }, { status: 400 });
    }

    // 🔐 Get latest credentials from DB
    const { data: credentials, error: fetchError } = await supabase
      .from("availity_integrations")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .single();

    if (fetchError || !credentials) {
      return NextResponse.json({ success: false, error: "Credentials not found" }, { status: 404 });
    }

    const decryptedPassword = decrypt(credentials.password);

    // 🧪 Simulate actual eligibility/prior auth/claims check
    // In production, replace this with real API call to Availity
    await new Promise((res) => setTimeout(res, 900));

    const duration = ((Date.now() - startTime) / 1000).toFixed(1);

    // 📝 Log to test table
    const logResult = await supabase.from("availity_test_logs").insert({
      test_type: testType,
      status: "success",
      response_time: duration,
      message: "Test completed successfully",
      metadata: {
        used_credentials: {
          username: credentials.username,
          organization_id: credentials.organization_id,
          application_id: credentials.application_id,
        },
        test_patient: patient ?? {
          name: "Jane Test",
          dob: "1980-01-01",
          member_id: "TEST123456"
        },
        test_payer: payer ?? {
          payer_id: "12345",
          plan: "United Health Plan A"
        }
      }
    });

    if (logResult.error) {
      console.warn("Logging failed:", logResult.error.message);
    }

    return NextResponse.json({ success: true, duration });
  } catch (err) {
    console.error("Test error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
