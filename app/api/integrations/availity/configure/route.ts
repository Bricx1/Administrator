import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { encrypt, decrypt } from "@/lib/encryption";

// POST – Save or update configuration
export async function POST(req: NextRequest) {
  try {
    const { credentials, syncSettings } = await req.json();

    if (!credentials) {
      return NextResponse.json({ success: false, error: "Credentials object is missing" }, { status: 400 });
    }

    const { username, password, organizationId, applicationId, environment } = credentials;

    const missingFields = [];
    if (!username) missingFields.push("username");
    if (!password) missingFields.push("password");
    if (!organizationId) missingFields.push("organizationId");
    if (!applicationId) missingFields.push("applicationId");
    if (!environment) missingFields.push("environment");

    if (missingFields.length > 0) {
      return NextResponse.json({ success: false, error: `Missing required fields: ${missingFields.join(", ")}` }, { status: 400 });
    }

    // Check if config exists
    const { data: existing } = await supabase
      .from("availity_integrations")
      .select("id")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    const configData = {
      username,
      password: encrypt(password),
      organization_id: organizationId,
      application_id: applicationId,
      environment,
      auto_eligibility: syncSettings?.autoEligibilityCheck ?? false,
      auto_prior_auth: syncSettings?.autoPriorAuth ?? false,
      enable_claims: syncSettings?.enableClaims ?? false,
      enable_remittance: syncSettings?.enableRemittance ?? false,
      sync_frequency: syncSettings?.syncFrequency || "manual",
      updated_at: new Date().toISOString(),
    };

    let result;
    if (existing) {
      result = await supabase
        .from("availity_integrations")
        .update(configData)
        .eq("id", existing.id)
        .select()
        .single();
    } else {
      result = await supabase
        .from("availity_integrations")
        .insert({ ...configData })
        .select()
        .single();
    }

    if (result.error) {
      return NextResponse.json({ success: false, error: result.error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: existing ? "Configuration updated" : "Configuration saved",
      data: result.data,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || "Unexpected error" }, { status: 500 });
  }
}

// GET – Retrieve latest config
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("availity_integrations")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return NextResponse.json({ success: false, error: error?.message || "No configuration found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        ...data,
        password: decrypt(data.password),
      },
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// PATCH – Update only sync settings
export async function PATCH(req: NextRequest) {
  try {
    const { syncSettings } = await req.json();

    if (!syncSettings) {
      return NextResponse.json({ success: false, error: "syncSettings object is required" }, { status: 400 });
    }

    const { data: existing } = await supabase
      .from("availity_integrations")
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!existing) {
      return NextResponse.json({ success: false, error: "No configuration found" }, { status: 404 });
    }

    const updateData = {
      auto_eligibility: syncSettings.autoEligibilityCheck ?? existing.auto_eligibility,
      auto_prior_auth: syncSettings.autoPriorAuth ?? existing.auto_prior_auth,
      enable_claims: syncSettings.enableClaims ?? existing.enable_claims,
      enable_remittance: syncSettings.enableRemittance ?? existing.enable_remittance,
      sync_frequency: syncSettings.syncFrequency ?? existing.sync_frequency,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("availity_integrations")
      .update(updateData)
      .eq("id", existing.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Sync settings updated",
      data,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// DELETE – Clear all configurations (if needed)
export async function DELETE() {
  try {
    const { error } = await supabase
      .from("availity_integrations")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Configuration deleted" });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
