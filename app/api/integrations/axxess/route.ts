import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { username, password, agencyId, environment } = await request.json();

    if (!username || !password || !agencyId) {
      return NextResponse.json({ error: "Missing required credentials" }, { status: 400 });
    }

    // Simulate successful connection
    console.log("Testing Axxess connection for:", username);
    await new Promise((res) => setTimeout(res, 1000));

    return NextResponse.json({
      success: true,
      message: "Connection successful",
      id: "INTEGRATION-" + Date.now(),
    });
  } catch (error) {
    console.error("Connection error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
