import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import crypto from "crypto";

// 🔐 Encryption Setup
function encrypt(text: string): string {
  const keyRaw = process.env.ENCRYPTION_KEY;

  if (!keyRaw) {
    throw new Error("ENCRYPTION_KEY is missing from environment variables");
  }

  // Detect format: hex or utf8
  let key: Buffer;
  try {
    key = keyRaw.length === 64 ? Buffer.from(keyRaw, "hex") : Buffer.from(keyRaw, "utf8");
  } catch (err) {
    throw new Error("Failed to parse ENCRYPTION_KEY");
  }

  if (key.length !== 32) {
    throw new Error(`Invalid ENCRYPTION_KEY length: expected 32 bytes, got ${key.length}`);
  }

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  return iv.toString("hex") + ":" + encrypted;
}


// ✅ TEST CONNECTION
export async function POST(req: NextRequest) {
  try {
    const { username, password, agencyId, environment } = await req.json();

    if (!username || !password || !agencyId) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    // Simulated Axxess API check
    if (!username.includes("@") || password.length < 8) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      message: "Connection successful",
      agencyInfo: {
        name: "Mock Axxess Agency",
        id: agencyId,
        environment,
      },
    });
  } catch (err) {
    console.error("POST /test-connection error:", err);
    return NextResponse.json({ error: "Server error during connection test" }, { status: 500 });
  }
}

// ✅ SAVE TO SUPABASE
export async function PUT(req: NextRequest) {
  try {
    const {
      user_id,
      username,
      password,
      agencyId,
      environment = "production",
      syncSettings = {},
    } = await req.json();

    if (!username || !password || !agencyId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const encryptedPassword = encrypt(password);

    const { error } = await supabase.from("axxess_integrations").upsert({
      user_id: user_id ?? null,
      username,
      password_encrypted: encryptedPassword,
      agency_id: agencyId,
      environment,
      sync_patients: syncSettings.patients || false,
      sync_orders: syncSettings.orders || false,
      sync_documents: syncSettings.documents || false,
      sync_physicians: syncSettings.physicians || false,
      sync_frequency: syncSettings.frequency || "daily",
      connected: true,
      connected_at: new Date().toISOString(),
      last_sync_at: null,
      sync_status: "idle",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Supabase upsert error:", error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Integration saved successfully." });
  } catch (err) {
    console.error("PUT /test-connection error:", err);
    return NextResponse.json({ error: "Server error during integration save" }, { status: 500 });
  }
}
