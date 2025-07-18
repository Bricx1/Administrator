import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!;
const IV_LENGTH = 16;

function encrypt(text: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY, "hex"), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

function clean(obj: Record<string, any>) {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== null && v !== undefined));
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("🟠 Full incoming body:", body);

    const { credentials, referralMetrics, syncSettings } = body;
    const now = new Date().toISOString();

    // 🔐 Save to extendedcare_credentials
    if (credentials) {
      const {
        username,
        password,
        agency_id,
        client_id,
        client_secret,
        environment
      } = credentials;

      if (!username || !password || !agency_id || !client_id || !client_secret || !environment) {
        return NextResponse.json({ success: false, message: "Missing credential fields" }, { status: 400 });
      }

      const credPayload = clean({
        id: uuidv4(),
        username,
        password: encrypt(password),
        client_id,
        client_secret: encrypt(client_secret),
        agency_id,
        environment,
        created_at: now,
      });

      const { error } = await supabase.from("extendedcare_credentials").upsert(credPayload);
      if (error) throw error;
    }

    // 📊 Save to extendedcare_referral_metrics
    if (referralMetrics) {
      const refPayload = clean({
        id: uuidv4(),
        accept_medicare: referralMetrics.acceptMedicare,
        accept_medicaid: referralMetrics.acceptMedicaid,
        accept_commercial: referralMetrics.acceptCommercial,
        accept_private_pay: referralMetrics.acceptPrivatePay,
        reimbursement_rate: referralMetrics.maxReimbursementRate,
        max_travel_distance: referralMetrics.maxTravelDistance,
        success_rate: referralMetrics.successRate,
        required_services: referralMetrics.requiredServices,
        excluded_diagnosis: referralMetrics.excludedDiagnoses,
        created_at: now,
      });

      const { error } = await supabase.from("extendedcare_referral_metrics").insert(refPayload);
      if (error) throw error;
    }

    // 🔁 Save to extendedcare_sync_settings
    if (syncSettings) {
      const syncPayload = clean({
        id: uuidv4(),
        auto_eligibility_check: syncSettings.autoEligibilityCheck,
        auto_prior_auth: syncSettings.autoPriorAuth,
        real_time_updates: syncSettings.realTimeUpdates,
        batch_processing: syncSettings.batchProcessing,
        notify_errors: syncSettings.notifyErrors,
        sync_interval: syncSettings.syncInterval,
        created_at: now,
      });

      const { error } = await supabase.from("extendedcare_sync_settings").insert(syncPayload);
      if (error) throw error;
    }

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("🔥 Supabase Save Error:", err);
    return NextResponse.json({ success: false, message: "Internal server error", error: err }, { status: 500 });
  }
}
