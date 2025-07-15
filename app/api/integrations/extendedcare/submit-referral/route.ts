import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { extendedCareApi, type ExtendedCareReferralRequest } from "@/lib/extendedcare-api"
import { supabaseAdmin } from '@/lib/supabase/server'

const referralSchema = z.object({
  patient: z.object({
    id: z.string(),
    name: z.string(),
  }),
  provider: z.object({
    name: z.string(),
    npi: z.string(),
    facility: z.string(),
  }),
  insurance: z.object({
    provider: z.string(),
    id: z.string(),
  }),
  diagnosis: z.string(),
  diagnosisCode: z.string(),
  requestedServices: z.array(z.string()),
  urgencyLevel: z.enum(["routine", "urgent", "stat"]),
  estimatedEpisodeLength: z.number(),
  geographicLocation: z.object({
    address: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
    coordinates: z
      .object({
        lat: z.number(),
        lng: z.number(),
      })
      .optional(),
  }),
  specialRequirements: z.array(z.string()).optional(),
  preferredStartDate: z.string().optional(),
})

export async function POST(request: NextRequest) {
  const payload = await request.json()
  const parsed = referralSchema.safeParse(payload)

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, message: "Invalid referral data", errors: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const { patient, provider, insurance, ...rest } = parsed.data

  const referralRequest: ExtendedCareReferralRequest = {
    patientName: patient.name,
    patientId: patient.id,
    diagnosis: rest.diagnosis,
    diagnosisCode: rest.diagnosisCode,
    insuranceProvider: insurance.provider,
    insuranceId: insurance.id,
    requestedServices: rest.requestedServices,
    urgencyLevel: rest.urgencyLevel,
    referringProvider: provider,
    estimatedEpisodeLength: rest.estimatedEpisodeLength,
    geographicLocation: rest.geographicLocation,
    specialRequirements: rest.specialRequirements,
    preferredStartDate: rest.preferredStartDate,
  }

  try {
    const eligibility = await extendedCareApi.checkEligibility(
      referralRequest.patientId,
      referralRequest.insuranceId,
    )

    if (!eligibility.success || !eligibility.isEligible) {
      return NextResponse.json(
        { success: false, message: eligibility.message || "Patient not eligible" },
        { status: 400 },
      )
    }

    const submission = await extendedCareApi.submitReferral(referralRequest)

    const { error } = await supabaseAdmin.from("referrals").insert({
      id: submission.referralId,
      patient_name: referralRequest.patientName,
      diagnosis: referralRequest.diagnosis,
      insurance_provider: referralRequest.insuranceProvider,
      insurance_id: referralRequest.insuranceId,
      referral_source: "ExtendedCare Network",
      status: "New",
      created_at: new Date().toISOString(),
    })

    if (error) {
      await logIntegrationError(error, { stage: "database" })
      return NextResponse.json(
        { success: false, message: "Failed to save referral" },
        { status: 500 },
      )
    }

    return NextResponse.json({
      success: true,
      message: submission.message,
      referralId: submission.referralId,
    })
  } catch (err) {
    await logIntegrationError(err, { stage: "processing" })
    return NextResponse.json(
      { success: false, message: "Referral submission failed" },
      { status: 500 },
    )
  }
}

async function logIntegrationError(error: unknown, context?: Record<string, any>) {
  try {
    console.error("ExtendedCare integration error:", error, context)
    // Placeholder for real logging implementation
  } catch (logErr) {
    console.error("Failed to log integration error:", logErr)
  }
}
