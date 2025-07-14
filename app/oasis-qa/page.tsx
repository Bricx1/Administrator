"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  CheckCircle,
  AlertTriangle,
  User,
  FileText,
  Brain,
  Stethoscope,
  UserCheck,
  ClipboardCheck,
  Eye,
  Download,
  RefreshCw,
  TrendingUp,
  Activity,
  DollarSign,
  AlertCircle,
  Lightbulb,
  Calculator,
  Zap,
} from "lucide-react"

interface OasisRecord {
  id: string
  patientName: string
  assessmentType: string
  clinician: string
  submissionDate: string
  aiScore: number
  qualityFlags: number
  status: "pending_ai" | "pending_qa_rn" | "pending_clinical_director" | "approved" | "revision_needed"
  priority: "low" | "medium" | "high" | "urgent"
  approvalLevel: "qa_rn" | "clinical_director" | "both"
  dueDate: string
  financialImpact?: {
    currentReimbursement: number
    optimizedReimbursement: number
    potentialIncrease: number
    riskAdjustment: number
  }
  riskFactors?: {
    clinical: string[]
    financial: string[]
    compliance: string[]
    riskScore: number
  }
  treatmentSuggestions?: {
    primary: string[]
    secondary: string[]
    preventive: string[]
  }
  autoCoding?: {
    icdCodes: { code: string; description: string; confidence: number }[]
    hccCodes: { code: string; description: string; riskWeight: number }[]
    caseMixIndex: number
    reimbursementCategory: string
  }
}

interface ApprovalAction {
  recordId: string
  action: "approve" | "reject" | "request_revision"
  comments: string
  approverType: "qa_rn" | "clinical_director"
}

export default function OasisQAPage() {
  const [records, setRecords] = useState<OasisRecord[]>([])
  const [selectedRecord, setSelectedRecord] = useState<OasisRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [approvalComments, setApprovalComments] = useState("")
  const [selectedApprover, setSelectedApprover] = useState<"qa_rn" | "clinical_director">("qa_rn")
  const [activeTab, setActiveTab] = useState("dashboard")

  // Mock data - in production, fetch from API
  useEffect(() => {
    const mockRecords: OasisRecord[] = [
      {
        id: "OASIS-2024-001",
        patientName: "Margaret Anderson",
        assessmentType: "Start of Care",
        clinician: "Sarah Johnson, RN",
        submissionDate: "2024-01-16",
        aiScore: 87,
        qualityFlags: 2,
        status: "pending_qa_rn",
        priority: "medium",
        approvalLevel: "both",
        dueDate: "2024-01-17T14:00:00Z",
        financialImpact: {
          currentReimbursement: 2850,
          optimizedReimbursement: 3420,
          potentialIncrease: 570,
          riskAdjustment: 1.2,
        },
        riskFactors: {
          clinical: ["Diabetes with complications", "Fall risk", "Medication non-compliance"],
          financial: ["Under-documented comorbidities", "Missing HCC codes"],
          compliance: ["Incomplete functional assessment", "Missing physician signature"],
          riskScore: 7.8,
        },
        treatmentSuggestions: {
          primary: [
            "Intensive diabetes management program",
            "Fall prevention protocol implementation",
            "Medication adherence monitoring",
          ],
          secondary: ["Nutritional counseling referral", "Physical therapy evaluation", "Home safety assessment"],
          preventive: ["Regular A1C monitoring", "Annual eye exam scheduling", "Foot care education"],
        },
        autoCoding: {
          icdCodes: [
            { code: "E11.9", description: "Type 2 diabetes mellitus without complications", confidence: 0.95 },
            { code: "Z87.891", description: "Personal history of nicotine dependence", confidence: 0.88 },
            { code: "I10", description: "Essential hypertension", confidence: 0.92 },
          ],
          hccCodes: [
            { code: "HCC18", description: "Diabetes with Chronic Complications", riskWeight: 0.318 },
            { code: "HCC85", description: "Congestive Heart Failure", riskWeight: 0.323 },
          ],
          caseMixIndex: 1.24,
          reimbursementCategory: "High Complexity",
        },
      },
      {
        id: "OASIS-2024-002",
        patientName: "Robert Thompson",
        assessmentType: "Recertification",
        clinician: "Michael Chen, PT",
        submissionDate: "2024-01-15",
        aiScore: 92,
        qualityFlags: 1,
        status: "pending_clinical_director",
        priority: "low",
        approvalLevel: "clinical_director",
        dueDate: "2024-01-17T18:00:00Z",
        financialImpact: {
          currentReimbursement: 3200,
          optimizedReimbursement: 3650,
          potentialIncrease: 450,
          riskAdjustment: 1.15,
        },
        riskFactors: {
          clinical: ["COPD exacerbation risk", "Mobility limitations"],
          financial: ["Potential for higher case mix"],
          compliance: ["Documentation completeness"],
          riskScore: 6.2,
        },
        treatmentSuggestions: {
          primary: ["Pulmonary rehabilitation", "Mobility enhancement program"],
          secondary: ["Respiratory therapy", "Occupational therapy evaluation"],
          preventive: ["Vaccination updates", "Smoking cessation counseling"],
        },
        autoCoding: {
          icdCodes: [
            {
              code: "J44.1",
              description: "Chronic obstructive pulmonary disease with acute exacerbation",
              confidence: 0.91,
            },
            { code: "M79.3", description: "Panniculitis, unspecified", confidence: 0.76 },
          ],
          hccCodes: [{ code: "HCC111", description: "Chronic Obstructive Pulmonary Disease", riskWeight: 0.335 }],
          caseMixIndex: 1.18,
          reimbursementCategory: "Medium-High Complexity",
        },
      },
    ]

    setTimeout(() => {
      setRecords(mockRecords)
      setLoading(false)
    }, 1000)
  }, [])

  const handleApproval = async (action: ApprovalAction) => {
    try {
      const response = await fetch("/api/workflows/qa-approval", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action:
            action.action === "approve"
              ? action.approverType === "qa_rn"
                ? "qa_rn_approve"
                : "clinical_director_approve"
              : action.approverType === "qa_rn"
                ? "qa_rn_reject"
                : "clinical_director_reject",
          documentId: action.recordId,
          reviewerId: action.approverType === "qa_rn" ? "QA-001" : "CD-001",
          reviewerName: action.approverType === "qa_rn" ? "Jennifer Adams, RN" : "Dr. Michael Rodriguez",
          reviewerCredentials: action.approverType === "qa_rn" ? "RN, BSN, COS-C" : "MD, Internal Medicine",
          reviewerType: action.approverType,
          comments: action.comments,
        }),
      })

      if (response.ok) {
        setRecords((prev) =>
          prev.map((record) =>
            record.id === action.recordId
              ? {
                  ...record,
                  status:
                    action.action === "approve"
                      ? action.approverType === "clinical_director"
                        ? "approved"
                        : "pending_clinical_director"
                      : "revision_needed",
                }
              : record,
          ),
        )
        setApprovalComments("")
        setSelectedRecord(null)
      }
    } catch (error) {
      console.error("Approval action failed:", error)
    }
  }

  const getStatusBadge = (status: OasisRecord["status"]) => {
    const statusConfig = {
      pending_ai: { color: "bg-blue-100 text-blue-800", icon: Brain, text: "AI Analysis" },
      pending_qa_rn: { color: "bg-yellow-100 text-yellow-800", icon: UserCheck, text: "QA RN Review" },
      pending_clinical_director: {
        color: "bg-orange-100 text-orange-800",
        icon: Stethoscope,
        text: "Clinical Director",
      },
      approved: { color: "bg-green-100 text-green-800", icon: CheckCircle, text: "Approved" },
      revision_needed: { color: "bg-red-100 text-red-800", icon: AlertTriangle, text: "Needs Revision" },
    }

    const config = statusConfig[status]
    const Icon = config.icon

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: OasisRecord["priority"]) => {
    const priorityConfig = {
      low: "bg-gray-100 text-gray-800",
      medium: "bg-blue-100 text-blue-800",
      high: "bg-orange-100 text-orange-800",
      urgent: "bg-red-100 text-red-800",
    }

    return <Badge className={priorityConfig[priority]}>{priority.toUpperCase()}</Badge>
  }

  const dashboardStats = {
    totalRecords: records.length,
    pendingQaRn: records.filter((r) => r.status === "pending_qa_rn").length,
    pendingClinicalDirector: records.filter((r) => r.status === "pending_clinical_director").length,
    approved: records.filter((r) => r.status === "approved").length,
    averageScore: Math.round(records.reduce((sum, r) => sum + r.aiScore, 0) / records.length),
    complianceRate: Math.round((records.filter((r) => r.aiScore >= 85).length / records.length) * 100),
    totalFinancialImpact: records.reduce((sum, r) => sum + (r.financialImpact?.potentialIncrease || 0), 0),
    averageRiskScore: records.reduce((sum, r) => sum + (r.riskFactors?.riskScore || 0), 0) / records.length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading Enhanced OASIS QA Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Enhanced OASIS Quality Assurance</h1>
          <p className="text-muted-foreground">
            AI-Powered QA with Auto-Coding, Risk Assessment & Financial Optimization
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync Axxess
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="pending-qa">QA Review</TabsTrigger>
          <TabsTrigger value="financial">Financial Impact</TabsTrigger>
          <TabsTrigger value="risk-assessment">Risk Assessment</TabsTrigger>
          <TabsTrigger value="auto-coding">Auto-Coding</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Enhanced Dashboard Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Records</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardStats.totalRecords}</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Financial Impact</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ${dashboardStats.totalFinancialImpact.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">Potential monthly increase</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Risk Score</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{dashboardStats.averageRiskScore.toFixed(1)}</div>
                <p className="text-xs text-muted-foreground">Out of 10.0 scale</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Auto-Coding Rate</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">94%</div>
                <p className="text-xs text-muted-foreground">Successful auto-coding</p>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent OASIS Submissions with AI Enhancement
              </CardTitle>
              <CardDescription>Latest submissions with financial optimization and risk assessment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {records.slice(0, 5).map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <User className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{record.patientName}</p>
                        <p className="text-sm text-muted-foreground">
                          {record.assessmentType} • {record.clinician}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className="bg-green-100 text-green-800 text-xs">
                            +${record.financialImpact?.potentialIncrease}
                          </Badge>
                          <Badge className="bg-orange-100 text-orange-800 text-xs">
                            Risk: {record.riskFactors?.riskScore}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <Brain className="h-4 w-4" />
                          <span className="font-medium">{record.aiScore}%</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{record.qualityFlags} flags</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        {getStatusBadge(record.status)}
                        {getPriorityBadge(record.priority)}
                      </div>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedRecord(record)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Enhanced OASIS Review - {record.patientName}</DialogTitle>
                            <DialogDescription>
                              {record.assessmentType} • Submitted by {record.clinician}
                            </DialogDescription>
                          </DialogHeader>

                          {selectedRecord && (
                            <div className="space-y-6">
                              {/* Financial Impact Analysis */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="h-5 w-5" />
                                    Financial Impact Analysis
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div className="grid grid-cols-4 gap-4">
                                    <div className="text-center">
                                      <div className="text-xl font-bold text-gray-600">
                                        ${selectedRecord.financialImpact?.currentReimbursement.toLocaleString()}
                                      </div>
                                      <p className="text-sm text-muted-foreground">Current</p>
                                    </div>
                                    <div className="text-center">
                                      <div className="text-xl font-bold text-blue-600">
                                        ${selectedRecord.financialImpact?.optimizedReimbursement.toLocaleString()}
                                      </div>
                                      <p className="text-sm text-muted-foreground">Optimized</p>
                                    </div>
                                    <div className="text-center">
                                      <div className="text-xl font-bold text-green-600">
                                        +${selectedRecord.financialImpact?.potentialIncrease.toLocaleString()}
                                      </div>
                                      <p className="text-sm text-muted-foreground">Increase</p>
                                    </div>
                                    <div className="text-center">
                                      <div className="text-xl font-bold text-purple-600">
                                        {selectedRecord.financialImpact?.riskAdjustment}x
                                      </div>
                                      <p className="text-sm text-muted-foreground">Risk Adj.</p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Auto-Coding Results */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="flex items-center gap-2">
                                    <Calculator className="h-5 w-5" />
                                    AI Auto-Coding Results
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div className="grid grid-cols-2 gap-6">
                                    <div>
                                      <Label className="font-medium">ICD-10 Codes</Label>
                                      <div className="space-y-2 mt-2">
                                        {selectedRecord.autoCoding?.icdCodes.map((code, index) => (
                                          <div
                                            key={index}
                                            className="flex items-center justify-between p-2 bg-blue-50 rounded"
                                          >
                                            <div>
                                              <span className="font-mono text-sm font-medium">{code.code}</span>
                                              <p className="text-xs text-gray-600">{code.description}</p>
                                            </div>
                                            <Badge className="bg-blue-100 text-blue-800">
                                              {Math.round(code.confidence * 100)}%
                                            </Badge>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="font-medium">HCC Codes</Label>
                                      <div className="space-y-2 mt-2">
                                        {selectedRecord.autoCoding?.hccCodes.map((code, index) => (
                                          <div
                                            key={index}
                                            className="flex items-center justify-between p-2 bg-green-50 rounded"
                                          >
                                            <div>
                                              <span className="font-mono text-sm font-medium">{code.code}</span>
                                              <p className="text-xs text-gray-600">{code.description}</p>
                                            </div>
                                            <Badge className="bg-green-100 text-green-800">{code.riskWeight}</Badge>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                    <div>
                                      <Label className="font-medium">Case Mix Index</Label>
                                      <div className="text-2xl font-bold text-purple-600">
                                        {selectedRecord.autoCoding?.caseMixIndex}
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="font-medium">Reimbursement Category</Label>
                                      <Badge className="bg-purple-100 text-purple-800 mt-1">
                                        {selectedRecord.autoCoding?.reimbursementCategory}
                                      </Badge>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Risk Assessment */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="flex items-center gap-2">
                                    <AlertCircle className="h-5 w-5" />
                                    Patient Risk Assessment
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div className="grid grid-cols-3 gap-4">
                                    <div>
                                      <Label className="font-medium text-red-600">Clinical Risks</Label>
                                      <div className="space-y-1 mt-2">
                                        {selectedRecord.riskFactors?.clinical.map((risk, index) => (
                                          <div key={index} className="text-sm p-2 bg-red-50 rounded">
                                            {risk}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="font-medium text-orange-600">Financial Risks</Label>
                                      <div className="space-y-1 mt-2">
                                        {selectedRecord.riskFactors?.financial.map((risk, index) => (
                                          <div key={index} className="text-sm p-2 bg-orange-50 rounded">
                                            {risk}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="font-medium text-yellow-600">Compliance Risks</Label>
                                      <div className="space-y-1 mt-2">
                                        {selectedRecord.riskFactors?.compliance.map((risk, index) => (
                                          <div key={index} className="text-sm p-2 bg-yellow-50 rounded">
                                            {risk}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-center pt-4 border-t">
                                    <div className="text-3xl font-bold text-orange-600">
                                      {selectedRecord.riskFactors?.riskScore}/10
                                    </div>
                                    <p className="text-sm text-muted-foreground">Overall Risk Score</p>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Treatment Suggestions */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="flex items-center gap-2">
                                    <Lightbulb className="h-5 w-5" />
                                    AI Treatment Plan Suggestions
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div className="grid grid-cols-3 gap-4">
                                    <div>
                                      <Label className="font-medium text-blue-600">Primary Interventions</Label>
                                      <div className="space-y-1 mt-2">
                                        {selectedRecord.treatmentSuggestions?.primary.map((suggestion, index) => (
                                          <div key={index} className="text-sm p-2 bg-blue-50 rounded">
                                            {suggestion}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="font-medium text-green-600">Secondary Interventions</Label>
                                      <div className="space-y-1 mt-2">
                                        {selectedRecord.treatmentSuggestions?.secondary.map((suggestion, index) => (
                                          <div key={index} className="text-sm p-2 bg-green-50 rounded">
                                            {suggestion}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="font-medium text-purple-600">Preventive Measures</Label>
                                      <div className="space-y-1 mt-2">
                                        {selectedRecord.treatmentSuggestions?.preventive.map((suggestion, index) => (
                                          <div key={index} className="text-sm p-2 bg-purple-50 rounded">
                                            {suggestion}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* AI Analysis Results */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="flex items-center gap-2">
                                    <Brain className="h-5 w-5" />
                                    AI Quality Analysis
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center">
                                      <div className="text-2xl font-bold text-blue-600">{selectedRecord.aiScore}%</div>
                                      <p className="text-sm text-muted-foreground">Overall Score</p>
                                    </div>
                                    <div className="text-center">
                                      <div className="text-2xl font-bold text-orange-600">
                                        {selectedRecord.qualityFlags}
                                      </div>
                                      <p className="text-sm text-muted-foreground">Quality Flags</p>
                                    </div>
                                    <div className="text-center">
                                      <div className="text-2xl font-bold text-green-600">94%</div>
                                      <p className="text-sm text-muted-foreground">Completeness</p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Approval Actions */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="flex items-center gap-2">
                                    <ClipboardCheck className="h-5 w-5" />
                                    Clinical Approval Required
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="approver-type">Approver Role</Label>
                                      <Select
                                        value={selectedApprover}
                                        onValueChange={(value: "qa_rn" | "clinical_director") =>
                                          setSelectedApprover(value)
                                        }
                                      >
                                        <SelectTrigger>
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="qa_rn">QA RN</SelectItem>
                                          <SelectItem value="clinical_director">Clinical Director</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <Label>Required Approval Level</Label>
                                      <div className="flex items-center gap-2 mt-2">
                                        {selectedRecord.approvalLevel === "both" ? (
                                          <>
                                            <Badge className="bg-yellow-100 text-yellow-800">QA RN</Badge>
                                            <span>+</span>
                                            <Badge className="bg-orange-100 text-orange-800">Clinical Director</Badge>
                                          </>
                                        ) : (
                                          <Badge
                                            className={
                                              selectedRecord.approvalLevel === "qa_rn"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : "bg-orange-100 text-orange-800"
                                            }
                                          >
                                            {selectedRecord.approvalLevel === "qa_rn" ? "QA RN" : "Clinical Director"}
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div>
                                    <Label htmlFor="approval-comments">Clinical Comments</Label>
                                    <Textarea
                                      id="approval-comments"
                                      placeholder="Enter your clinical assessment and any recommendations..."
                                      value={approvalComments}
                                      onChange={(e) => setApprovalComments(e.target.value)}
                                      className="mt-2"
                                      rows={4}
                                    />
                                  </div>

                                  <div className="flex gap-2">
                                    <Button
                                      className="flex-1"
                                      onClick={() =>
                                        handleApproval({
                                          recordId: selectedRecord.id,
                                          action: "approve",
                                          comments: approvalComments,
                                          approverType: selectedApprover,
                                        })
                                      }
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Approve & Submit
                                    </Button>
                                    <Button
                                      variant="outline"
                                      className="flex-1 bg-transparent"
                                      onClick={() =>
                                        handleApproval({
                                          recordId: selectedRecord.id,
                                          action: "request_revision",
                                          comments: approvalComments,
                                          approverType: selectedApprover,
                                        })
                                      }
                                    >
                                      <AlertTriangle className="h-4 w-4 mr-2" />
                                      Request Revision
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Financial Impact Dashboard
              </CardTitle>
              <CardDescription>Revenue optimization through AI-powered coding and risk adjustment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">
                    ${records.reduce((sum, r) => sum + (r.financialImpact?.potentialIncrease || 0), 0).toLocaleString()}
                  </div>
                  <p className="text-sm text-green-700">Monthly Revenue Increase</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-3xl font-bold text-blue-600">
                    {(
                      records.reduce((sum, r) => sum + (r.financialImpact?.riskAdjustment || 0), 0) / records.length
                    ).toFixed(2)}
                    x
                  </div>
                  <p className="text-sm text-blue-700">Avg Risk Adjustment</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-3xl font-bold text-purple-600">
                    {Math.round(
                      ((records.reduce((sum, r) => sum + (r.financialImpact?.optimizedReimbursement || 0), 0) -
                        records.reduce((sum, r) => sum + (r.financialImpact?.currentReimbursement || 0), 0)) /
                        records.reduce((sum, r) => sum + (r.financialImpact?.currentReimbursement || 0), 0)) *
                        100,
                    )}
                    %
                  </div>
                  <p className="text-sm text-purple-700">Revenue Improvement</p>
                </div>
              </div>

              <div className="space-y-4">
                {records.map((record) => (
                  <div key={record.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{record.patientName}</h4>
                        <p className="text-sm text-gray-600">{record.assessmentType}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        +${record.financialImpact?.potentialIncrease.toLocaleString()}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <Label className="text-xs">Current</Label>
                        <p className="font-medium">${record.financialImpact?.currentReimbursement.toLocaleString()}</p>
                      </div>
                      <div>
                        <Label className="text-xs">Optimized</Label>
                        <p className="font-medium text-blue-600">
                          ${record.financialImpact?.optimizedReimbursement.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs">Risk Adj.</Label>
                        <p className="font-medium text-purple-600">{record.financialImpact?.riskAdjustment}x</p>
                      </div>
                      <div>
                        <Label className="text-xs">Case Mix</Label>
                        <p className="font-medium">{record.autoCoding?.caseMixIndex}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk-assessment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Patient Risk Assessment Dashboard
              </CardTitle>
              <CardDescription>Comprehensive risk analysis for clinical and financial outcomes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {records.map((record) => (
                  <div key={record.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium">{record.patientName}</h4>
                        <p className="text-sm text-gray-600">{record.assessmentType}</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">{record.riskFactors?.riskScore}/10</div>
                        <p className="text-xs text-gray-500">Risk Score</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label className="font-medium text-red-600 text-sm">Clinical Risks</Label>
                        <div className="space-y-1 mt-2">
                          {record.riskFactors?.clinical.map((risk, index) => (
                            <div key={index} className="text-xs p-2 bg-red-50 rounded border-l-2 border-red-300">
                              {risk}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label className="font-medium text-orange-600 text-sm">Financial Risks</Label>
                        <div className="space-y-1 mt-2">
                          {record.riskFactors?.financial.map((risk, index) => (
                            <div key={index} className="text-xs p-2 bg-orange-50 rounded border-l-2 border-orange-300">
                              {risk}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label className="font-medium text-yellow-600 text-sm">Compliance Risks</Label>
                        <div className="space-y-1 mt-2">
                          {record.riskFactors?.compliance.map((risk, index) => (
                            <div key={index} className="text-xs p-2 bg-yellow-50 rounded border-l-2 border-yellow-300">
                              {risk}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="auto-coding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                AI Auto-Coding Results
              </CardTitle>
              <CardDescription>Automated ICD-10 and HCC coding with confidence scores</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {records.map((record) => (
                  <div key={record.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium">{record.patientName}</h4>
                        <p className="text-sm text-gray-600">{record.assessmentType}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-purple-100 text-purple-800">CMI: {record.autoCoding?.caseMixIndex}</Badge>
                        <Badge className="bg-blue-100 text-blue-800">{record.autoCoding?.reimbursementCategory}</Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <Label className="font-medium text-blue-600">ICD-10 Codes</Label>
                        <div className="space-y-2 mt-2">
                          {record.autoCoding?.icdCodes.map((code, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                              <div>
                                <span className="font-mono text-sm font-medium">{code.code}</span>
                                <p className="text-xs text-gray-600">{code.description}</p>
                              </div>
                              <Badge className="bg-blue-100 text-blue-800">{Math.round(code.confidence * 100)}%</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label className="font-medium text-green-600">HCC Codes</Label>
                        <div className="space-y-2 mt-2">
                          {record.autoCoding?.hccCodes.map((code, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                              <div>
                                <span className="font-mono text-sm font-medium">{code.code}</span>
                                <p className="text-xs text-gray-600">{code.description}</p>
                              </div>
                              <Badge className="bg-green-100 text-green-800">Weight: {code.riskWeight}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Quality Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Average AI Score</span>
                      <span>{dashboardStats.averageScore}%</span>
                    </div>
                    <Progress value={dashboardStats.averageScore} className="mt-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Auto-Coding Success</span>
                      <span>94%</span>
                    </div>
                    <Progress value={94} className="mt-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm">
                      <span>Financial Optimization</span>
                      <span>87%</span>
                    </div>
                    <Progress value={87} className="mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Revenue Impact
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Monthly Increase</span>
                    <span className="text-sm font-medium text-green-600">
                      +${dashboardStats.totalFinancialImpact.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Annual Projection</span>
                    <span className="text-sm font-medium text-green-600">
                      +${(dashboardStats.totalFinancialImpact * 12).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">ROI on AI System</span>
                    <span className="text-sm font-medium text-blue-600">340%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Risk Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Avg Risk Score</span>
                    <span className="text-sm font-medium">{dashboardStats.averageRiskScore.toFixed(1)}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">High Risk Patients</span>
                    <span className="text-sm font-medium text-red-600">
                      {records.filter((r) => (r.riskFactors?.riskScore || 0) > 7).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Risk Mitigation</span>
                    <span className="text-sm font-medium text-green-600">78%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
