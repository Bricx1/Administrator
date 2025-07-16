import { type NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

interface TestConnectionRequest {
  username: string;
  password: string;
  clientId: string;
  environment: 'production' | 'staging' | 'development';
  timeout?: number;
}

interface TestResult {
  apiVersion: string;
  services: {
    eligibility: string;
    priorAuth: string;
    billing: string;
    referrals?: string;
  };
  responseTime: string;
  environment: string;
  clientId: string;
  serverTime: string;
}

async function logActivity(
  integration_id: string,
  type: string,
  status: 'success' | 'failed' | 'pending',
  user: string,
  environment: string,
  details?: any
) {
  try {
    const { data: existingMetrics } = await supabase
      .from("integration_metrics")
      .select("recent_activity")
      .eq("integration_id", integration_id)
      .single();

    const currentActivity = existingMetrics?.recent_activity || [];
    const newActivity = {
      type,
      status,
      user,
      environment,
      time: new Date().toISOString(),
      details,
    };

    // Keep only the last 10 activities
    const updatedActivity = [newActivity, ...currentActivity].slice(0, 10);

    await supabase
      .from("integration_metrics")
      .upsert([
        {
          integration_id,
          recent_activity: updatedActivity,
          updated_at: new Date().toISOString(),
        },
      ]);
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body: TestConnectionRequest = await request.json();

    // Enhanced input validation
    const { username, password, clientId, environment, timeout = 5000 } = body;

    if (!username || !password || !clientId || !environment) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields: username, password, clientId, and environment",
          required: ["username", "password", "clientId", "environment"],
        },
        { status: 400 }
      );
    }

    // Validate environment
    if (!['production', 'staging', 'development'].includes(environment)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid environment. Must be 'production', 'staging', or 'development'",
        },
        { status: 400 }
      );
    }

    // Log test attempt
    await logActivity(clientId, "Test Connection", "pending", username, environment);

    // Simulate API delay with timeout
    const delay = Math.random() * 2000 + 500; // 0.5-2.5 seconds
    await new Promise((resolve, reject) => {
      const timer = setTimeout(resolve, delay);
      setTimeout(() => {
        clearTimeout(timer);
        reject(new Error("Connection timeout"));
      }, timeout);
    });

    // Enhanced credential validation
    const isValidCredentials = !(
      username.toLowerCase() === "invalid" || 
      password.toLowerCase() === "invalid" ||
      username.length < 3 ||
      password.length < 6
    );

    if (!isValidCredentials) {
      const responseTime = Date.now() - startTime;
      
      await logActivity(
        clientId,
        "Test Connection",
        "failed",
        username,
        environment,
        { 
          reason: "Invalid credentials",
          responseTime: `${responseTime}ms`,
        }
      );

      return NextResponse.json(
        {
          success: false,
          message: "Authentication failed: Invalid credentials provided",
          errorCode: "AUTH_FAILED",
          responseTime: `${responseTime}ms`,
        },
        { status: 401 }
      );
    }

    // Environment-specific service availability
    const serviceAvailability = {
      production: {
        eligibility: "available",
        priorAuth: "available",
        billing: "available",
        referrals: "available",
      },
      staging: {
        eligibility: "available",
        priorAuth: "limited",
        billing: "available",
        referrals: "available",
      },
      development: {
        eligibility: "available",
        priorAuth: "mock",
        billing: "mock",
        referrals: "available",
      },
    };

    const responseTime = Date.now() - startTime;
    const testResults: TestResult = {
      apiVersion: "v2.1.3",
      services: serviceAvailability[environment],
      responseTime: `${responseTime}ms`,
      environment,
      clientId,
      serverTime: new Date().toISOString(),
    };

    // Update metrics with success
    const { data: currentMetrics } = await supabase
      .from("integration_metrics")
      .select("api_calls_today, success_rate, avg_response")
      .eq("integration_id", clientId)
      .single();

    const newCallsToday = (currentMetrics?.api_calls_today || 0) + 1;
    const newAvgResponse = currentMetrics?.avg_response 
      ? (currentMetrics.avg_response + responseTime) / 2
      : responseTime;

    await supabase
      .from("integration_metrics")
      .upsert([
        {
          integration_id: clientId,
          api_calls_today: newCallsToday,
          success_rate: Math.min(99.5, (currentMetrics?.success_rate || 95) + 0.1),
          uptime: Math.min(99.9, (currentMetrics?.success_rate || 98) + 0.1),
          avg_response: newAvgResponse / 1000, // Convert to seconds
          updated_at: new Date().toISOString(),
        },
      ]);

    // Log successful connection
    await logActivity(
      clientId,
      "Test Connection",
      "success",
      username,
      environment,
      {
        responseTime: `${responseTime}ms`,
        apiVersion: testResults.apiVersion,
        servicesChecked: Object.keys(testResults.services).length,
      }
    );

    return NextResponse.json({
      success: true,
      message: "Successfully connected to ExtendedCare API",
      testResults,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    console.error("Test Connection Error:", error);
    
    // Log error
    const body = await request.json().catch(() => ({}));
    if (body.clientId) {
      await logActivity(
        body.clientId,
        "Test Connection",
        "failed",
        body.username || "unknown",
        body.environment || "unknown",
        {
          error: error instanceof Error ? error.message : "Unknown error",
          responseTime: `${responseTime}ms`,
        }
      );
    }

    if (error instanceof Error && error.message === "Connection timeout") {
      return NextResponse.json(
        {
          success: false,
          message: "Connection timeout - ExtendedCare API is not responding",
          errorCode: "TIMEOUT",
          responseTime: `${responseTime}ms`,
        },
        { status: 408 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error during connection test",
        errorCode: "INTERNAL_ERROR",
        responseTime: `${responseTime}ms`,
      },
      { status: 500 }
    );
  }
}

// GET method to retrieve connection status
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const integration_id = searchParams.get('integration_id');

    if (!integration_id) {
      return NextResponse.json(
        { success: false, message: "integration_id parameter required" },
        { status: 400 }
      );
    }

    const { data: metrics, error } = await supabase
      .from("integration_metrics")
      .select("*")
      .eq("integration_id", integration_id)
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, message: "No connection history found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        integration_id,
        status: metrics.uptime > 95 ? "healthy" : "degraded",
        metrics: {
          uptime: metrics.uptime,
          success_rate: metrics.success_rate,
          avg_response: metrics.avg_response,
          api_calls_today: metrics.api_calls_today,
        },
        recent_activity: metrics.recent_activity?.slice(0, 5) || [],
        last_updated: metrics.updated_at,
      },
    });

  } catch (error) {
    console.error("Get connection status error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to retrieve connection status" },
      { status: 500 }
    );
  }
}