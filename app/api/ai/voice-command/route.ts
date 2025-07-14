import { type NextRequest, NextResponse } from "next/server"

interface VoiceCommandRequest {
  command: string
  currentPage?: string
  userRole?: "patient" | "staff" | "admin"
  context?: {
    timestamp: string
    confidence: number
  }
}

interface CommandResponse {
  success: boolean
  response: string
  action?: "navigate" | "execute" | "info"
  path?: string
  function?: string
  parameters?: any
}

export async function POST(request: NextRequest): Promise<NextResponse<CommandResponse>> {
  try {
    const body: VoiceCommandRequest = await request.json()
    const { command, currentPage, userRole, context } = body

    // Process the voice command with AI
    const response = await processVoiceCommand(command, currentPage, userRole)

    return NextResponse.json(response)
  } catch (error) {
    console.error("Voice command processing error:", error)
    return NextResponse.json(
      {
        success: false,
        response: "I'm sorry, I couldn't process that command. Please try again.",
      },
      { status: 500 },
    )
  }
}

async function processVoiceCommand(command: string, currentPage?: string, userRole?: string): Promise<CommandResponse> {
  const cmd = command.toLowerCase().trim()

  // Navigation commands
  if (cmd.includes("navigate") || cmd.includes("go to") || cmd.includes("show me") || cmd.includes("open")) {
    return handleNavigationCommand(cmd, userRole)
  }

  // Search commands
  if (cmd.includes("search") || cmd.includes("find") || cmd.includes("look for")) {
    return handleSearchCommand(cmd)
  }

  // Create commands
  if (cmd.includes("create") || cmd.includes("new") || cmd.includes("add")) {
    return handleCreateCommand(cmd, userRole)
  }

  // Update commands
  if (cmd.includes("update") || cmd.includes("edit") || cmd.includes("modify")) {
    return handleUpdateCommand(cmd)
  }

  // Information commands
  if (cmd.includes("what") || cmd.includes("how") || cmd.includes("explain") || cmd.includes("help")) {
    return handleInformationCommand(cmd, currentPage, userRole)
  }

  // Status commands
  if (cmd.includes("status") || cmd.includes("summary") || cmd.includes("overview")) {
    return handleStatusCommand(cmd, userRole)
  }

  // Default response for unrecognized commands
  return {
    success: true,
    response: `I didn't understand "${command}". Try saying things like "navigate to dashboard", "search for patient", or "create new complaint".`,
    action: "info",
  }
}

function handleNavigationCommand(command: string, userRole?: string): CommandResponse {
  const navigationMap: Record<string, { path: string; description: string; roles?: string[] }> = {
    dashboard: { path: "/", description: "main dashboard" },
    "patient portal": { path: "/patient-portal", description: "patient portal", roles: ["patient", "staff", "admin"] },
    patients: { path: "/patients", description: "patient list", roles: ["staff", "admin"] },
    "oasis qa": { path: "/oasis-qa", description: "OASIS quality assurance", roles: ["staff", "admin"] },
    "quality assurance": { path: "/oasis-qa", description: "quality assurance dashboard", roles: ["staff", "admin"] },
    complaints: { path: "/complaints", description: "complaints system", roles: ["staff", "admin"] },
    "patient complaints": { path: "/complaints", description: "patient complaints", roles: ["staff", "admin"] },
    communications: { path: "/communications", description: "team communications", roles: ["staff", "admin"] },
    schedule: { path: "/schedule", description: "scheduling system", roles: ["staff", "admin"] },
    documents: { path: "/documents", description: "document management", roles: ["staff", "admin"] },
    training: { path: "/training", description: "training modules", roles: ["staff", "admin"] },
    integrations: { path: "/integrations", description: "system integrations", roles: ["admin"] },
    "survey ready": { path: "/survey-ready", description: "survey readiness dashboard", roles: ["staff", "admin"] },
    "home care orders": {
      path: "/survey-ready/homecare-orders",
      description: "home care orders",
      roles: ["staff", "admin"],
    },
    medications: { path: "/patient-portal", description: "medication management", roles: ["patient"] },
    "care team": { path: "/patient-portal", description: "care team information", roles: ["patient"] },
    games: { path: "/patient-portal", description: "brain games", roles: ["patient"] },
    community: { path: "/patient-portal", description: "patient community", roles: ["patient"] },
  }

  // Find matching navigation target
  for (const [key, nav] of Object.entries(navigationMap)) {
    if (command.includes(key)) {
      // Check role permissions
      if (nav.roles && userRole && !nav.roles.includes(userRole)) {
        return {
          success: true,
          response: `I'm sorry, you don't have access to ${nav.description}. Please contact your administrator if you need access.`,
          action: "info",
        }
      }

      return {
        success: true,
        response: `Navigating to ${nav.description}...`,
        action: "navigate",
        path: nav.path,
      }
    }
  }

  return {
    success: true,
    response: "I couldn't find that page. Try saying 'dashboard', 'patients', 'OASIS QA', or 'complaints'.",
    action: "info",
  }
}

function handleSearchCommand(command: string): CommandResponse {
  // Extract search terms
  const searchTerms = command.replace(/search|find|look for/g, "").trim()

  if (!searchTerms) {
    return {
      success: true,
      response: "What would you like me to search for? You can search for patients, documents, or records.",
      action: "info",
    }
  }

  return {
    success: true,
    response: `Searching for "${searchTerms}"...`,
    action: "execute",
    function: "search",
    parameters: { query: searchTerms },
  }
}

function handleCreateCommand(command: string, userRole?: string): CommandResponse {
  const createMap: Record<string, { description: string; roles?: string[] }> = {
    complaint: { description: "new complaint", roles: ["patient", "staff", "admin"] },
    "patient complaint": { description: "patient complaint", roles: ["staff", "admin"] },
    "corrective action": { description: "corrective action", roles: ["staff", "admin"] },
    appointment: { description: "appointment", roles: ["staff", "admin"] },
    "care plan": { description: "care plan", roles: ["staff", "admin"] },
    note: { description: "clinical note", roles: ["staff", "admin"] },
    "oasis assessment": { description: "OASIS assessment", roles: ["staff", "admin"] },
  }

  for (const [key, item] of Object.entries(createMap)) {
    if (command.includes(key)) {
      if (item.roles && userRole && !item.roles.includes(userRole)) {
        return {
          success: true,
          response: `I'm sorry, you don't have permission to create ${item.description}.`,
          action: "info",
        }
      }

      return {
        success: true,
        response: `Opening form to create ${item.description}...`,
        action: "execute",
        function: "create",
        parameters: { type: key },
      }
    }
  }

  return {
    success: true,
    response: "What would you like to create? You can create complaints, appointments, care plans, or notes.",
    action: "info",
  }
}

function handleUpdateCommand(command: string): CommandResponse {
  return {
    success: true,
    response:
      "What would you like to update? Please be more specific about the record or information you want to modify.",
    action: "info",
  }
}

function handleInformationCommand(command: string, currentPage?: string, userRole?: string): CommandResponse {
  // Help commands
  if (command.includes("help")) {
    const helpText = getHelpText(userRole)
    return {
      success: true,
      response: helpText,
      action: "info",
    }
  }

  // Explain current page
  if (command.includes("what is this") || command.includes("explain this page")) {
    const pageExplanation = getPageExplanation(currentPage, userRole)
    return {
      success: true,
      response: pageExplanation,
      action: "info",
    }
  }

  // General information
  return {
    success: true,
    response:
      "I can help you navigate the system, search for information, create records, and answer questions. What would you like to know?",
    action: "info",
  }
}

function handleStatusCommand(command: string, userRole?: string): CommandResponse {
  // This would typically fetch real data from the database
  const mockStatus = {
    patient: {
      medications: 3,
      appointments: 2,
      messages: 1,
    },
    staff: {
      patients: 15,
      pendingTasks: 8,
      oasisReviews: 5,
      complaints: 2,
    },
    admin: {
      totalPatients: 150,
      staffMembers: 25,
      systemAlerts: 3,
      complianceRate: 95.3,
    },
  }

  const status = mockStatus[userRole as keyof typeof mockStatus] || mockStatus.staff

  let response = "Here's your current status: "
  Object.entries(status).forEach(([key, value]) => {
    response += `${key.replace(/([A-Z])/g, " $1").toLowerCase()}: ${value}, `
  })

  return {
    success: true,
    response: response.slice(0, -2) + ".",
    action: "info",
  }
}

function getHelpText(userRole?: string): string {
  const commonCommands = [
    "Navigate to [page name] - Go to different sections",
    "Search for [term] - Find patients, records, or documents",
    "Show status - Get current overview",
    "Help - Show this help message",
  ]

  const roleSpecificCommands: Record<string, string[]> = {
    patient: [
      "Show my medications - View medication list",
      "Show my care team - View care providers",
      "Create complaint - Submit feedback",
      "Play games - Access brain training games",
    ],
    staff: [
      "Create new complaint - Start complaint process",
      "Show OASIS QA - View quality assurance",
      "Create care plan - Start new care plan",
      "Show pending tasks - View task list",
    ],
    admin: [
      "Show system status - View system overview",
      "Create corrective action - Start corrective action",
      "Show integrations - View system connections",
      "Show compliance report - View compliance data",
    ],
  }

  const commands = [...commonCommands, ...(roleSpecificCommands[userRole || "staff"] || [])]

  return `Here are some commands you can try: ${commands.join("; ")}`
}

function getPageExplanation(currentPage?: string, userRole?: string): string {
  const pageExplanations: Record<string, string> = {
    "/": "This is the main dashboard where you can see an overview of your system and quick access to key features.",
    "/patient-portal":
      "This is the patient portal where patients can manage medications, view care plans, play games, and communicate with their care team.",
    "/oasis-qa":
      "This is the OASIS Quality Assurance system where clinical staff review and approve patient assessments with AI assistance.",
    "/complaints":
      "This is the complaint management system where patient feedback and concerns are tracked and resolved.",
    "/communications": "This is the team communication center for messaging, video calls, and meeting scheduling.",
    "/survey-ready": "This is the survey readiness dashboard to help prepare for regulatory inspections.",
  }

  return (
    pageExplanations[currentPage || "/"] ||
    "This page contains various tools and information for managing healthcare operations."
  )
}
