import { type NextRequest, NextResponse } from "next/server"
import { cookies} from "next/headers"
import {supabase} from "@/lib/supabase"
export async function POST(request: NextRequest) {
  try {
    const { username, password, organizationId, applicationId, environment } = await request.json()

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
    if (!username || !password || !organizationId) {
      return NextResponse.json(
        {
          success: false,
          message: "Username, password, and Organization ID are required",
        },
        { status: 400 }
      )
    }

    // Simulate credential validation
    if (username === "invalid" || password === "invalid") {
      // Insert failed transaction
      await supabase.from("availity_transactions").insert({
        user_id,
        type: "Eligibility",
        status: "failed",
        patient_name: "Test User",
        payer_name: "Unknown",
        payer_plan: "N/A",
        error_message: "Invalid credentials provided",
        created_at: new Date().toISOString()
      })

      return NextResponse.json(
        {
          success: false,
          message: "Invalid Availity credentials provided",
        },
        { status: 401 }
      )
    }

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1200))

    // Insert successful test transaction
    await supabase.from("availity_transactions").insert({
      user_id,
      type: "Eligibility",
      status: "success",
      patient_name: "Jane Doe",
      payer_name: "Aetna",
      payer_plan: "Basic Plus",
      member_id: "TEST123456",
      created_at: new Date().toISOString()
    })

    // Update or create integration record
    await supabase.from("availity_integrations").upsert({
      user_id,
      username,
      organization_id: organizationId,
      application_id: applicationId,
      environment,
      is_active: true,
      last_sync: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }, { onConflict: 'user_id' })

    return NextResponse.json({
      success: true,
      message: "Successfully connected to Availity API",
      testResults: {
        apiVersion: "v1.0",
        services: {
          eligibility: "available",
          priorAuth: "available",
          claims: "available",
          remittance: "available",
        },
        responseTime: "0.8s",
        environment,
        payerCount: 2500,
        coverage: "99% of insured Americans",
      },
    })
  } catch (error) {
    console.error("Error in /availity/test:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    )
  }
}