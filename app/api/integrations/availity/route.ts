import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  const url = req.nextUrl.pathname
  const body = await req.json()

  // --- /test-connection
  if (url.endsWith("/test-connection")) {
    const { username, password, organizationId, applicationId } = body

    if (!username || !password || !organizationId || !applicationId) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      testResults: {
        responseTime: "0.8s",
        eligibility: "Available",
        priorAuth: "Available",
        claims: "Available",
        era: "Available",
      },
    })
  }

  // --- /configure
  if (url.endsWith("/configure")) {
    const { credentials, syncSettings } = body

    

    const { error } = await supabase.from("availity_integrations").upsert(
      {
         user_id: "user-id",
        username: credentials.username,
        password: credentials.password,
        organization_id: credentials.organizationId,
        application_id: credentials.applicationId,
        environment: credentials.environment,
        auto_eligibility: syncSettings.autoEligibilityCheck,
        auto_prior_auth: syncSettings.autoPriorAuth,
        enable_claims: syncSettings.enableClaims,
        enable_remittance: syncSettings.enableRemittance,
        sync_frequency: syncSettings.syncFrequency,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    )

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  }

  // --- /monitor
  if (url.endsWith("/monitor")) {
    // Optional: pull recent integration logs (stubbed example)
    const logs = [
      {
        time: "2:18 PM",
        service: "Eligibility Check",
        patient: "Margaret Anderson",
        payer: "Medicare",
        status: "success",
      },
      {
        time: "2:15 PM",
        service: "Prior Auth",
        patient: "Robert Thompson",
        payer: "Blue Cross",
        status: "approved",
      },
    ]

    return NextResponse.json({ success: true, logs })
  }

  return NextResponse.json({ success: false, message: "Invalid endpoint" }, { status: 404 })
}
