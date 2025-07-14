"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  ArrowLeft,
  Upload,
  FileText,
  Check,
  X,
  Clock,
  Brain,
  UserPlus,
  Inbox,
  Send,
  Shield,
  RefreshCw,
  Zap,
  Building2,
} from "lucide-react"
import Link from "next/link"
import { AuthorizationTracker } from "@/components/authorization-tracker"
import { getCurrentUser, hasPermission } from "@/lib/auth"
import type { Referral } from "@/lib/extendedcare-api"
import { extendedCareApi } from "@/lib/extendedcare-api"

const initialReferrals: Referral[] = [
  {
    id: "REF-001",
    patientName: "Brenda Smith",
    referralDate: "2024-07-09",
    referralSource: "Mercy Hospital",
    diagnosis: "Post-operative care for hip replacement",
    insuranceProvider: "Medicare",
    insuranceId: "MCR-12345",
    status: "New",
    aiRecommendation: "Approve",
    aiReason: "Standard post-op case with high approval chance.",
  },
  {
    id: "REF-FAX-001",
    patientName: "John Smith",
    referralDate: "2024-07-10",
    referralSource: "Fax Upload",
    diagnosis: "Diabetes with complications, Hypertension",
    insuranceProvider: "Medicare Part A",
    insuranceId: "123456789A",
    status: "New",
    aiRecommendation: "Approve",
    aiReason: "Fax content meets all acceptance criteria.",
  },
  {
    id: "REF-EMAIL-001",
    patientName: "Emily White",
    referralDate: "2024-07-10",
    referralSource: "Email from case.manager@clinic.com",
    diagnosis: "Skilled nursing for wound care",
    insuranceProvider: "Cigna",
    insuranceId: "CG-98765",
    status: "New",
    aiRecommendation: "Review",
    aiReason: "Commercial insurance, verify benefits before approval.",
  },
  {
    id: "REF-003",
    patientName: "Jane Miller",
    referralDate: "2024-07-07",
    referralSource: "Community Clinic",
    diagnosis: "Wound care for diabetic ulcer",
    insuranceProvider: "United Healthcare",
    insuranceId: "UHC-54321",
    status: "Pending Auth",
  },
  {
    id: "REF-004",
    patientName: "Peter Jones",
    referralDate: "2024-07-06",
    referralSource: "Mercy Hospital",
    diagnosis: "CHF Management",
    insuranceProvider: "Medicare",
    insuranceId: "MCR-11223",
    status: "Approved",
    socDueDate: "2024-07-13",
  },
  // ExtendedCare referrals
  {
    id: "REF-EC-001",
    patientName: "Sarah Johnson",
    referralDate: "2024-07-10",
    referralSource: "ExtendedCare Network",
    diagnosis: "Post-surgical wound care",
    insuranceProvider: "Medicare Advantage",
    insuranceId: "MA-78901",
    status: "New",
    aiRecommendation: "Approve",
    aiReason: "High-value Medicare Advantage case with good reimbursement.",
  },
  {
    id: "REF-EC-002",
    patientName: "Robert Davis",
    referralDate: "2024-07-10",
    referralSource: "ExtendedCare Network",
    diagnosis: "Diabetes management and education",
    insuranceProvider: "Humana",
    insuranceId: "HUM-45678",
    status: "New",
    aiRecommendation: "Review",
    aiReason: "Requires verification of diabetes education certification.",
  },
]

export default function ReferralManagementPage() {
  const [referrals, setReferrals] = useState<Referral[]>(initialReferrals)
  const [activeTab, setActiveTab] = useState("new")
  const [isLoadingExtendedCare, setIsLoadingExtendedCare] = useState(false)
  const [extendedCareStatus, setExtendedCareStatus] = useState<"connected" | "disconnected" | "syncing">("connected")
  const [lastSyncTime, setLastSyncTime] = useState<string>("2024-07-10 10:30 AM")

  // Get current user and check permissions
  const currentUser = getCurrentUser()
  const canViewAuthorizations =
    hasPermission(currentUser, "authorization", "read") || hasPermission(currentUser, "authorization", "track")
  const canManageAuthorizations = hasPermission(currentUser, "authorization", "write")

  const filteredReferrals = useMemo(() => {
    const statusMap = {
      new: "New",
      pending: "Pending Auth",
      approved: "Approved",
      denied: "Denied",
    }
    return referrals.filter((r) => r.status === statusMap[activeTab])
  }, [referrals, activeTab])

  // ExtendedCare referrals count
  const extendedCareReferrals = referrals.filter((r) => r.referralSource === "ExtendedCare Network")

  const syncWithExtendedCare = async () => {
    setIsLoadingExtendedCare(true)
    setExtendedCareStatus("syncing")

    try {
      // Simulate fetching new referrals from ExtendedCare
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock new referrals from ExtendedCare
      const newReferrals: Referral[] = [
        {
          id: `REF-EC-${Date.now()}`,
          patientName: "Maria Rodriguez",
          referralDate: new Date().toISOString().split("T")[0],
          referralSource: "ExtendedCare Network",
          diagnosis: "Post-stroke rehabilitation",
          insuranceProvider: "Medicare",
          insuranceId: "MCR-99887",
          status: "New",
          aiRecommendation: "Approve",
          aiReason: "Standard Medicare case with good coverage for PT/OT services.",
        },
      ]

      setReferrals((prev) => [...newReferrals, ...prev])
      setExtendedCareStatus("connected")
      setLastSyncTime(new Date().toLocaleString())
    } catch (error) {
      setExtendedCareStatus("disconnected")
      console.error("Failed to sync with ExtendedCare:", error)
    } finally {
      setIsLoadingExtendedCare(false)
    }
  }

  const processExtendedCareReferral = async (referralId: string) => {
    const referral = referrals.find((r) => r.id === referralId)
    if (!referral) return

    try {
      // Check eligibility through ExtendedCare
      const eligibilityResult = await extendedCareApi.checkEligibility(referralId, referral.insuranceId)

      if (eligibilityResult.isEligible) {
        // Auto-approve if meets criteria
        if (referral.aiRecommendation === "Approve") {
          handleApprove(referralId)
        } else {
          // Request prior auth if needed
          const priorAuthResult = await extendedCareApi.submitPriorAuth(referralId, ["skilled_nursing"])
          if (priorAuthResult.success) {
            handleRequestAuth(referralId)
          }
        }
      } else {
        handleDeny(referralId)
      }
    } catch (error) {
      console.error("Failed to process ExtendedCare referral:", error)
    }
  }

  const handleApprove = (id: string) => {
    setReferrals((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const socDueDate = new Date()
          socDueDate.setDate(socDueDate.getDate() + 5) // Set SOC due in 5 days
          return { ...r, status: "Approved", socDueDate: socDueDate.toISOString().split("T")[0] }
        }
        return r
      }),
    )
  }

  const handleDeny = (id: string) => {
    setReferrals((prev) => prev.map((r) => (r.id === id ? { ...r, status: "Denied" } : r)))
  }

  const handleRequestAuth = (id: string) => {
    setReferrals((prev) => prev.map((r) => (r.id === id ? { ...r, status: "Pending Auth" } : r)))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-800"
      case "Pending Auth":
        return "bg-yellow-100 text-yellow-800"
      case "Approved":
        return "bg-green-100 text-green-800"
      case "Denied":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getReferralSourceBadge = (source: string) => {
    if (source === "ExtendedCare Network") {
      return <Badge className="bg-purple-100 text-purple-800 ml-2">ExtendedCare</Badge>
    }
    if (source === "Fax Upload") {
      return <Badge className="bg-gray-100 text-gray-800 ml-2">Fax</Badge>
    }
    if (source.startsWith("Email from")) {
      return <Badge className="bg-teal-100 text-teal-800 ml-2">Email</Badge>
    }
    return null
  }

  // Determine available tabs based on permissions
  const availableTabs = ["referrals"]
  if (canViewAuthorizations) {
    availableTabs.push("authorizations")
  }

  // Auto-sync every 5 minutes
  useEffect(() => {
    const interval = setInterval(
      () => {
        if (extendedCareStatus === "connected") {
          syncWithExtendedCare()
        }
      },
      5 * 60 * 1000,
    ) // 5 minutes

    return () => clearInterval(interval)
  }, [extendedCareStatus])

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/patient-tracking">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Patient Tracking
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Referral Management Center</h1>
              <p className="text-gray-600">
                Process incoming referrals with AI-powered decision support and authorization tracking.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {currentUser.role.name}
            </Badge>
            {canViewAuthorizations && (
              <Badge variant="outline" className="bg-green-50 text-green-700">
                <Shield className="h-3 w-3 mr-1" />
                Authorization Access
              </Badge>
            )}
            <Badge
              variant="outline"
              className={`${extendedCareStatus === "connected" ? "bg-green-50 text-green-700" : extendedCareStatus === "syncing" ? "bg-yellow-50 text-yellow-700" : "bg-red-50 text-red-700"}`}
            >
              <Building2 className="h-3 w-3 mr-1" />
              ExtendedCare{" "}
              {extendedCareStatus === "connected"
                ? "Connected"
                : extendedCareStatus === "syncing"
                  ? "Syncing..."
                  : "Disconnected"}
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ExtendedCare Integration Status */}
        <div className="mb-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">ExtendedCare Integration</CardTitle>
                    <CardDescription>
                      {extendedCareReferrals.length} referrals from ExtendedCare Network • Last sync: {lastSyncTime}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={syncWithExtendedCare} disabled={isLoadingExtendedCare}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${isLoadingExtendedCare ? "animate-spin" : ""}`} />
                    {isLoadingExtendedCare ? "Syncing..." : "Sync Now"}
                  </Button>
                  <Link href="/integrations/extendedcare-setup">
                    <Button variant="ghost" size="sm">
                      Configure
                    </Button>
                  </Link>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={`grid w-full ${availableTabs.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
            <TabsTrigger value="referrals">Referral Processing</TabsTrigger>
            {canViewAuthorizations && (
              <TabsTrigger value="authorizations">
                Authorization Tracking
                {canManageAuthorizations && <Badge className="ml-2 bg-blue-500 text-white text-xs">Manage</Badge>}
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="referrals" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Tabs value={activeTab === "referrals" ? "new" : activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="new">
                      New Referrals ({referrals.filter((r) => r.status === "New").length})
                    </TabsTrigger>
                    <TabsTrigger value="pending">
                      Pending Auth ({referrals.filter((r) => r.status === "Pending Auth").length})
                    </TabsTrigger>
                    <TabsTrigger value="approved">
                      Approved ({referrals.filter((r) => r.status === "Approved").length})
                    </TabsTrigger>
                    <TabsTrigger value="denied">
                      Denied ({referrals.filter((r) => r.status === "Denied").length})
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value={activeTab} className="mt-6">
                    <div className="space-y-4">
                      {filteredReferrals.length > 0 ? (
                        filteredReferrals.map((referral) => (
                          <Card key={referral.id}>
                            <CardHeader>
                              <div className="flex justify-between items-start">
                                <div>
                                  <CardTitle className="flex items-center">
                                    {referral.patientName}
                                    {getReferralSourceBadge(referral.referralSource)}
                                  </CardTitle>
                                  <CardDescription>
                                    Referred from: {referral.referralSource} on {referral.referralDate}
                                  </CardDescription>
                                </div>
                                <Badge className={getStatusColor(referral.status)}>{referral.status}</Badge>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                                <div>
                                  <span className="font-medium">Diagnosis:</span> {referral.diagnosis}
                                </div>
                                <div>
                                  <span className="font-medium">Insurance:</span> {referral.insuranceProvider} (
                                  {referral.insuranceId})
                                </div>
                              </div>
                              {referral.aiRecommendation && (
                                <Alert
                                  className={`mb-4 ${referral.aiRecommendation === "Approve" ? "bg-green-50 border-green-200" : referral.aiRecommendation === "Deny" ? "bg-red-50 border-red-200" : "bg-yellow-50 border-yellow-200"}`}
                                >
                                  <Brain className="h-4 w-4" />
                                  <AlertTitle className="flex items-center gap-2">
                                    AI Recommendation:
                                    <span
                                      className={`font-bold ${referral.aiRecommendation === "Approve" ? "text-green-700" : referral.aiRecommendation === "Deny" ? "text-red-700" : "text-yellow-700"}`}
                                    >
                                      {referral.aiRecommendation}
                                    </span>
                                  </AlertTitle>
                                  <AlertDescription>{referral.aiReason}</AlertDescription>
                                </Alert>
                              )}
                              {referral.status === "New" && (
                                <div className="flex space-x-2">
                                  <Button size="sm" onClick={() => handleApprove(referral.id)}>
                                    <Check className="h-4 w-4 mr-2" />
                                    Approve
                                  </Button>
                                  <Button size="sm" variant="destructive" onClick={() => handleDeny(referral.id)}>
                                    <X className="h-4 w-4 mr-2" />
                                    Deny
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => handleRequestAuth(referral.id)}>
                                    <Send className="h-4 w-4 mr-2" />
                                    Request Prior Auth
                                  </Button>
                                  {referral.referralSource === "ExtendedCare Network" && (
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      onClick={() => processExtendedCareReferral(referral.id)}
                                    >
                                      <Zap className="h-4 w-4 mr-2" />
                                      Auto-Process
                                    </Button>
                                  )}
                                </div>
                              )}
                              {referral.status === "Pending Auth" && (
                                <div className="flex items-center text-yellow-700 text-sm">
                                  <Clock className="h-4 w-4 mr-2" />
                                  Prior authorization submitted. Awaiting response from payer.
                                </div>
                              )}
                              {referral.status === "Approved" && (
                                <div className="flex items-center text-green-700 text-sm">
                                  <Check className="h-4 w-4 mr-2" />
                                  Patient admitted. SOC due by {referral.socDueDate}.
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <div className="text-center py-12 text-gray-500">
                          <Inbox className="h-12 w-12 mx-auto mb-4" />
                          <p>No referrals in this category.</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="space-y-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Upload className="h-5 w-5 mr-2" /> Process Faxed Referral
                    </CardTitle>
                    <CardDescription>Upload a referral document to process it automatically.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                        <FileText className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                        <Label htmlFor="fax-upload" className="text-blue-600 font-medium cursor-pointer">
                          Choose a file
                          <Input id="fax-upload" type="file" className="sr-only" />
                        </Label>
                        <p className="text-xs text-gray-500 mt-1">or drag and drop PDF, PNG, or JPG</p>
                      </div>
                      <Button className="w-full">
                        <Brain className="h-4 w-4 mr-2" />
                        Process with AI-OCR
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <UserPlus className="h-5 w-5 mr-2" /> Manual Referral Entry
                    </CardTitle>
                    <CardDescription>Enter referral details manually.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="manual-name">Patient Name</Label>
                      <Input id="manual-name" placeholder="John Smith" />
                    </div>
                    <div>
                      <Label htmlFor="manual-insurance">Insurance Provider</Label>
                      <Input id="manual-insurance" placeholder="Medicare" />
                    </div>
                    <div>
                      <Label htmlFor="manual-diagnosis">Primary Diagnosis</Label>
                      <Input id="manual-diagnosis" placeholder="Post-operative care" />
                    </div>
                    <Button className="w-full">Submit Referral</Button>
                  </CardContent>
                </Card>

                {/* ExtendedCare Quick Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Building2 className="h-5 w-5 mr-2" /> ExtendedCare Stats
                    </CardTitle>
                    <CardDescription>Today's referral activity from ExtendedCare Network</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">New Referrals</span>
                      <Badge variant="secondary">
                        {extendedCareReferrals.filter((r) => r.status === "New").length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Auto-Approved</span>
                      <Badge className="bg-green-100 text-green-800">
                        {extendedCareReferrals.filter((r) => r.status === "Approved").length}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Pending Review</span>
                      <Badge className="bg-yellow-100 text-yellow-800">
                        {extendedCareReferrals.filter((r) => r.aiRecommendation === "Review").length}
                      </Badge>
                    </div>
                    <div className="pt-2 border-t">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        View ExtendedCare Dashboard
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {canViewAuthorizations && (
            <TabsContent value="authorizations" className="space-y-6">
              <div className="mb-6">
                <Alert className="border-blue-200 bg-blue-50">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <AlertTitle className="text-blue-800">Authorization Access</AlertTitle>
                  <AlertDescription className="text-blue-700">
                    You have {canManageAuthorizations ? "full management" : "view-only"} access to authorization
                    tracking.
                    {canManageAuthorizations
                      ? " You can view, update, and manage all authorization requests."
                      : " You can view authorization status and history but cannot make changes."}
                  </AlertDescription>
                </Alert>
              </div>

              <AuthorizationTracker
                showAllPatients={true}
                readOnly={!canManageAuthorizations}
                userRole={currentUser.role.name}
              />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  )
}
