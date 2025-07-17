import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";

const clean = (obj: Record<string, any>) =>
  Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== null && v !== undefined));

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const {
      username,
      password,
      agency_id,
      environment,
      syncSettings,
      referralRules,
      integrationName,     // NEW: integration display name
      type = "extendedcare", // optional: type/category
      category = "referral"  // optional: category
    } = data;

    if (!username || !password || !agency_id || !environment || !syncSettings || !referralRules) {
      return NextResponse.json({ success: false, message: "Missing required fields." }, { status: 400 });
    }

    const integration_id = uuidv4();
    const timestamp = new Date().toISOString();

    // ✅ Insert into integrations (main)
    const integrationMain = clean({
      id: integration_id,
      name: integrationName || "ExtendedCare Integration",
      type,
      category,
      status: true,
      created_at: timestamp,
      updated_at: timestamp
    });

    const { error: mainError } = await supabase.from("integrations_credentials").insert(integrationMain);
    if (mainError) throw mainError;

    // ✅ Insert into credentials
    const credentialsPayload = clean({
      id: uuidv4(),
      integration_id,
      username: username.trim(),
      password,
      agency_id: agency_id.trim(),
      environment: environment.trim(),
      created_at: timestamp,
      updated_at: timestamp
    });

    const { error: credError } = await supabase.from("integration_credentials").insert(credentialsPayload);
    if (credError) throw credError;

    // ✅ Insert into sync controls
    const syncControlsPayload = clean({
      id: uuidv4(),
      integration_id,
      auto_eligibility_check: syncSettings.autoEligibilityCheck,
      auto_prior_auth: syncSettings.autoPriorAuth,
      real_time_updates: syncSettings.realTimeUpdates,
      batch_processing: syncSettings.batchProcessing,
      sync_interval: syncSettings.syncInterval,
      created_at: timestamp,
      updated_at: timestamp
    });

    const { error: syncError } = await supabase.from("integration_sync_controls").insert(syncControlsPayload);
    if (syncError) throw syncError;

    // ✅ Insert into referral rules
    const referralRulesPayload = clean({
      id: uuidv4(),
      integration_id,
      accepted_insurance: referralRules.acceptedInsurance || [],
      min_reimbursement: referralRules.minReimbursement || 0,
      max_distance: referralRules.maxDistance || 0,
      required_services: referralRules.requiredServices || [],
      excluded_diagnoses: referralRules.excludedDiagnoses
        ?.split(",")
        .map((s: string) => s.trim()) || [],
      msw_notifications: referralRules.mswNotifications || [],
      created_at: timestamp,
      updated_at: timestamp
    });

    const { error: referralError } = await supabase.from("integration_referral_rules").insert(referralRulesPayload);
    if (referralError) throw referralError;

    return NextResponse.json({ success: true, integration_id }, { status: 200 });

  } catch (error: any) {
    console.error("Integration error:", error.message);
    return NextResponse.json(
      { success: false, message: "Integration failed", error: error.message },
      { status: 500 }
    );
  }
}
