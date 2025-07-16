import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import crypto from "crypto";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!;
const IV_LENGTH = 16;

function encrypt(text: string): string {
  if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
    throw new Error("❌ ENCRYPTION_KEY must be exactly 32 characters");
  }

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY, "utf8"), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const integration_id = crypto.randomUUID();
    const now = new Date().toISOString();

    const { credentials, referralMetrics, syncSettings } = body;

    // 1. Save credentials
    const { username, password, clientId, clientSecret, environment } = credentials;

    const { error: credError } = await supabase.from("integration_credentials").upsert([
      {
        integration_id,
        username,
        password: encrypt(password),
        agency_id: clientId,
        environment,
        updated_at: now,
      },
    ]);

    if (credError) throw new Error("❌ Failed to save credentials: " + credError.message);

    // 2. Save referral rules
    const {
      acceptMedicare,
      acceptMedicaid,
      acceptCommercial,
      acceptManagedCare,
      minReimbursementRate,
      maxTravelDistance,
      requiredServices,
      excludedDiagnoses,
    } = referralMetrics;

    const accepted_insurance = [
      acceptMedicare && "medicare",
      acceptMedicaid && "medicaid",
      acceptCommercial && "commercial",
      acceptManagedCare && "managed_care",
    ].filter(Boolean);

    const { error: ruleError } = await supabase.from("integration_referral_rules").upsert([
      {
        integration_id,
        accepted_insurance,
        min_reimbursement: parseFloat(minReimbursementRate),
        max_distance: parseFloat(maxTravelDistance),
        required_services: requiredServices,
        excluded_diagnoses: excludedDiagnoses,
        msw_notifications: [
          "insurance_denials",
          "prior_auth",
          "low_reimbursement",
          "complex_cases",
          "eligibility_issues",
          "geographic_restrictions",
          "service_limitations",
          "summary_reports",
        ],
        updated_at: now,
      },
    ]);

    if (ruleError) throw new Error("❌ Failed to save referral rules: " + ruleError.message);

    // 3. Save sync controls
    const {
      autoEligibilityCheck,
      autoPriorAuth,
      realTimeUpdates,
      notifyMSW,
      syncInterval,
    } = syncSettings;

   const { error: controlError } = await supabase.from("integration_sync_controls").upsert([
  {
    integration_id,
    auto_eligibility_check: autoEligibilityCheck,
    auto_prior_auth: autoPriorAuth,
    real_time_updates: realTimeUpdates,
    sync_interval: syncInterval,
    updated_at: now,
  },
]);


    

    // 4. Save sync settings
    const { data_types = ["referrals"], sync_frequency = "hourly" } = syncSettings ?? {};

    const { error: settingError } = await supabase.from("integration_sync_settings").upsert([
      {
        integration_id,
        data_types,
        sync_frequency,
        created_at: now,
        updated_at: now,
      },
    ]);

    if (settingError) throw new Error("❌ Failed to save sync settings: " + settingError.message);

    // 5. Save initial metrics
    const { error: metricError } = await supabase.from("integration_metrics").upsert([
      {
        integration_id,
        api_calls_today: 0,
        uptime: 99.2,
        success_rate: 98.5,
        avg_response: 1.2,
        recent_activity: [
          {
            type: "eligibility",
            status: "success",
            user: username,
            time: now,
          },
        ],
        updated_at: now,
      },
    ]);

    if (metricError) throw new Error("❌ Failed to save metrics: " + metricError.message);

    return NextResponse.json({
      success: true,
      integration_id,
      message: "✅ Configuration saved to Supabase successfully",
    });
  } catch (error) {
    console.error("💥 POST Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
