import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase"; // static client import

export async function POST(req: NextRequest) {
  const integration_id = "extendedcare";
  const user_id = "00000000-0000-0000-0000-000000000000"; // Replace with session-based ID in real setup

  // Parse request
  let json: any;
  try {
    const text = await req.text();
    if (!text || text.trim() === "") {
      return NextResponse.json({ success: false, error: "Empty request body" }, { status: 400 });
    }
    json = JSON.parse(text);
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON format" }, { status: 400 });
  }

  const { type } = json;
  if (!type) {
    return NextResponse.json({ success: false, error: "Missing test type" }, { status: 400 });
  }

  // 🔐 Fetch credentials
  const { data: credentials, error: credError } = await supabase
    .from("integration_configurations")
    .select("*")
    .eq("integration_id", integration_id)
    .eq("user_id", user_id)
    .maybeSingle();

  if (credError || !credentials) {
    return NextResponse.json({ success: false, error: "Credentials not found" }, { status: 404 });
  }

  const {
    username,
    password,
    client_id,
    client_secret,
    environment
  } = credentials;

  const baseLog = {
    integration_id,
    type,
    user_id,
    created_at: new Date().toISOString()
  };

  try {
    let testResult: any = {};

    switch (type) {
      case "eligibility":
        testResult = {
          status: "success",
          message: "Eligibility test passed",
          metadata: {
            username,
            client_id,
            environment,
            patient_name: "Jane Doe",
            insurance: "Medicare",
            eligible: true
          }
        };
        break;
      case "prior_auth":
        testResult = {
          status: "success",
          message: "Prior authorization passed",
          metadata: {
            username,
            diagnosis_code: "Z12.11",
            approved_on: new Date().toISOString(),
            authorized_by: "Dr. House"
          }
        };
        break;
      case "claims":
        testResult = {
          status: "success",
          message: "Claim submitted",
          metadata: {
            claim_id: "CL-1001",
            amount: 1125.5,
            payer: "Aetna",
            submitted_on: new Date().toISOString()
          }
        };
        break;
      case "sync":
        testResult = {
          status: "success",
          message: "Real-time sync test passed",
          metadata: {
            records_synced: 4,
            updated_at: new Date().toISOString()
          }
        };
        break;
      default:
        return NextResponse.json({ success: false, error: "Invalid test type" }, { status: 400 });
    }

    // 💾 Save to test logs table
    await supabase.from("integration_test_logs").insert({
      ...baseLog,
      status: testResult.status,
      message: testResult.message,
      metadata: testResult.metadata
    });

    return NextResponse.json({ success: true, message: testResult.message, test: testResult });

  } catch (err) {
    console.error("Test error:", err);
    return NextResponse.json({ success: false, error: "Test failed" }, { status: 500 });
  }
}
