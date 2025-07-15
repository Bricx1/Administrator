import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { username, password, agencyId, environment } = await request.json();

    if (!username || !password || !agencyId) {
      return NextResponse.json(
        { success: false, error: "Missing required credentials" },
        { status: 400 }
      );
    }

    console.log(`🔌 Testing Axxess connection for ${username} to ${environment}...`);
    
    // Simulate API delay
    await new Promise((res) => setTimeout(res, 1000));

    return NextResponse.json({
      success: true,
      message: "Connection test successful",
    });
  } catch (error) {
    console.error("Test connection error:", error);
    return NextResponse.json(
      { success: false, error: "Server error while testing connection" },
      { status: 500 }
    );
  }
}
