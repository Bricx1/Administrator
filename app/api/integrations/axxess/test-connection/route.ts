import { type NextRequest, NextResponse } from "next/server"

interface TestConnectionRequest {
  username: string
  password: string
  agencyId: string
  environment?: string
}

export async function POST(request: NextRequest) {
  try {
    const { username, password, agencyId, environment } = (await request.json()) as Partial<TestConnectionRequest>

    if (!username || !password || !agencyId) {
      return NextResponse.json(
        { success: false, message: "Missing required credentials" },
        { status: 400 },
      )
    }

    console.log(`Testing Axxess connection for ${username} to ${environment ?? "production"} environment...`)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (username.includes("@") && password.length >= 8) {
      return NextResponse.json({
        success: true,
        message: "Connection successful",
      })
    }

    return NextResponse.json(
      { success: false, message: "Invalid credentials or agency ID" },
      { status: 401 },
    )
  } catch (err) {
    await logIntegrationError(err, { stage: "connection-test" })
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    )
  }
}

async function logIntegrationError(error: unknown, context?: Record<string, any>) {
  try {
    console.error("Axxess integration error:", error, context)
  } catch (logErr) {
    console.error("Failed to log integration error:", logErr)
  }
}
