"use server";

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

// 🔐 ENCRYPTION SETUP
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
    console.log("📩 Incoming combined config body:", body);

    const integration_id = uuidv4();

    // 🔐 Save credentials
    if (body.credentials) {
      const {
        username,
        password,
        agencyId,
        environment,
        clientId,
        clientSecret,
      } = body.credentials;

      const payload = clean({
        id: integration_id,
        username,
        password: encrypt(password),
        client_id: clientId,
        client_secret: encrypt(clientSecret),
        agency_id: agencyId,
        environment,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      const { error } = await supabase.from("integration_credentials").upsert(payload);
      if (error) throw error;
    }

    // 🔄 Save sync_controls
    if (body.syncSettings) {
      const {
        autoEligibilityCheck,
        autoPriorAuth,
        realTimeUpdates,
        syncInterval,
        batchProcessing,
        notifyMSW,
      } = body.syncSettings;

      const payload = clean({
        id: uuidv4(),
        integration_id,
        auto_eligibility_check: autoEligibilityCheck,
        auto_prior_auth: autoPriorAuth,
        real_time_updates: realTimeUpdates,
        sync_interval: syncInterval,
        batch_processing: batchProcessing,
        notify_msw: notifyMSW,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      const { error } = await supabase.from("integration_sync_controls").insert(payload);
      if (error) throw error;
    }

    // 📊 Save metrics
    if (body.metrics) {
      const {
        api_calls_today,
        uptime,
        success_rate,
        avg_response_time,
        recent_activity,
      } = body.metrics;

      const payload = clean({
        id: uuidv4(),
        integration_id,
        api_calls_today,
        uptime,
        success_rate,
        avg_response_time,
        recent_activity,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      const { error } = await supabase.from("integration_metrics").insert(payload);
      if (error) throw error;
    }

    // 📋 Save referral_rules
    if (body.referralMetrics) {
      const {
        acceptMedicare,
        acceptMedicaid,
        acceptCommercial,
        acceptPrivatePay,
        reimbursementRate,
        minReferralRate,
        maxTravelDistance,
        requiredServices,
        excludedDiagnoses,
      } = body.referralMetrics;

      const payload = clean({
        id: uuidv4(),
        integration_id,
        accepted_insurance: {
          medicare: acceptMedicare,
          medicaid: acceptMedicaid,
          commercial: acceptCommercial,
          private_pay: acceptPrivatePay,
        },
        reimbursement_rate: reimbursementRate,
        min_referral_rate: minReferralRate,
        travel_distance: maxTravelDistance,
        required_services: requiredServices,
        excluded_diagnosis: excludedDiagnoses,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

      const { error } = await supabase.from("integration_referral_rules").insert(payload);
      if (error) throw error;
    }

    return NextResponse.json({ success: true, integration_id });

  } catch (err) {
    console.error("🔥 Server Error:", err);
    return NextResponse.json({ success: false, message: "Internal server error", error: err }, { status: 500 });
  }
}
