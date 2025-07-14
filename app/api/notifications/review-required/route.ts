import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { fileId, reviewType, assignedTo, qualityScore, flagCount } = await request.json()

    console.log("Sending review required notification:", {
      fileId,
      reviewType,
      assignedTo,
      qualityScore,
      flagCount,
    })

    // Determine notification priority based on quality score and flags
    let priority = "medium"
    if (qualityScore < 70 || flagCount > 3) {
      priority = "high"
    } else if (qualityScore < 80 || flagCount > 1) {
      priority = "medium"
    } else {
      priority = "low"
    }

    // Get assignee email (in real app, query user database)
    const assigneeEmails = {
      "Jennifer Adams, RN (QA)": "jennifer.adams@healthcare-agency.com",
      "Dr. Michael Rodriguez (Clinical Director)": "michael.rodriguez@healthcare-agency.com",
    }

    const assigneeEmail = assigneeEmails[assignedTo as keyof typeof assigneeEmails]

    if (assigneeEmail && process.env.SENDGRID_API_KEY) {
      const emailData = {
        to: assigneeEmail,
        from: "noreply@healthcare-agency.com",
        subject: `${reviewType.toUpperCase().replace("_", " ")} Required - File ${fileId}`,
        html: `
          <h2>Review Required</h2>
          <p><strong>File ID:</strong> ${fileId}</p>
          <p><strong>Review Type:</strong> ${reviewType.replace("_", " ").toUpperCase()}</p>
          <p><strong>Quality Score:</strong> ${qualityScore}%</p>
          <p><strong>Flags Detected:</strong> ${flagCount}</p>
          <p><strong>Priority:</strong> ${priority.toUpperCase()}</p>
          <p>AI processing has completed and this file requires your review.</p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/oasis-upload?tab=queue&file=${fileId}" 
             style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Review File
          </a>
        `,
      }

      // In production, actually send the email:
      // await sendGridClient.send(emailData)
    }

    // Create in-app notification
    const notification = {
      id: `NOTIF-${Date.now()}`,
      type: "review_required",
      title: `${reviewType.replace("_", " ").toUpperCase()} Required`,
      message: `File ${fileId} needs ${reviewType.replace("_", " ")} (Quality: ${qualityScore}%, Flags: ${flagCount})`,
      priority,
      assignedTo,
      createdAt: new Date().toISOString(),
      readAt: null,
      actionUrl: `/oasis-upload?tab=queue&file=${fileId}`,
      metadata: {
        fileId,
        reviewType,
        qualityScore,
        flagCount,
      },
    }

    return NextResponse.json({
      success: true,
      message: "Review notification sent",
      notification,
    })
  } catch (error) {
    console.error("Review notification error:", error)
    return NextResponse.json({ error: "Failed to send review notification" }, { status: 500 })
  }
}
