import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { staffId, patientPhoneNumber, message } = await request.json()

    if (!staffId || !patientPhoneNumber) {
      return NextResponse.json({ error: "Staff ID and patient phone number are required" }, { status: 400 })
    }

    // Generate tracking link
    const trackingLink = `${process.env.NEXT_PUBLIC_APP_URL}/track/${staffId}`

    // Default message if not provided
    const smsMessage = message || `Your healthcare provider is on the way! Track their location here: ${trackingLink}`

    const twilioResponse = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${process.env.TWILIO_ACCOUNT_SID}:${process.env.TWILIO_AUTH_TOKEN}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          From: process.env.TWILIO_PHONE_NUMBER!,
          To: patientPhoneNumber,
          Body: smsMessage,
        }),
      },
    )

    const twilioData = await twilioResponse.json().catch(() => null)

    if (!twilioResponse.ok || !twilioData) {
      console.error("Twilio error response", twilioData)
      return NextResponse.json(
        { success: false, error: "Failed to send location link" },
        { status: 502 },
      )
    }

    // Log the activity
    console.log(`Location link sent to ${patientPhoneNumber} for staff ${staffId}`)

    return NextResponse.json({
      success: true,
      message: "Location link sent successfully",
      data: {
        staffId,
        patientPhoneNumber,
        trackingLink,
        messageSid: twilioData.sid,
      },
    })
  } catch (error) {
    console.error("Error sending location link:", error)
    return NextResponse.json({ error: "Failed to send location link" }, { status: 500 })
  }
}
