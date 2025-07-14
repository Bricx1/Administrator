"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Database,
  Mail,
  MessageSquare,
  FileSignature,
  CreditCard,
  Shield,
  Stethoscope,
  Settings,
  Play,
  CheckCircle,
  AlertTriangle,
  Clock,
  TrendingUp,
  Activity,
  Zap,
  Plus,
  RefreshCw,
  Globe,
  Building2,
  Phone,
} from "lucide-react"

interface Integration {
  id: string
  name: string
  description: string
  icon: any
  status: "connected" | "disconnected" | "error"
  enabled: boolean
  lastSync: string
  apiCalls: number
  uptime: number
  color: string
  category: "healthcare" | "communication" | "financial" | "infrastructure"
}

interface Workflow {
  id: string
  name: string
  description: string
  triggers: string[]
  actions: string[]
  status: "active" | "inactive" | "running"
  lastRun: string
  successRate: number
}

export default function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: "axxess",
      name: "Axxess",
      description: "EMR & Home Health Software",
      icon: Stethoscope,
      status: "disconnected",
      enabled: false,
      lastSync: "Never",
      apiCalls: 0,
      uptime: 0,
      color: "bg-blue-600",
      category: "healthcare",
    },
    {
      id: "extendedcare",
      name: "ExtendedCare",
      description: "Eligibility, Prior Auth & Billing",
      icon: Building2,
      status: "disconnected",
      enabled: false,
      lastSync: "Never",
      apiCalls: 0,
      uptime: 0,
      color: "bg-indigo-600",
      category: "healthcare",
    },
    {
      id: "change-healthcare",
      name: "Change Healthcare",
      description: "Comprehensive payer network with 2,800+ plans",
      icon: Globe,
      status: "disconnected",
      enabled: false,
      lastSync: "Never",
      apiCalls: 0,
      uptime: 0,
      color: "bg-blue-600",
      category: "healthcare",
    },
    {
      id: "availity",
      name: "Availity",
      description: "Real-time Eligibility & Claims Portal",
      icon: Globe,
      status: "disconnected",
      enabled: false,
      lastSync: "Never",
      apiCalls: 0,
      uptime: 0,
      color: "bg-emerald-600",
      category: "healthcare",
    },
    {
      id: "supabase",
      name: "Supabase",
      description: "Database and authentication",
      icon: Database,
      status: "connected",
      enabled: true,
      lastSync: "2 minutes ago",
      apiCalls: 1247,
      uptime: 99.9,
      color: "bg-green-500",
      category: "infrastructure",
    },
    {
      id: "sendgrid",
      name: "SendGrid",
      description: "Email notifications and templates",
      icon: Mail,
      status: "connected",
      enabled: true,
      lastSync: "5 minutes ago",
      apiCalls: 892,
      uptime: 98.7,
      color: "bg-blue-500",
      category: "communication",
    },
    {
      id: "twilio",
      name: "Twilio",
      description: "SMS notifications and alerts",
      icon: MessageSquare,
      status: "connected",
      enabled: true,
      lastSync: "1 minute ago",
      apiCalls: 456,
      uptime: 99.2,
      color: "bg-red-500",
      category: "communication",
    },
    {
      id: "docusign",
      name: "DocuSign",
      description: "Digital signature management",
      icon: FileSignature,
      status: "connected",
      enabled: true,
      lastSync: "10 minutes ago",
      apiCalls: 234,
      uptime: 97.8,
      color: "bg-yellow-500",
      category: "financial",
    },
    {
      id: "stripe",
      name: "Stripe",
      description: "Payment processing and payroll",
      icon: CreditCard,
      status: "disconnected",
      enabled: false,
      lastSync: "Never",
      apiCalls: 0,
      uptime: 0,
      color: "bg-purple-500",
      category: "financial",
    },
    {
      id: "sterling",
      name: "Sterling",
      description: "Background check services",
      icon: Shield,
      status: "connected",
      enabled: true,
      lastSync: "30 minutes ago",
      apiCalls: 167,
      uptime: 96.5,
      color: "bg-indigo-500",
      category: "healthcare",
    },
    {
      id: "caqh",
      name: "CAQH",
      description: "Medical credentialing verification",
      icon: Stethoscope,
      status: "error",
      enabled: false,
      lastSync: "2 hours ago",
      apiCalls: 89,
      uptime: 85.2,
      color: "bg-orange-500",
      category: "healthcare",
    },
    {
      id: "quickbooks",
      name: "QuickBooks",
      description: "Payroll and accounting software",
      icon: CreditCard,
      status: "disconnected",
      enabled: false,
      lastSync: "Never",
      apiCalls: 0,
      uptime: 0,
      color: "bg-green-600",
      category: "financial",
    },
    {
      id: "vonage",
      name: "Vonage Business",
      description: "Automated fax processing and routing",
      icon: Phone,
      status: "disconnected",
      enabled: false,
      lastSync: "Never",
      apiCalls: 0,
      uptime: 0,
      color: "bg-red-600",
      category: "communication",
    },
  ])

  const [workflows, setWorkflows] = useState<Workflow[]>([
    {
      id: "onboarding",
      name: "Employee Onboarding",
      description: "Automated onboarding sequence for new hires",
      triggers: ["Application Approved", "Offer Accepted"],
      actions: ["Send Welcome Email", "Create HR File", "Schedule Orientation"],
      status: "active",
      lastRun: "1 hour ago",
      successRate: 94.5,
    },
    {
      id: "compliance",
      name: "Compliance Monitoring",
      description: "Monitor and alert on compliance requirements",
      triggers: ["Document Expiring", "Training Due"],
      actions: ["Send Alert", "Update Status", "Notify Supervisor"],
      status: "active",
      lastRun: "30 minutes ago",
      successRate: 98.2,
    },
    {
      id: "background-check",
      name: "Background Check Process",
      description: "Automated background verification workflow",
      triggers: ["Application Submitted", "Manual Request"],
      actions: ["Initiate Check", "Verify Results", "Update Application"],
      status: "active",
      lastRun: "2 hours ago",
      successRate: 91.7,
    },
    {
      id: "payroll-sync",
      name: "Payroll Synchronization",
      description: "Sync employee data with payroll system",
      triggers: ["Employee Added", "Status Changed"],
      actions: ["Update Payroll", "Set Benefits", "Send Confirmation"],
      status: "inactive",
      lastRun: "1 day ago",
      successRate: 87.3,
    },
  ])

  const [isNewIntegrationOpen, setIsNewIntegrationOpen] = useState(false)
  const [runningWorkflows, setRunningWorkflows] = useState<Set<string>>(new Set())

  const toggleIntegration = async (id: string) => {
    setIntegrations((prev) =>
      prev.map((integration) =>
        integration.id === id ? { ...integration, enabled: !integration.enabled } : integration,
      ),
    )

    // Simulate API call
    try {
      const response = await fetch(`/api/integrations/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !integrations.find((i) => i.id === id)?.enabled }),
      })

      if (!response.ok) throw new Error("Failed to toggle integration")
    } catch (error) {
      console.error("Error toggling integration:", error)
    }
  }

  const runWorkflow = async (workflowId: string) => {
    setRunningWorkflows((prev) => new Set(prev).add(workflowId))

    try {
      const response = await fetch("/api/workflows/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workflowId }),
      })

      if (!response.ok) throw new Error("Failed to run workflow")

      // Update workflow status
      setWorkflows((prev) =>
        prev.map((workflow) =>
          workflow.id === workflowId ? { ...workflow, status: "running" as const, lastRun: "Just now" } : workflow,
        ),
      )

      // Simulate workflow completion
      setTimeout(() => {
        setWorkflows((prev) =>
          prev.map((workflow) => (workflow.id === workflowId ? { ...workflow, status: "active" as const } : workflow)),
        )
        setRunningWorkflows((prev) => {
          const newSet = new Set(prev)
          newSet.delete(workflowId)
          return newSet
        })
      }, 3000)
    } catch (error) {
      console.error("Error running workflow:", error)
      setRunningWorkflows((prev) => {
        const newSet = new Set(prev)
        newSet.delete(workflowId)
        return newSet
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "disconnected":
        return <Clock className="h-4 w-4 text-gray-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>
      case "error":
        return <Badge variant="destructive">Error</Badge>
      case "disconnected":
        return <Badge variant="secondary">Disconnected</Badge>
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  const getSetupUrl = (integrationId: string) => {
    switch (integrationId) {
      case "axxess":
        return "/integrations/axxess-setup"
      case "extendedcare":
        return "/integrations/extendedcare-setup"
      case "change-healthcare":
        return "/integrations/change-healthcare-setup"
      case "availity":
        return "/integrations/availity-setup"
      case "quickbooks":
        return "/integrations/quickbooks-setup"
      case "vonage":
        return "/integrations/vonage-setup"
      default:
        return "#"
    }
  }

  const categorizeIntegrations = (category: string) => {
    return integrations.filter((integration) => integration.category === category)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">M.A.S.E Integrations</h1>
              <p className="text-gray-600">Manage your third-party integrations and automated workflows</p>
            </div>
            <div className="flex items-center space-x-4">
              <Dialog open={isNewIntegrationOpen} onOpenChange={setIsNewIntegrationOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Request Integration
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Request New Integration</DialogTitle>
                    <DialogDescription>
                      Tell us about the integration you'd like to see added to M.A.S.E
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="integration-name">Integration Name</Label>
                      <Input id="integration-name" placeholder="e.g., Workday, BambooHR" />
                    </div>
                    <div>
                      <Label htmlFor="integration-description">Description</Label>
                      <Textarea
                        id="integration-description"
                        placeholder="Describe what this integration would do and why it's needed..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="business-case">Business Case</Label>
                      <Textarea id="business-case" placeholder="How would this integration benefit your workflow?" />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setIsNewIntegrationOpen(false)}>
                        Cancel
                      </Button>
                      <Button onClick={() => setIsNewIntegrationOpen(false)}>Submit Request</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync All
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="integrations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="integrations" className="space-y-6">
            {/* Integration Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
                    <div>
                      <p className="text-2xl font-bold">
                        {integrations.filter((i) => i.status === "connected").length}
                      </p>
                      <p className="text-gray-600 text-sm">Connected</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <AlertTriangle className="h-8 w-8 text-red-500 mr-3" />
                    <div>
                      <p className="text-2xl font-bold">{integrations.filter((i) => i.status === "error").length}</p>
                      <p className="text-gray-600 text-sm">Errors</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Activity className="h-8 w-8 text-blue-500 mr-3" />
                    <div>
                      <p className="text-2xl font-bold">{integrations.reduce((sum, i) => sum + i.apiCalls, 0)}</p>
                      <p className="text-gray-600 text-sm">API Calls Today</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-purple-500 mr-3" />
                    <div>
                      <p className="text-2xl font-bold">
                        {Math.round(integrations.reduce((sum, i) => sum + i.uptime, 0) / integrations.length)}%
                      </p>
                      <p className="text-gray-600 text-sm">Avg Uptime</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Healthcare Integrations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Stethoscope className="h-5 w-5 mr-2 text-blue-600" />
                  Healthcare & Eligibility Platforms
                </CardTitle>
                <CardDescription>
                  EMR systems, eligibility verification, and prior authorization platforms
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categorizeIntegrations("healthcare").map((integration) => (
                    <Card key={integration.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-10 h-10 ${integration.color} rounded-lg flex items-center justify-center`}
                            >
                              <integration.icon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{integration.name}</CardTitle>
                              <CardDescription className="text-sm">{integration.description}</CardDescription>
                            </div>
                          </div>
                          <Switch
                            checked={integration.enabled}
                            onCheckedChange={() => toggleIntegration(integration.id)}
                          />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Status</span>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(integration.status)}
                              {getStatusBadge(integration.status)}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Last Sync</span>
                            <span className="text-sm font-medium">{integration.lastSync}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">API Calls</span>
                            <span className="text-sm font-medium">{integration.apiCalls.toLocaleString()}</span>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Uptime</span>
                              <span className="text-sm font-medium">{integration.uptime}%</span>
                            </div>
                            <Progress value={integration.uptime} className="h-2" />
                          </div>

                          <div className="flex space-x-2 pt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 bg-transparent"
                              onClick={() => {
                                window.location.href = getSetupUrl(integration.id)
                              }}
                            >
                              <Settings className="h-4 w-4 mr-2" />
                              Configure
                            </Button>
                            <Button size="sm" variant="outline">
                              Test
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Communication Integrations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2 text-green-600" />
                  Communication Platforms
                </CardTitle>
                <CardDescription>Email, SMS, and notification services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categorizeIntegrations("communication").map((integration) => (
                    <Card key={integration.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-10 h-10 ${integration.color} rounded-lg flex items-center justify-center`}
                            >
                              <integration.icon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{integration.name}</CardTitle>
                              <CardDescription className="text-sm">{integration.description}</CardDescription>
                            </div>
                          </div>
                          <Switch
                            checked={integration.enabled}
                            onCheckedChange={() => toggleIntegration(integration.id)}
                          />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Status</span>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(integration.status)}
                              {getStatusBadge(integration.status)}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Last Sync</span>
                            <span className="text-sm font-medium">{integration.lastSync}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">API Calls</span>
                            <span className="text-sm font-medium">{integration.apiCalls.toLocaleString()}</span>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Uptime</span>
                              <span className="text-sm font-medium">{integration.uptime}%</span>
                            </div>
                            <Progress value={integration.uptime} className="h-2" />
                          </div>

                          <div className="flex space-x-2 pt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 bg-transparent"
                              onClick={() => {
                                window.location.href = getSetupUrl(integration.id)
                              }}
                            >
                              <Settings className="h-4 w-4 mr-2" />
                              Configure
                            </Button>
                            <Button size="sm" variant="outline">
                              Test
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Financial Integrations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-purple-600" />
                  Financial & Payment Platforms
                </CardTitle>
                <CardDescription>Payment processing, payroll, and accounting systems</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categorizeIntegrations("financial").map((integration) => (
                    <Card key={integration.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-10 h-10 ${integration.color} rounded-lg flex items-center justify-center`}
                            >
                              <integration.icon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{integration.name}</CardTitle>
                              <CardDescription className="text-sm">{integration.description}</CardDescription>
                            </div>
                          </div>
                          <Switch
                            checked={integration.enabled}
                            onCheckedChange={() => toggleIntegration(integration.id)}
                          />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Status</span>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(integration.status)}
                              {getStatusBadge(integration.status)}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Last Sync</span>
                            <span className="text-sm font-medium">{integration.lastSync}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">API Calls</span>
                            <span className="text-sm font-medium">{integration.apiCalls.toLocaleString()}</span>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Uptime</span>
                              <span className="text-sm font-medium">{integration.uptime}%</span>
                            </div>
                            <Progress value={integration.uptime} className="h-2" />
                          </div>

                          <div className="flex space-x-2 pt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 bg-transparent"
                              onClick={() => {
                                window.location.href = getSetupUrl(integration.id)
                              }}
                            >
                              <Settings className="h-4 w-4 mr-2" />
                              Configure
                            </Button>
                            <Button size="sm" variant="outline">
                              Test
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Infrastructure Integrations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2 text-gray-600" />
                  Infrastructure & Core Services
                </CardTitle>
                <CardDescription>Database, authentication, and core platform services</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categorizeIntegrations("infrastructure").map((integration) => (
                    <Card key={integration.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-10 h-10 ${integration.color} rounded-lg flex items-center justify-center`}
                            >
                              <integration.icon className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{integration.name}</CardTitle>
                              <CardDescription className="text-sm">{integration.description}</CardDescription>
                            </div>
                          </div>
                          <Switch
                            checked={integration.enabled}
                            onCheckedChange={() => toggleIntegration(integration.id)}
                          />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Status</span>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(integration.status)}
                              {getStatusBadge(integration.status)}
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">Last Sync</span>
                            <span className="text-sm font-medium">{integration.lastSync}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">API Calls</span>
                            <span className="text-sm font-medium">{integration.apiCalls.toLocaleString()}</span>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Uptime</span>
                              <span className="text-sm font-medium">{integration.uptime}%</span>
                            </div>
                            <Progress value={integration.uptime} className="h-2" />
                          </div>

                          <div className="flex space-x-2 pt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 bg-transparent"
                              onClick={() => {
                                window.location.href = getSetupUrl(integration.id)
                              }}
                            >
                              <Settings className="h-4 w-4 mr-2" />
                              Configure
                            </Button>
                            <Button size="sm" variant="outline">
                              Test
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workflows" className="space-y-6">
            {/* Workflow Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Zap className="h-8 w-8 text-green-500 mr-3" />
                    <div>
                      <p className="text-2xl font-bold">{workflows.filter((w) => w.status === "active").length}</p>
                      <p className="text-gray-600 text-sm">Active Workflows</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Play className="h-8 w-8 text-blue-500 mr-3" />
                    <div>
                      <p className="text-2xl font-bold">{workflows.filter((w) => w.status === "running").length}</p>
                      <p className="text-gray-600 text-sm">Running Now</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <CheckCircle className="h-8 w-8 text-purple-500 mr-3" />
                    <div>
                      <p className="text-2xl font-bold">
                        {Math.round(workflows.reduce((sum, w) => sum + w.successRate, 0) / workflows.length)}%
                      </p>
                      <p className="text-gray-600 text-sm">Success Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 text-orange-500 mr-3" />
                    <div>
                      <p className="text-2xl font-bold">247</p>
                      <p className="text-gray-600 text-sm">Runs Today</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Workflows List */}
            <div className="space-y-4">
              {workflows.map((workflow) => (
                <Card key={workflow.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold">{workflow.name}</h3>
                          <Badge
                            variant={
                              workflow.status === "active"
                                ? "default"
                                : workflow.status === "running"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {workflow.status}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{workflow.description}</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Triggers:</span>
                            <ul className="mt-1 space-y-1">
                              {workflow.triggers.map((trigger, index) => (
                                <li key={index} className="text-gray-600">
                                  • {trigger}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <span className="font-medium text-gray-700">Actions:</span>
                            <ul className="mt-1 space-y-1">
                              {workflow.actions.map((action, index) => (
                                <li key={index} className="text-gray-600">
                                  • {action}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <div className="space-y-2">
                              <div>
                                <span className="font-medium text-gray-700">Last Run:</span>
                                <span className="ml-2 text-gray-600">{workflow.lastRun}</span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-700">Success Rate:</span>
                                <span className="ml-2 text-gray-600">{workflow.successRate}%</span>
                              </div>
                              <Progress value={workflow.successRate} className="h-2" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col space-y-2 ml-6">
                        <Button
                          size="sm"
                          onClick={() => runWorkflow(workflow.id)}
                          disabled={runningWorkflows.has(workflow.id)}
                        >
                          {runningWorkflows.has(workflow.id) ? (
                            <>
                              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                              Running
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Run Now
                            </>
                          )}
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4 mr-2" />
                          Configure
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Analytics Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Integration Performance</CardTitle>
                  <CardDescription>API call volume and response times</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {integrations
                      .filter((i) => i.enabled)
                      .map((integration) => (
                        <div key={integration.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 ${integration.color} rounded flex items-center justify-center`}>
                              <integration.icon className="h-4 w-4 text-white" />
                            </div>
                            <span className="font-medium">{integration.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{integration.apiCalls}</div>
                            <div className="text-sm text-gray-500">calls</div>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Workflow Efficiency</CardTitle>
                  <CardDescription>Success rates and execution times</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {workflows.map((workflow) => (
                      <div key={workflow.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{workflow.name}</span>
                          <span className="text-sm font-semibold">{workflow.successRate}%</span>
                        </div>
                        <Progress value={workflow.successRate} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Usage Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Usage Trends</CardTitle>
                <CardDescription>Integration usage over the past 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">+23%</div>
                    <div className="text-sm text-gray-600">API Calls</div>
                    <div className="text-xs text-green-600">vs last month</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">98.2%</div>
                    <div className="text-sm text-gray-600">Average Uptime</div>
                    <div className="text-xs text-blue-600">this month</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">1.2s</div>
                    <div className="text-sm text-gray-600">Avg Response Time</div>
                    <div className="text-xs text-purple-600">-15% improvement</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
