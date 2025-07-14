"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ReferralAlertSystem } from "@/components/referral-alert-system"
import {
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Mail,
  VoicemailIcon as Fax,
  Building2,
  Phone,
  Download,
  Play,
  Pause,
  Search,
  Filter,
  DollarSign,
  Users,
  FileText,
  Bell,
} from "lucide-react"

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
}

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
    receivedAt: "2024-01-10T14:30:00Z",
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
    receivedAt: "2024-01-10T14:25:00Z",
    processedAt: "2024-01-10T14:26:00Z",
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
    receivedAt: "2024-01-10T14:20:00Z",
    processedAt: "2024-01-10T14:22:00Z",
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
    receivedAt: "2024-01-10T14:15:00Z",
    processedAt: "2024-01-10T14:16:00Z",
  },
  {
    id: "REF-005",
    patientName: "Premium Care Patient",
    diagnosis: "Complex Wound Care with IV Therapy",
    source: "email",
    insurance: "Commercial",
    urgency: "Urgent",
    status: "accepted",
    confidence: 95,
    estimatedValue: 8500, // High-value referral
    receivedAt: "2024-01-10T14:10:00Z",
    processedAt: "2024-01-10T14:11:00Z",
    assignedTo: "Lisa Chen, RN",
  },
]

export default function ReferralDashboard() {
  const [referrals, setReferrals] = useState<Referral[]>(mockReferrals)
  const [isLive, setIsLive] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [sourceFilter, setSourceFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [urgencyFilter, setUrgencyFilter] = useState("all")

  // Simulate live updates
  useEffect(() => {
    if (!isLive) return

    const interval = setInterval(() => {
      // Simulate new referral or status update
      setReferrals((prev) => {
        const updated = [...prev]
        const processingReferrals = updated.filter((r) => r.status === "processing")

        if (processingReferrals.length > 0) {
          const referral = processingReferrals[0]
          const confidence = Math.floor(Math.random() * 40) + 60

          if (confidence >= 85) {
            referral.status = "accepted"
            referral.assignedTo = ["Sarah Johnson, RN", "Mike Davis, LPN", "Lisa Chen, RN"][
              Math.floor(Math.random() * 3)
            ]
          } else if (confidence >= 70) {
            referral.status = "review"
          } else {
            referral.status = "rejected"
            referral.estimatedValue = 0
          }

          referral.confidence = confidence
          referral.processedAt = new Date().toISOString()
        }

        return updated
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [isLive])

  // Filter referrals
  const filteredReferrals = referrals.filter((referral) => {
    const matchesSearch =
      referral.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.insurance.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSource = sourceFilter === "all" || referral.source === sourceFilter
    const matchesStatus = statusFilter === "all" || referral.status === statusFilter
    const matchesUrgency = urgencyFilter === "all" || referral.urgency === urgencyFilter

    return matchesSearch && matchesSource && matchesStatus && matchesUrgency
  })

  // Calculate statistics
  const stats = {
    total: referrals.length,
    accepted: referrals.filter((r) => r.status === "accepted").length,
    review: referrals.filter((r) => r.status === "review").length,
    rejected: referrals.filter((r) => r.status === "rejected").length,
    processing: referrals.filter((r) => r.status === "processing").length,
    totalValue: referrals.filter((r) => r.status === "accepted").reduce((sum, r) => sum + r.estimatedValue, 0),
    acceptanceRate:
      referrals.length > 0 ? (referrals.filter((r) => r.status === "accepted").length / referrals.length) * 100 : 0,
  }

  const sourceBreakdown = {
    email: referrals.filter((r) => r.source === "email").length,
    fax: referrals.filter((r) => r.source === "fax").length,
    extendedcare: referrals.filter((r) => r.source === "extendedcare").length,
    phone: referrals.filter((r) => r.source === "phone").length,
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case "email":
        return <Mail className="h-4 w-4" />
      case "fax":
        return <Fax className="h-4 w-4" />
      case "extendedcare":
        return <Building2 className="h-4 w-4" />
      case "phone":
        return <Phone className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "processing":
        return <Clock className="h-4 w-4 animate-spin" />
      case "accepted":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "review":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "STAT":
        return "bg-red-500"
      case "Urgent":
        return "bg-orange-500"
      case "Routine":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const exportReport = () => {
    const csvContent = [
      [
        "Patient Name",
        "Diagnosis",
        "Source",
        "Insurance",
        "Urgency",
        "Status",
        "Confidence",
        "Value",
        "Received",
        "Processed",
        "Assigned To",
      ],
      ...referrals.map((r) => [
        r.patientName,
        r.diagnosis,
        r.source,
        r.insurance,
        r.urgency,
        r.status,
        r.confidence + "%",
        "$" + r.estimatedValue,
        new Date(r.receivedAt).toLocaleString(),
        r.processedAt ? new Date(r.processedAt).toLocaleString() : "",
        r.assignedTo || "",
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `referral-report-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Live Referral Dashboard</h1>
          <p className="text-muted-foreground">Real-time monitoring and daily reporting with smart alerts</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={isLive ? "destructive" : "default"}
            onClick={() => setIsLive(!isLive)}
            className="flex items-center space-x-2"
          >
            {isLive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            <span>{isLive ? "Pause Live" : "Go Live"}</span>
          </Button>
          <Button variant="outline" onClick={exportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alerts">
            <Bell className="h-4 w-4 mr-2" />
            Smart Alerts
          </TabsTrigger>
          <TabsTrigger value="live">Live Stream</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Daily Reports</TabsTrigger>
        </TabsList>

        {/* Smart Alerts Tab */}
        <TabsContent value="alerts" className="space-y-4">
          <ReferralAlertSystem />
        </TabsContent>

        <TabsContent value="live" className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Today</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.processing > 0 && `${stats.processing} processing`}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Accepted</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.accepted}</div>
                <p className="text-xs text-muted-foreground">{stats.acceptanceRate.toFixed(1)}% acceptance rate</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Under Review</CardTitle>
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.review}</div>
                <p className="text-xs text-muted-foreground">Needs manual review</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rejected</CardTitle>
                <XCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
                <p className="text-xs text-muted-foreground">Did not meet criteria</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Est. Value</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Accepted referrals</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5" />
                <span>Filters & Search</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search patients, diagnosis..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="fax">Fax</SelectItem>
                    <SelectItem value="extendedcare">ExtendedCare</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="accepted">Accepted</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Urgency</SelectItem>
                    <SelectItem value="STAT">STAT</SelectItem>
                    <SelectItem value="Urgent">Urgent</SelectItem>
                    <SelectItem value="Routine">Routine</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("")
                    setSourceFilter("all")
                    setStatusFilter("all")
                    setUrgencyFilter("all")
                  }}
                >
                  Clear All
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Live Referral Stream */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Live Referral Stream</span>
                {isLive && (
                  <Badge variant="destructive" className="animate-pulse">
                    LIVE
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Real-time monitoring of incoming referrals ({filteredReferrals.length} shown)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredReferrals.map((referral) => (
                  <div
                    key={referral.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        {getSourceIcon(referral.source)}
                        {getStatusIcon(referral.status)}
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{referral.patientName}</span>
                          <Badge className={getUrgencyColor(referral.urgency)}>{referral.urgency}</Badge>
                          {referral.estimatedValue >= 5000 && (
                            <Badge variant="outline" className="text-green-600 border-green-600">
                              HIGH VALUE
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{referral.diagnosis}</p>
                        <p className="text-xs text-muted-foreground">
                          {referral.insurance} • {referral.source.toUpperCase()}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant={
                            referral.status === "accepted"
                              ? "default"
                              : referral.status === "review"
                                ? "secondary"
                                : referral.status === "rejected"
                                  ? "destructive"
                                  : "outline"
                          }
                        >
                          {referral.status.toUpperCase()}
                        </Badge>
                        {referral.confidence > 0 && <span className="text-sm font-medium">{referral.confidence}%</span>}
                      </div>

                      {referral.status === "accepted" && (
                        <p className="text-sm text-green-600 font-medium">
                          ${referral.estimatedValue.toLocaleString()}
                        </p>
                      )}

                      {referral.assignedTo && <p className="text-xs text-muted-foreground">→ {referral.assignedTo}</p>}

                      <p className="text-xs text-muted-foreground">
                        {new Date(referral.receivedAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Source Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Referral Sources</CardTitle>
                <CardDescription>Distribution by source channel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>Email</span>
                    </div>
                    <span className="font-medium">{sourceBreakdown.email}</span>
                  </div>
                  <Progress value={(sourceBreakdown.email / stats.total) * 100} className="h-2" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Fax className="h-4 w-4" />
                      <span>Fax</span>
                    </div>
                    <span className="font-medium">{sourceBreakdown.fax}</span>
                  </div>
                  <Progress value={(sourceBreakdown.fax / stats.total) * 100} className="h-2" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4" />
                      <span>ExtendedCare</span>
                    </div>
                    <span className="font-medium">{sourceBreakdown.extendedcare}</span>
                  </div>
                  <Progress value={(sourceBreakdown.extendedcare / stats.total) * 100} className="h-2" />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>Phone</span>
                    </div>
                    <span className="font-medium">{sourceBreakdown.phone}</span>
                  </div>
                  <Progress value={(sourceBreakdown.phone / stats.total) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Today's processing performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Acceptance Rate</span>
                    <span className="font-medium text-green-600">{stats.acceptanceRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={stats.acceptanceRate} className="h-2" />

                  <div className="flex items-center justify-between">
                    <span>Review Rate</span>
                    <span className="font-medium text-yellow-600">
                      {((stats.review / stats.total) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={(stats.review / stats.total) * 100} className="h-2" />

                  <div className="flex items-center justify-between">
                    <span>Avg Processing Time</span>
                    <span className="font-medium">1.3 seconds</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span>Total Value</span>
                    <span className="font-medium text-green-600">${stats.totalValue.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Daily Summary Report</CardTitle>
              <CardDescription>Complete breakdown of today's referral activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Volume Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Referrals:</span>
                      <span className="font-medium">{stats.total}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Accepted:</span>
                      <span className="font-medium text-green-600">{stats.accepted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Under Review:</span>
                      <span className="font-medium text-yellow-600">{stats.review}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rejected:</span>
                      <span className="font-medium text-red-600">{stats.rejected}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Source Breakdown</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Email:</span>
                      <span className="font-medium">
                        {sourceBreakdown.email} ({((sourceBreakdown.email / stats.total) * 100).toFixed(0)}%)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fax:</span>
                      <span className="font-medium">
                        {sourceBreakdown.fax} ({((sourceBreakdown.fax / stats.total) * 100).toFixed(0)}%)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>ExtendedCare:</span>
                      <span className="font-medium">
                        {sourceBreakdown.extendedcare} (
                        {((sourceBreakdown.extendedcare / stats.total) * 100).toFixed(0)}%)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Phone:</span>
                      <span className="font-medium">
                        {sourceBreakdown.phone} ({((sourceBreakdown.phone / stats.total) * 100).toFixed(0)}%)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Financial Impact</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Total Est. Value:</span>
                      <span className="font-medium text-green-600">${stats.totalValue.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg per Referral:</span>
                      <span className="font-medium">
                        ${stats.accepted > 0 ? Math.round(stats.totalValue / stats.accepted).toLocaleString() : "0"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Acceptance Rate:</span>
                      <span className="font-medium">{stats.acceptanceRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Processing Time:</span>
                      <span className="font-medium">1.3s avg</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Export Options</h3>
                    <p className="text-sm text-muted-foreground">Download detailed reports for stakeholders</p>
                  </div>
                  <Button onClick={exportReport}>
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
