import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { encrypt } from "@/lib/encryption";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
    successRate?: number;
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

// 💾 POST - Save configuration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("📨 Received payload:", JSON.stringify(body, null, 2));

    const {
      credentials,
      referralMetrics,
      syncSettings,
    } = body as Partial<ExtendedCareConfigureRequest>;

    // Validate required fields
    if (!credentials?.username || !credentials.password || !credentials.clientId || !credentials.clientSecret || !credentials.environment) {
      console.error("❌ Missing required credential fields");
      return NextResponse.json(
        { success: false, error: "Missing required credential fields" },
        { status: 400 }
      );
    }

    if (!referralMetrics) {
      console.error("❌ Missing referral metrics");
      return NextResponse.json(
        { success: false, error: "Missing referral metrics" },
        { status: 400 }
      );
    }

    if (!syncSettings) {
      console.error("❌ Missing sync settings");
      return NextResponse.json(
        { success: false, error: "Missing sync settings" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();
    
    // Generate agencyId from username if not provided
    const agencyId = credentials.agencyId || `agency_${credentials.username}`;

    console.log("🔐 Saving credentials...");
    // 🔐 Save credentials to extendedcare_credentials
    const { error: credError } = await supabase
      .from("extendedcare_credentials")
      .upsert({
        username: credentials.username,
        password: encrypt(credentials.password),
        agency_id: agencyId,
        client_id: credentials.clientId,
        client_secret: encrypt(credentials.clientSecret),
        environment: credentials.environment,
        created_at: now,
      });

    if (credError) {
      console.error("💥 Credential save error:", credError);
      return NextResponse.json(
        { success: false, error: `Failed to save credentials: ${credError.message}` },
        { status: 500 }
      );
    }

    console.log("📊 Saving referral metrics...");
    // 📊 Save referral metrics to extendedcare_referral_metrics
    const { error: refError } = await supabase
      .from("extendedcare_referral_metrics")
      .insert({
        accept_medicare: referralMetrics.acceptMedicare,
        accept_medicaid: referralMetrics.acceptMedicaid,
        accept_commercial: referralMetrics.acceptCommercial,
        accept_private_pay: referralMetrics.acceptPrivatePay || false,
        reimbursement_rate: referralMetrics.maxReimbursementRate,
        max_travel_distance: referralMetrics.maxTravelDistance,
        success_rate: referralMetrics.successRate || 0,
        required_services: referralMetrics.requiredServices,
        excluded_diagnosis: referralMetrics.excludedDiagnoses,
        created_at: now,
      });

    if (refError) {
      console.error("💥 Referral metrics save error:", refError);
      return NextResponse.json(
        { success: false, error: `Failed to save referral metrics: ${refError.message}` },
        { status: 500 }
      );
    }

    console.log("🔁 Saving sync settings...");
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
      console.error("💥 Sync settings save error:", syncError);
      return NextResponse.json(
        { success: false, error: `Failed to save sync settings: ${syncError.message}` },
        { status: 500 }
      );
    }

    console.log("✅ Configuration saved successfully!");
    return NextResponse.json({ 
      success: true, 
      id: syncData.id,
      agencyId: agencyId,
      message: "Configuration saved successfully" 
    });

  } catch (err) {
    console.error("💥 Server error:", err);
    return NextResponse.json(
      { success: false, error: `Server error: ${err instanceof Error ? err.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}

// 📥 GET - Retrieve saved configuration
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agencyId = searchParams.get('agencyId');
    const username = searchParams.get('username');

    if (!agencyId || !username) {
      return NextResponse.json(
        { success: false, error: "Agency ID and username are required" },
        { status: 400 }
      );
    }

    // Get credentials (excluding sensitive fields)
    const { data: credData, error: credError } = await supabase
      .from("extendedcare_credentials")
      .select("username, agency_id, client_id, environment, created_at")
      .eq("agency_id", agencyId)
      .eq("username", username)
      .single();

    if (credError) {
      return NextResponse.json(
        { success: false, error: "Configuration not found" },
        { status: 404 }
      );
    }

    // Get latest referral metrics
    const { data: refData, error: refError } = await supabase
      .from("extendedcare_referral_metrics")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (refError) {
      return NextResponse.json(
        { success: false, error: "Referral metrics not found" },
        { status: 404 }
      );
    }

    // Get latest sync settings
    const { data: syncData, error: syncError } = await supabase
      .from("extendedcare_sync_settings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (syncError) {
      return NextResponse.json(
        { success: false, error: "Sync settings not found" },
        { status: 404 }
      );
    }

    // Format response
    const response = {
      success: true,
      data: {
        credentials: {
          username: credData.username,
          agencyId: credData.agency_id,
          clientId: credData.client_id,
          environment: credData.environment,
        },
        referralMetrics: {
          acceptMedicare: refData.accept_medicare,
          acceptMedicaid: refData.accept_medicaid,
          acceptCommercial: refData.accept_commercial,
          acceptPrivatePay: refData.accept_private_pay,
          maxReimbursementRate: refData.reimbursement_rate,
          maxTravelDistance: refData.max_travel_distance,
          successRate: refData.success_rate,
          requiredServices: refData.required_services,
          excludedDiagnoses: refData.excluded_diagnosis,
        },
        syncSettings: {
          autoEligibilityCheck: syncData.auto_eligibility_check,
          autoPriorAuth: syncData.auto_prior_auth,
          realTimeUpdates: syncData.real_time_updates,
          batchProcessing: syncData.batch_processing,
          notifyErrors: syncData.notify_errors,
          syncInterval: syncData.sync_interval,
        },
        lastUpdated: credData.created_at,
      },
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error("💥 Server error:", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}

// 🔄 PUT - Update existing configuration
export async function PUT(request: NextRequest) {
  try {
    const {
      credentials,
      referralMetrics,
      syncSettings,
    } = (await request.json()) as Partial<ExtendedCareConfigureRequest>;

    if (!credentials?.username || !credentials.agencyId) {
      return NextResponse.json(
        { success: false, error: "Username and Agency ID are required for updates" },
        { status: 400 }
      );
    }

    const now = new Date().toISOString();

    // Update credentials if provided
    if (credentials.password || credentials.clientSecret) {
      const updateData: any = { created_at: now };
      
      if (credentials.password) updateData.password = encrypt(credentials.password);
      if (credentials.clientSecret) updateData.client_secret = encrypt(credentials.clientSecret);
      if (credentials.clientId) updateData.client_id = credentials.clientId;
      if (credentials.environment) updateData.environment = credentials.environment;

      const { error: credError } = await supabase
        .from("extendedcare_credentials")
        .update(updateData)
        .eq("username", credentials.username)
        .eq("agency_id", credentials.agencyId);

      if (credError) {
        return NextResponse.json(
          { success: false, error: "Failed to update credentials" },
          { status: 500 }
        );
      }
    }

    // Add new referral metrics if provided
    if (referralMetrics) {
      const { error: refError } = await supabase
        .from("extendedcare_referral_metrics")
        .insert({
          accept_medicare: referralMetrics.acceptMedicare,
          accept_medicaid: referralMetrics.acceptMedicaid,
          accept_commercial: referralMetrics.acceptCommercial,
          accept_private_pay: referralMetrics.acceptPrivatePay,
          reimbursement_rate: referralMetrics.maxReimbursementRate,
          max_travel_distance: referralMetrics.maxTravelDistance,
          success_rate: referralMetrics.successRate || 0,
          required_services: referralMetrics.requiredServices,
          excluded_diagnosis: referralMetrics.excludedDiagnoses,
          created_at: now,
        });

      if (refError) {
        return NextResponse.json(
          { success: false, error: "Failed to update referral metrics" },
          { status: 500 }
        );
      }
    }

    // Update sync settings if provided
    if (syncSettings) {
      const { error: syncError } = await supabase
        .from("extendedcare_sync_settings")
        .upsert({
          auto_eligibility_check: syncSettings.autoEligibilityCheck,
          auto_prior_auth: syncSettings.autoPriorAuth,
          real_time_updates: syncSettings.realTimeUpdates,
          batch_processing: syncSettings.batchProcessing,
          notify_errors: syncSettings.notifyErrors,
          sync_interval: syncSettings.syncInterval,
          created_at: now,
        });

      if (syncError) {
        return NextResponse.json(
          { success: false, error: "Failed to update sync settings" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ 
      success: true,
      message: "Configuration updated successfully" 
    });
  } catch (err) {
    console.error("💥 Server error:", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}

// 🗑️ DELETE - Remove configuration
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agencyId = searchParams.get('agencyId');
    const username = searchParams.get('username');

    if (!agencyId || !username) {
      return NextResponse.json(
        { success: false, error: "Agency ID and username are required" },
        { status: 400 }
      );
    }

    // Delete credentials
    const { error: credError } = await supabase
      .from("extendedcare_credentials")
      .delete()
      .eq("agency_id", agencyId)
      .eq("username", username);

    if (credError) {
      return NextResponse.json(
        { success: false, error: "Failed to delete credentials" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: "Configuration deleted successfully" 
    });
  } catch (err) {
    console.error("💥 Server error:", err);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}