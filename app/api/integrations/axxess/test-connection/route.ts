import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

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
      agencyId,               // ✅ extract agencyId
      organizationId,
      applicationId,
      environment,
      syncSettings = {}
    } = body;

    const rawFreq = String(syncSettings.syncFrequency || "").toLowerCase().trim();
    const frequency = ["manual", "hourly", "daily"].includes(rawFreq) ? rawFreq : "manual";

    const user_id = "3195fd90-fef3-4a0c-9c1a-da1374e4fc8b"; // or use real user UUID

    const payload = {
      user_id,
      username,
      password_encrypted: password,
      agency_id: agencyId,                 // ✅ added this line
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

    const { error } = await supabase
      .from("axxess_integrations")
      .upsert(payload, { onConflict: "user_id" });

    if (error) {
      console.error("Supabase upsert error:", error);
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false, message: "Invalid route" }, { status: 404 });
}
