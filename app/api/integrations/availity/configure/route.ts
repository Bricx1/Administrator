import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

// -- ENV --
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!

// -- Validate encryption key length --
if (!ENCRYPTION_KEY || Buffer.from(ENCRYPTION_KEY, "hex").length !== 32) {
  throw new Error("❌ Invalid ENCRYPTION_KEY: must be 64 hex characters (32 bytes)")
}

// -- AES-256-CBC encryption helper --
function encrypt(text: string | null | undefined): string {
  if (!text) return ""
  const iv = crypto.randomBytes(16)
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(ENCRYPTION_KEY, "hex"), iv)
  let encrypted = cipher.update(text, "utf8", "hex")
  encrypted += cipher.final("hex")
  return `${iv.toString("hex")}:${encrypted}`
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text()
    if (!rawBody) {
      return NextResponse.json({ success: false, error: "Missing request body" }, { status: 400 })
    }

    let body
    try {
      body = JSON.parse(rawBody)
    } catch {
      return NextResponse.json({ success: false, error: "Invalid JSON format" }, { status: 400 })
    }

    const encryptedData = {
      username: encrypt(body.username),
      password: encrypt(body.password),
      organization_id: body.organization_id || null,
      application_id: body.application_id || null,
      environment: body.environment || null,
      auto_eligibility: body.auto_eligibility ?? false,
      auto_prior_auth: body.auto_prior_auth ?? false,
      enable_claims: body.enable_claims ?? false,
      enable_remittance: body.enable_remittance ?? false,
      sync_frequency: body.sync_frequency || "manual",
      updated_at: new Date().toISOString(),
    }

    const supabaseRes = await fetch(`${SUPABASE_URL}/rest/v1/availity_integrations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify(encryptedData),
    })

    if (!supabaseRes.ok) {
      const errorBody = await supabaseRes.text()
      return NextResponse.json(
        { success: false, error: "Supabase Error", details: errorBody },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Internal Server Error" },
      { status: 500 }
    )
  }
}
