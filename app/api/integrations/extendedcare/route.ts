import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import crypto from "crypto";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!;
const IV_LENGTH = 16;

interface SetupRequestBody {
  integration_id?: string;
  username: string;
  password: string;
  agency_id: string;
  environment: 'production' | 'staging' | 'development';
  accepted_insurance?: string[];
  min_reimbursement?: number;
  max_distance?: number;
  required_services?: string[];
  excluded_diagnoses?: string[];
  msw_notifications?: boolean;
  auto_eligibility_check?: boolean;
  auto_prior_auth?: boolean;
  real_time_updates?: boolean;
  sync_interval?: number;
  data_types?: string[];
  sync_frequency?: string;
}

function encrypt(text: string): string {
  if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 64) {
    throw new Error("❌ ENCRYPTION_KEY must be a 64-character hex string");
  }

  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY, "hex"), iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

function decrypt(encryptedText: string): string {
  if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 64) {
    throw new Error("❌ ENCRYPTION_KEY must be a 64-character hex string");
  }

  const [ivHex, encrypted] = encryptedText.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY, "hex"), iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

export async function POST(req: NextRequest) {
  try {
    const body: SetupRequestBody = await req.json();

    if (!body.username || !body.password || !body.agency_id || !body.environment) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const integration_id = body.integration_id || crypto.randomUUID();
    const now = new Date().toISOString();

    const [cred, rules, controls, settings, metrics] = await Promise.all([
      supabase.from("integration_credentials").upsert([{
        integration_id,
        username: body.username,
        password: encrypt(body.password),
        agency_id: body.agency_id,
        environment: body.environment,
        created_at: now,
        updated_at: now,
      }]),

      supabase.from("integration_referral_rules").upsert([{
        integration_id,
        accepted_insurance: body.accepted_insurance || [],
        min_reimbursement: body.min_reimbursement || 0,
        max_distance: body.max_distance || 50,
        required_services: body.required_services || [],
        excluded_diagnoses: body.excluded_diagnoses || [],
        msw_notifications: body.msw_notifications || false,
        created_at: now,
        updated_at: now,
      }]),

      supabase.from("integration_sync_controls").upsert([{
        integration_id,
        auto_eligibility_check: body.auto_eligibility_check || false,
        auto_prior_auth: body.auto_prior_auth || false,
        real_time_updates: body.real_time_updates || false,
        sync_interval: body.sync_interval || 60,
        created_at: now,
        updated_at: now,
      }]),

      supabase.from("integration_sync_settings").upsert([{
        integration_id,
        data_types: body.data_types || ['eligibility', 'referrals'],
        sync_frequency: body.sync_frequency || 'hourly',
        created_at: now,
        updated_at: now,
      }]),

      supabase.from("integration_metrics").upsert([{
        integration_id,
        api_calls_today: 0,
        uptime: 0,
        success_rate: 0,
        avg_response: 0,
        recent_activity: [{
          type: "setup",
          status: "success",
          user: body.username,
          environment: body.environment,
          time: now,
        }],
        created_at: now,
        updated_at: now,
      }]),
    ]);

    const errors = [
      { name: "credentials", error: cred.error },
      { name: "referral_rules", error: rules.error },
      { name: "sync_controls", error: controls.error },
      { name: "sync_settings", error: settings.error },
      { name: "metrics", error: metrics.error },
    ].filter(e => e.error);

    if (errors.length > 0) {
      return NextResponse.json({
        success: false,
        message: "❌ Failed to save configuration",
        errors: errors.map(e => `${e.name}: ${e.error?.message}`),
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "✅ ExtendedCare configuration saved",
      integration_id,
      data: {
        environment: body.environment,
        username: body.username,
        agency_id: body.agency_id,
      },
    });
  } catch (err) {
    console.error("💥 POST Error:", err);
    return NextResponse.json({
      success: false,
      message: err instanceof Error ? err.message : "Unknown error",
    }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const integration_id = searchParams.get('integration_id');

    if (!integration_id) {
      return NextResponse.json({ success: false, message: "Missing integration_id" }, { status: 400 });
    }

    const [cred, rules, controls, settings, metrics] = await Promise.all([
      supabase.from("integration_credentials").select("*").eq("integration_id", integration_id).single(),
      supabase.from("integration_referral_rules").select("*").eq("integration_id", integration_id).single(),
      supabase.from("integration_sync_controls").select("*").eq("integration_id", integration_id).single(),
      supabase.from("integration_sync_settings").select("*").eq("integration_id", integration_id).single(),
      supabase.from("integration_metrics").select("*").eq("integration_id", integration_id).single(),
    ]);

    if (cred.error) {
      return NextResponse.json({ success: false, message: "❌ Configuration not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        integration_id,
        credentials: {
          username: cred.data.username,
          agency_id: cred.data.agency_id,
          environment: cred.data.environment,
        },
        referral_rules: rules.data,
        sync_controls: controls.data,
        sync_settings: settings.data,
        metrics: metrics.data,
      }
    });
  } catch (err) {
    console.error("💥 GET Error:", err);
    return NextResponse.json({ success: false, message: "Failed to fetch configuration" }, { status: 500 });
  }
}
