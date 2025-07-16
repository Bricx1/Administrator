import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import crypto from "crypto";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!;
const IV_LENGTH = 16;

function encrypt(text: string): string {
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

    console.log("🔄 Incoming config payload:", JSON.stringify(body, null, 2));

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

    console.log("🔐 Saving credentials:", { username, agency_id: clientId, environment });

    if (credError) {
      console.error("❌ Supabase Error: credentials", credError.message);
      throw new Error("Failed to save credentials: " + credError.message);
    }

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

    console.log("📦 Saving referral rules:", {
      accepted_insurance,
      minReimbursementRate,
      maxTravelDistance,
      requiredServices,
      excludedDiagnoses,
    });

    if (ruleError) {
      console.error("❌ Supabase Error: referral_rules", ruleError.message);
      throw new Error("Failed to save referral rules: " + ruleError.message);
    }

    // 3. Save sync controls
    const {
      autoEligibilityCheck,
      autoPriorAuth,
      realTimeUpdates,
      batchProcessing,
      notifyMSW,
      syncInterval,
    } = syncSettings;

    const { error: controlError } = await supabase.from("integration_sync_controls").upsert([
      {
        integration_id,
        auto_eligibility_check: autoEligibilityCheck,
        auto_prior_auth: autoPriorAuth,
        real_time_updates: realTimeUpdates,
        batch_processing: batchProcessing,
        notify_msw: notifyMSW,
        sync_interval: syncInterval,
        updated_at: now,
      },
    ]);

    console.log("⚙️ Saving sync controls:", {
      autoEligibilityCheck,
      autoPriorAuth,
      realTimeUpdates,
      batchProcessing,
      notifyMSW,
      syncInterval,
    });

    if (controlError) {
      console.error("❌ Supabase Error: sync_controls", controlError.message);
      throw new Error("Failed to save sync controls: " + controlError.message);
    }

    // 4. Save sync_settings (mock/fallback)
    const { data_types = ["referrals"], sync_frequency = "hourly" } = syncSettings;

    const { error: settingError } = await supabase.from("integration_sync_settings").upsert([
      {
        integration_id,
        data_types,
        sync_frequency,
        created_at: now,
        updated_at: now,
      },
    ]);

    console.log("📁 Saving sync_settings:", {
      data_types,
      sync_frequency,
    });

    if (settingError) {
      console.error("❌ Supabase Error: sync_settings", settingError.message);
      throw new Error("Failed to save sync settings: " + settingError.message);
    }

    // 5. Save initial metrics (optional)
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

    if (metricError) {
      console.error("❌ Supabase Error: metrics", metricError.message);
      throw new Error("Failed to save metrics: " + metricError.message);
    }

    return NextResponse.json({
      success: true,
      integration_id,
      message: "✅ Configuration saved to Supabase successfully",
    });
  } catch (error) {
    console.error("💥 ExtendedCare Setup Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
