import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const credentials = body.credentials;
    const syncSettings = body.syncSettings;

    if (
      !credentials?.username ||
      !credentials?.password ||
      !credentials?.agencyId ||
      !credentials?.environment ||
      !syncSettings?.frequency
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const payload = {
      user_id: "5f9684bb-9932-48b5-8803-ff8dcd4aab72", // Real UUID
      username: credentials.username,
      password_encrypted: credentials.password,
      agency_id: credentials.agencyId,
      environment: credentials.environment,
      sync_patients: syncSettings.patients,
      sync_orders: syncSettings.orders,
      sync_documents: syncSettings.documents,
      sync_physicians: syncSettings.physicians,
      sync_frequency: syncSettings.frequency,
      last_synced_at: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
  .from("axxess_integrations")
  .upsert([payload], { onConflict: 'user_id' });


    if (error) {
      console.error("❌ Supabase insert error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("❌ Unexpected server error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
