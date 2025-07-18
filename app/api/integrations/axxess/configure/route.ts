 import { type NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { encrypt } from "@/lib/encryption";

interface ExtendedCareConfigureRequest {
  credentials: {
    username: string;
    password: string;
    agencyId: string;
    clientId: string;
    clientSecret: string;
    environment: string;
  };
  referralMetrics: {
    acceptMedicare: boolean;
    acceptMedicaid: boolean;
    acceptCommercial: boolean;
    acceptPrivatePay: boolean;
    maxReimbursementRate: number;
    maxTravelDistance: number;
    successRate: number;
    requiredServices: string[];
    excludedDiagnoses: string[];
  };
  syncSettings: {
    autoEligibilityCheck: boolean;
    autoPriorAuth: boolean;
    realTimeUpdates: boolean;
    batchProcessing: boolean;
    notifyErrors: boolean;
    syncInterval: number;
  };
}

export async function POST(request: NextRequest) {
  try {
    const {
      credentials,
      referralMetrics,
      syncSettings,
    } = (await request.json()) as Partial<ExtendedCareConfigureRequest>;

    // ✅ Validate input
    if (
      !credentials?.username ||
      !credentials.password ||
      !credentials.agencyId ||
      !credentials.clientId ||
      !credentials.clientSecret ||
      !credentials.environment ||
      !referralMetrics ||
      !syncSettings
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    // 🔐 Save credentials to extendedcare_credentials
    const { error: credError } = await supabase
      .from("extendedcare_credentials")
      .upsert({
        username: credentials.username,
        password: encrypt(credentials.password),
        agency_id: credentials.agencyId,
        client_id: credentials.clientId,
        client_secret: encrypt(credentials.clientSecret),
        environment: credentials.environment,
        created_at: now,
      });

    if (credError) {
      await logIntegrationError(credError, { stage: "credentials" });
      return NextResponse.json(
        { success: false, error: "Failed to save credentials" },
        { status: 500 }
      );
    }

    // 📊 Save referral metrics to extendedcare_referral_metrics
    const { error: refError } = await supabase
      .from("extendedcare_referral_metrics")
      .insert({
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

    if (refError) {
      await logIntegrationError(refError, { stage: "referralMetrics" });
      return NextResponse.json(
        { success: false, error: "Failed to save referral metrics" },
        { status: 500 }
      );
    }

    // 🔁 Save sync settings to extendedcare_sync_settings
    const { data: syncData, error: syncError } = await supabase
      .from("extendedcare_sync_settings")
      .upsert({
        auto_eligibility_check: syncSettings.autoEligibilityCheck,
        auto_prior_auth: syncSettings.autoPriorAuth,
        real_time_updates: syncSettings.realTimeUpdates,
        batch_processing: syncSettings.batchProcessing,
        notify_errors: syncSettings.notifyErrors,
        sync_interval: syncSettings.syncInterval,
        created_at: now,
      })
      .select("id")
      .single();

    if (syncError) {
      await logIntegrationError(syncError, { stage: "syncSettings" });
      return NextResponse.json(
        { success: false, error: "Failed to save sync settings" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: syncData.id });
  } catch (err) {
    await logIntegrationError(err, { stage: "server" });
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}

// 📄 Unified error logging
async function logIntegrationError(error: unknown, context?: Record<string, any>) {
  try {
    console.error("ExtendedCare integration error:", error, context);
  } catch (logErr) {
    console.error("Failed to log integration error:", logErr);
  }
}