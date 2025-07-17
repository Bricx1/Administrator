import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const url = req.nextUrl.pathname;
  const body = await req.json();

  if (url.endsWith("/configure") || url.endsWith("/test-connection")) {
    const {
      username,
      password,
      organizationId,
      applicationId,
      environment,
      syncSettings = {}
    } = body;

    const user_id = "mock-user-id";

    // ✅ Strict whitelist for sync_frequency
    const rawFreq = String(syncSettings.syncFrequency || "").toLowerCase().trim();
    const frequency = ["manual", "hourly", "daily"].includes(rawFreq) ? rawFreq : "manual";

    // ✅ Only allowed fields are passed to the DB
    const payload = {
      user_id,
      username,
      password_encrypted: password,
      organization_id: organizationId,
      application_id: applicationId,
      environment,
      sync_patients: !!syncSettings.syncPatients,
      sync_orders: !!syncSettings.syncOrders,
      sync_documents: !!syncSettings.syncDocuments,
      sync_physicians: !!syncSettings.syncPhysicians,
      sync_frequency: frequency,
      updated_at: new Date().toISOString()
    };

    // 🧼 DEBUG LOG: confirm what’s being sent to Supabase
    console.log("📤 Final Supabase payload:", payload);

    const { error } = await supabase
      .from("axxess_integrations")
      .upsert(payload, { onConflict: "user_id" });

    if (error) {
      console.error("❌ Supabase upsert error:", error);
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false, message: "Invalid route" }, { status: 404 });
}
