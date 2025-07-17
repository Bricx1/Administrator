import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const { credentials, syncSettings } = await request.json()

    // Get user session
    const cookieStore =  await cookies()
    const user_id = cookieStore.get("user_id")?.value

    if (!user_id) {
      return NextResponse.json(
        { success: false, message: "Authentication required. Please log in." },
        { status: 401 }
      )
    }

    // Validate required fields
    if (!credentials.username || !credentials.password || !credentials.organizationId) {
      return NextResponse.json(
        {
          success: false,
          message: "Username, password, and Organization ID are required",
        },
        { status: 400 }
      )
    }

    // Simulate configuration save delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Save integration configuration
    const { error } = await supabase.from("availity_integrations").upsert({
      user_id,
      username: credentials.username,
      // Note: In production, encrypt the password
      password: credentials.password,
      organization_id: credentials.organizationId,
      application_id: credentials.applicationId,
      environment: credentials.environment,
      auto_eligibility: syncSettings.autoEligibilityCheck,
      auto_prior_auth: syncSettings.autoPriorAuth,
      enable_claims: syncSettings.enableClaims,
      enable_remittance: syncSettings.enableRemittance,
      sync_frequency: syncSettings.syncFrequency,
      is_active: true,
      last_sync: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })

    if (error) {
      console.error("Error saving integration:", error)
      return NextResponse.json(
        { success: false, message: "Failed to save configuration" },
        { status: 500 }
      )
    }

    // Insert configuration saved transaction
    await supabase.from("availity_transactions").insert({
      user_id,
      type: "Configuration",
      status: "success",
      patient_name: "System",
      payer_name: "Availity",
      payer_plan: "Integration Setup",
      created_at: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      message: "Availity integration configured successfully",
    })
  } catch (error) {
    console.error("Error in /availity/configure:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to save configuration",
      },
      { status: 500 }
    )
  }
}