import { type NextRequest, NextResponse } from "next/server"

// Helper function to calculate next sync time
function getNextSyncTime(frequency: string): string {
  const now = new Date()

  switch (frequency) {
    case "realtime":
      return "Continuous (via Webhooks)"
    case "15min":
      return new Date(now.getTime() + 15 * 60 * 1000).toISOString()
    case "hourly":
      return new Date(now.getTime() + 60 * 60 * 1000).toISOString()
    case "daily":
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      tomorrow.setHours(6, 0, 0, 0)
      return tomorrow.toISOString()
    case "manual":
      return "Manual Sync Only"
    default:
      return new Date(now.getTime() + 60 * 60 * 1000).toISOString()
  }
}

export async function POST(request: NextRequest) {
  try {
    const { credentials, syncSettings } = await request.json()

    // In a real implementation, you would:
    // 1. Encrypt the credentials using a strong algorithm (e.g., AES-256).
    // 2. Store the encrypted credentials and sync settings in your database (e.g., Supabase, Neon).
    // 3. Set up a job scheduler (like Vercel Cron Jobs) based on `syncSettings.frequency`.
    // 4. If `realtime`, register a webhook with Axxess.

    console.log("Saving Axxess configuration...")

    // Simulate encrypting credentials
    const encryptedCredentials = {
      username: `encrypted_user_for_${credentials.username}`,
      password: `[ENCRYPTED_HASH]_${Math.random().toString(36).slice(2)}`,
      agencyId: credentials.agencyId,
      environment: credentials.environment,
    }

    // Simulate saving the configuration to a database
    const savedConfiguration = {
      id: `axxess_config_${Date.now()}`,
      credentials: encryptedCredentials,
      syncSettings,
      status: "active",
      createdAt: new Date().toISOString(),
      lastSync: null,
      nextSync: getNextSyncTime(syncSettings.frequency),
    }

    console.log("Axxess configuration saved successfully:", {
      id: savedConfiguration.id,
      status: savedConfiguration.status,
      nextSync: savedConfiguration.nextSync,
    })

    // Return a success response
    return NextResponse.json({
      success: true,
      message: "Axxess integration configured successfully!",
      configId: savedConfiguration.id,
      nextSync: savedConfiguration.nextSync,
    })
  } catch (error) {
    console.error("Axxess configuration error:", error)
    return NextResponse.json({ error: "Failed to save Axxess configuration" }, { status: 500 })
  }
}
