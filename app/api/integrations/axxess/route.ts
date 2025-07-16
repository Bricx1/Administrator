import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const url = req.nextUrl.pathname
  const body = await req.json()

  if (url.endsWith("/configure")) {
    const { username, password, organizationId, applicationId, environment, syncSettings } = body

    const user_id = "mock-user-id" // Replace this with Supabase auth user ID if using auth

    const { error } = await supabase.from("availity_integrations").upsert({
      user_id,
      username,
      password,
      organization_id: organizationId,
      application_id: applicationId,
      environment,
      auto_eligibility: syncSettings?.autoEligibilityCheck ?? null,
      auto_prior_auth: syncSettings?.autoPriorAuth ?? null,
      enable_claims: syncSettings?.enableClaims ?? null,
      enable_remittance: syncSettings?.enableRemittance ?? null,
      sync_frequency: syncSettings?.syncFrequency ?? null,
      updated_at: new Date().toISOString()
    }, { onConflict: "user_id" })

    if (error) {
      console.error("Supabase upsert error:", error.message)
      return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ success: false, message: "Invalid route" }, { status: 404 })
}
