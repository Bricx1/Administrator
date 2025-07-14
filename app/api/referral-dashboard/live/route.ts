import { type NextRequest, NextResponse } from "next/server"

interface Referral {
  id: string
  patientName: string
  diagnosis: string
  source: "email" | "fax" | "extendedcare" | "phone"
  insurance: string
  urgency: "STAT" | "Urgent" | "Routine"
  status: "processing" | "accepted" | "review" | "rejected"
  confidence: number
  estimatedValue: number
  receivedAt: string
  processedAt?: string
  assignedTo?: string
  reasonCode?: string
}

// Mock data for demonstration
const mockReferrals: Referral[] = [
  {
    id: "REF-001",
    patientName: "Dorothy Martinez",
    diagnosis: "Wound Care - Stage 3 Pressure Ulcer",
    source: "email",
    insurance: "Medicare",
    urgency: "STAT",
    status: "processing",
    confidence: 0,
    estimatedValue: 3200,
    receivedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
  },
  {
    id: "REF-002",
    patientName: "Robert Williams",
    diagnosis: "Post-Surgical Care - Hip Replacement",
    source: "fax",
    insurance: "Medicaid",
    urgency: "Urgent",
    status: "accepted",
    confidence: 92,
    estimatedValue: 2800,
    receivedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 minutes ago
    processedAt: new Date(Date.now() - 9 * 60 * 1000).toISOString(),
    assignedTo: "Sarah Johnson, RN",
  },
  {
    id: "REF-003",
    patientName: "Emily Chen",
    diagnosis: "Diabetes Management",
    source: "extendedcare",
    insurance: "Humana",
    urgency: "Routine",
    status: "review",
    confidence: 72,
    estimatedValue: 1900,
    receivedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    processedAt: new Date(Date.now() - 13 * 60 * 1000).toISOString(),
    reasonCode: "Distance verification needed",
  },
  {
    id: "REF-004",
    patientName: "James Rodriguez",
    diagnosis: "COPD Management",
    source: "phone",
    insurance: "Aetna",
    urgency: "Urgent",
    status: "rejected",
    confidence: 45,
    estimatedValue: 0,
    receivedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    processedAt: new Date(Date.now() - 19 * 60 * 1000).toISOString(),
    reasonCode: "Outside service area",
  },
  {
    id: "REF-005",
    patientName: "Maria Gonzalez",
    diagnosis: "Cardiac Rehabilitation",
    source: "email",
    insurance: "Medicare Advantage",
    urgency: "Routine",
    status: "accepted",
    confidence: 88,
    estimatedValue: 2400,
    receivedAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    processedAt: new Date(Date.now() - 23 * 60 * 1000).toISOString(),
    assignedTo: "Mike Davis, LPN",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const source = searchParams.get("source")
    const status = searchParams.get("status")
    const urgency = searchParams.get("urgency")
    const search = searchParams.get("search")

    let filteredReferrals = [...mockReferrals]

    // Apply filters
    if (source && source !== "all") {
      filteredReferrals = filteredReferrals.filter((r) => r.source === source)
    }

    if (status && status !== "all") {
      filteredReferrals = filteredReferrals.filter((r) => r.status === status)
    }

    if (urgency && urgency !== "all") {
      filteredReferrals = filteredReferrals.filter((r) => r.urgency === urgency)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredReferrals = filteredReferrals.filter(
        (r) =>
          r.patientName.toLowerCase().includes(searchLower) ||
          r.diagnosis.toLowerCase().includes(searchLower) ||
          r.insurance.toLowerCase().includes(searchLower),
      )
    }

    // Sort by received time (newest first)
    filteredReferrals.sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime())

    // Calculate statistics
    const stats = {
      total: mockReferrals.length,
      accepted: mockReferrals.filter((r) => r.status === "accepted").length,
      review: mockReferrals.filter((r) => r.status === "review").length,
      rejected: mockReferrals.filter((r) => r.status === "rejected").length,
      processing: mockReferrals.filter((r) => r.status === "processing").length,
      totalValue: mockReferrals.filter((r) => r.status === "accepted").reduce((sum, r) => sum + r.estimatedValue, 0),
      acceptanceRate:
        mockReferrals.length > 0
          ? (mockReferrals.filter((r) => r.status === "accepted").length / mockReferrals.length) * 100
          : 0,
      avgProcessingTime: 1.3, // seconds
    }

    const sourceBreakdown = {
      email: mockReferrals.filter((r) => r.source === "email").length,
      fax: mockReferrals.filter((r) => r.source === "fax").length,
      extendedcare: mockReferrals.filter((r) => r.source === "extendedcare").length,
      phone: mockReferrals.filter((r) => r.source === "phone").length,
    }

    return NextResponse.json({
      success: true,
      data: {
        referrals: filteredReferrals,
        stats,
        sourceBreakdown,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error fetching live referrals:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch live referrals" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, referralId, data } = body

    switch (action) {
      case "accept":
        // Logic to accept a referral
        console.log(`Accepting referral ${referralId}`)
        break

      case "reject":
        // Logic to reject a referral
        console.log(`Rejecting referral ${referralId}`)
        break

      case "review":
        // Logic to mark for review
        console.log(`Marking referral ${referralId} for review`)
        break

      case "assign":
        // Logic to assign to staff
        console.log(`Assigning referral ${referralId} to ${data.staffMember}`)
        break

      default:
        return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: `Referral ${action} completed successfully`,
    })
  } catch (error) {
    console.error("Error processing referral action:", error)
    return NextResponse.json({ success: false, error: "Failed to process referral action" }, { status: 500 })
  }
}
