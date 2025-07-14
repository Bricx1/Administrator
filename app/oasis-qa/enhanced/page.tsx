"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
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
  Clock,
  AlertTriangle,
  FileText,
  Brain,
  Shield,
  Stethoscope,
  Eye,
  Download,
  RefreshCw,
  TrendingUp,
  Award,
  Target,
  DollarSign,
  Zap,
  Bot,
  Calculator,
  Heart,
  AlertCircle,
} from "lucide-react"
import { AIVoiceAssistant } from "@/components/ai-voice-assistant"

interface EnhancedOasisRecord {
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
  financialOptimization: {
    currentReimbursement: number
    optimizedReimbursement: number
    potentialIncrease: number
    riskAdjustmentScore: number
    suggestedCodes: string[]
  }
  riskFactors: {
    clinical: string[]
    financial: string[]
    compliance: string[]
  }
  treatmentSuggestions: {
    immediate: string[]
    shortTerm: string[]
    longTerm: string[]
  }
  aiAnalysis: {
    codingAccuracy: number
    documentationCompleteness: number
    clinicalConsistency: number
    reimbursementOptimization: number
  }
}

export default function EnhancedOasisQA() {
  const [records, setRecords] = useState<EnhancedOasisRecord[]>([])
  const [selectedRecord, setSelectedRecord] = useState<EnhancedOasisRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")

  // Mock enhanced data with financial optimization
  useEffect(() => {
    const mockRecords: EnhancedOasisRecord[] = [
      {
        id: "OASIS-2024-001247",
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
        financialOptimization: {
          currentReimbursement: 2850,
          optimizedReimbursement: 3420,
          potentialIncrease: 570,
          riskAdjustmentScore: 1.24,
          suggestedCodes: ["M1021", "M1033", "M1242", "M1311"],
        },
        riskFactors: {
          clinical: ["Diabetes with complications", "Fall risk - high", "Medication non-compliance history"],
          financial: ["Under-documented wound care", "Missing therapy justification", "Incomplete ADL scoring"],
          compliance: ["Missing physician signature", "Incomplete medication reconciliation"],
        },
        treatmentSuggestions: {
          immediate: [
            "Initiate diabetic foot care protocol",
            "Implement fall prevention measures",
            "Medication compliance monitoring",
          ],
          shortTerm: ["Physical therapy evaluation", "Nutritionist consultation", "Home safety assessment"],
          longTerm: [
            "Diabetes self-management education",
            "Family caregiver training",
            "Chronic disease management program",
          ],
        },
        aiAnalysis: {
          codingAccuracy: 92,
          documentationCompleteness: 85,
          clinicalConsistency: 88,
          reimbursementOptimization: 78,
        },
      },
      {
        id: "OASIS-2024-001246",
        patientName: "Robert Thompson",
        assessmentType: "Recertification",
        clinician: "Michael Chen, PT",
        submissionDate: "2024-01-15",
        aiScore: 94,
        qualityFlags: 1,
        status: "pending_clinical_director",
        priority: "low",
        approvalLevel: "clinical_director",
        dueDate: "2024-01-17T18:00:00Z",
        financialOptimization: {
          currentReimbursement: 3200,
          optimizedReimbursement: 3650,
          potentialIncrease: 450,
          riskAdjustmentScore: 1.18,
          suggestedCodes: ["M1021", "M1242", "M1311", "M1324"],
        },
        riskFactors: {
          clinical: ["COPD exacerbation risk", "Mobility limitations"],
          financial: ["Therapy frequency justification needed"],
          compliance: ["Documentation timing"],
        },
        treatmentSuggestions: {
          immediate: ["Respiratory therapy assessment", "Mobility aid evaluation"],
          shortTerm: ["Pulmonary rehabilitation", "Strength training program"],
          longTerm: ["COPD management education", "Exercise maintenance program"],
        },
        aiAnalysis: {
          codingAccuracy: 96,
          documentationCompleteness: 92,
          clinicalConsistency: 94,
          reimbursementOptimization: 85,
        },
      },
    ]

    setTimeout(() => {
      setRecords(mockRecords)
      setLoading(false)
    }, 1000)
  }, [])

  const dashboardStats = {
    totalRecords: records.length,
    pendingQaRn: records.filter((r) => r.status === "pending_qa_rn").length,
    pendingClinicalDirector: records.filter((r) => r.status === "pending_clinical_director").length,
    approved: records.filter((r) => r.status === "approved").length,
    averageScore: Math.round(records.reduce((sum, r) => sum + r.aiScore, 0) / records.length),
    complianceRate: Math.round((records.filter((r) => r.aiScore >= 85).length / records.length) * 100),
    totalPotentialIncrease: records.reduce((sum, r) => sum + r.financialOptimization.potentialIncrease, 0),
    averageRiskScore: records.reduce((sum, r) => sum + r.financialOptimization.riskAdjustmentScore, 0) / records.length,
  }

  const handleNavigate = (path: string) => {
    // In a real app, this would use Next.js router
    console.log("Navigating to:", path)
    window.location.href = path
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
          <h1 className="text-3xl font-bold flex items-center">
            <Brain className="h-8 w-8 mr-3 text-purple-600" />
            Enhanced OASIS QA with AI Financial Optimization
          </h1>
          <p className="text-muted-foreground">
            AI-powered quality review with financial optimization and treatment planning
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
          <TabsTrigger value="financial">Financial Optimization</TabsTrigger>
          <TabsTrigger value="risk-analysis">Risk Analysis</TabsTrigger>
          <TabsTrigger value="treatment-plans">Treatment Plans</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Insights</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          {/* Enhanced Key Metrics */}
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
                <CardTitle className="text-sm font-medium">AI Quality Score</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">{dashboardStats.averageScore}%</div>
                <p className="text-xs text-muted-foreground">Average AI assessment score</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Financial Opportunity</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">${dashboardStats.totalPotentialIncrease}</div>
                <p className="text-xs text-muted-foreground">Potential monthly increase</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Risk Adjustment</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{dashboardStats.averageRiskScore.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">Average risk score</p>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Records List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                AI-Enhanced OASIS Records
              </CardTitle>
              <CardDescription>
                Records with AI quality analysis, financial optimization, and treatment recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {records.map((record) => (
                  <div key={record.id} className="p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium">{record.patientName}</h3>
                        <p className="text-sm text-gray-600">
                          {record.id} • {record.assessmentType} • {record.clinician}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-purple-100 text-purple-800">AI: {record.aiScore}%</Badge>
                        <Badge className="bg-green-100 text-green-800">
                          +${record.financialOptimization.potentialIncrease}
                        </Badge>
                        <Badge
                          className={
                            record.priority === "urgent"
                              ? "bg-red-100 text-red-800"
                              : record.priority === "high"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-blue-100 text-blue-800"
                          }
                        >
                          {record.priority}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <Label className="text-xs font-medium">Financial Impact</Label>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium">
                            ${record.financialOptimization.currentReimbursement} → $
                            {record.financialOptimization.optimizedReimbursement}
                          </span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs font-medium">Risk Factors</Label>
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                          <span className="text-sm">
                            {record.riskFactors.clinical.length + record.riskFactors.financial.length} identified
                          </span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs font-medium">Treatment Plans</Label>
                        <div className="flex items-center space-x-2">
                          <Heart className="h-4 w-4 text-red-500" />
                          <span className="text-sm">{record.treatmentSuggestions.immediate.length} immediate</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs font-medium">AI Analysis</Label>
                        <div className="flex items-center space-x-2">
                          <Bot className="h-4 w-4 text-purple-500" />
                          <span className="text-sm">
                            {Math.round(
                              (record.aiAnalysis.codingAccuracy +
                                record.aiAnalysis.documentationCompleteness +
                                record.aiAnalysis.clinicalConsistency +
                                record.aiAnalysis.reimbursementOptimization) /
                                4,
                            )}
                            % overall
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" onClick={() => setSelectedRecord(record)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Enhanced Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <Brain className="h-5 w-5 text-purple-600" />
                              Enhanced OASIS Review - {record.patientName}
                            </DialogTitle>
                            <DialogDescription>
                              AI-powered quality analysis with financial optimization and treatment planning
                            </DialogDescription>
                          </DialogHeader>

                          {selectedRecord && (
                            <div className="space-y-6">
                              {/* AI Analysis Overview */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="flex items-center gap-2">
                                    <Bot className="h-5 w-5 text-purple-600" />
                                    AI Analysis Overview
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="text-center">
                                      <div className="text-2xl font-bold text-blue-600">
                                        {selectedRecord.aiAnalysis.codingAccuracy}%
                                      </div>
                                      <p className="text-sm text-gray-600">Coding Accuracy</p>
                                      <Progress value={selectedRecord.aiAnalysis.codingAccuracy} className="mt-1" />
                                    </div>
                                    <div className="text-center">
                                      <div className="text-2xl font-bold text-green-600">
                                        {selectedRecord.aiAnalysis.documentationCompleteness}%
                                      </div>
                                      <p className="text-sm text-gray-600">Documentation</p>
                                      <Progress
                                        value={selectedRecord.aiAnalysis.documentationCompleteness}
                                        className="mt-1"
                                      />
                                    </div>
                                    <div className="text-center">
                                      <div className="text-2xl font-bold text-purple-600">
                                        {selectedRecord.aiAnalysis.clinicalConsistency}%
                                      </div>
                                      <p className="text-sm text-gray-600">Clinical Consistency</p>
                                      <Progress
                                        value={selectedRecord.aiAnalysis.clinicalConsistency}
                                        className="mt-1"
                                      />
                                    </div>
                                    <div className="text-center">
                                      <div className="text-2xl font-bold text-yellow-600">
                                        {selectedRecord.aiAnalysis.reimbursementOptimization}%
                                      </div>
                                      <p className="text-sm text-gray-600">Reimbursement Opt.</p>
                                      <Progress
                                        value={selectedRecord.aiAnalysis.reimbursementOptimization}
                                        className="mt-1"
                                      />
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Financial Optimization */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="h-5 w-5 text-green-600" />
                                    Financial Optimization Analysis
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                      <h4 className="font-medium mb-3">Reimbursement Comparison</h4>
                                      <div className="space-y-2">
                                        <div className="flex justify-between">
                                          <span>Current Reimbursement:</span>
                                          <span className="font-medium">
                                            ${selectedRecord.financialOptimization.currentReimbursement}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Optimized Reimbursement:</span>
                                          <span className="font-medium text-green-600">
                                            ${selectedRecord.financialOptimization.optimizedReimbursement}
                                          </span>
                                        </div>
                                        <div className="flex justify-between border-t pt-2">
                                          <span className="font-medium">Potential Increase:</span>
                                          <span className="font-bold text-green-600">
                                            +${selectedRecord.financialOptimization.potentialIncrease}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Risk Adjustment Score:</span>
                                          <span className="font-medium">
                                            {selectedRecord.financialOptimization.riskAdjustmentScore}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="font-medium mb-3">Suggested Coding Optimizations</h4>
                                      <div className="space-y-2">
                                        {selectedRecord.financialOptimization.suggestedCodes.map((code, index) => (
                                          <div
                                            key={index}
                                            className="flex items-center justify-between p-2 bg-green-50 rounded"
                                          >
                                            <span className="font-mono text-sm">{code}</span>
                                            <Badge className="bg-green-100 text-green-800">Recommended</Badge>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Risk Factor Analysis */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                                    Risk Factor Analysis
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                      <h4 className="font-medium mb-3 flex items-center gap-2">
                                        <Heart className="h-4 w-4 text-red-500" />
                                        Clinical Risks
                                      </h4>
                                      <div className="space-y-2">
                                        {selectedRecord.riskFactors.clinical.map((risk, index) => (
                                          <div key={index} className="p-2 bg-red-50 rounded border-l-4 border-red-500">
                                            <span className="text-sm">{risk}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="font-medium mb-3 flex items-center gap-2">
                                        <DollarSign className="h-4 w-4 text-yellow-500" />
                                        Financial Risks
                                      </h4>
                                      <div className="space-y-2">
                                        {selectedRecord.riskFactors.financial.map((risk, index) => (
                                          <div
                                            key={index}
                                            className="p-2 bg-yellow-50 rounded border-l-4 border-yellow-500"
                                          >
                                            <span className="text-sm">{risk}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="font-medium mb-3 flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-blue-500" />
                                        Compliance Risks
                                      </h4>
                                      <div className="space-y-2">
                                        {selectedRecord.riskFactors.compliance.map((risk, index) => (
                                          <div
                                            key={index}
                                            className="p-2 bg-blue-50 rounded border-l-4 border-blue-500"
                                          >
                                            <span className="text-sm">{risk}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Treatment Suggestions */}
                              <Card>
                                <CardHeader>
                                  <CardTitle className="flex items-center gap-2">
                                    <Stethoscope className="h-5 w-5 text-blue-600" />
                                    AI-Generated Treatment Plan Suggestions
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                      <h4 className="font-medium mb-3 flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4 text-red-500" />
                                        Immediate Actions
                                      </h4>
                                      <div className="space-y-2">
                                        {selectedRecord.treatmentSuggestions.immediate.map((suggestion, index) => (
                                          <div key={index} className="p-3 bg-red-50 rounded border border-red-200">
                                            <span className="text-sm">{suggestion}</span>
                                            <div className="mt-2">
                                              <Badge className="bg-red-100 text-red-800 text-xs">Priority: High</Badge>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="font-medium mb-3 flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-yellow-500" />
                                        Short-term Goals
                                      </h4>
                                      <div className="space-y-2">
                                        {selectedRecord.treatmentSuggestions.shortTerm.map((suggestion, index) => (
                                          <div
                                            key={index}
                                            className="p-3 bg-yellow-50 rounded border border-yellow-200"
                                          >
                                            <span className="text-sm">{suggestion}</span>
                                            <div className="mt-2">
                                              <Badge className="bg-yellow-100 text-yellow-800 text-xs">1-4 weeks</Badge>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    <div>
                                      <h4 className="font-medium mb-3 flex items-center gap-2">
                                        <Target className="h-4 w-4 text-green-500" />
                                        Long-term Goals
                                      </h4>
                                      <div className="space-y-2">
                                        {selectedRecord.treatmentSuggestions.longTerm.map((suggestion, index) => (
                                          <div key={index} className="p-3 bg-green-50 rounded border border-green-200">
                                            <span className="text-sm">{suggestion}</span>
                                            <div className="mt-2">
                                              <Badge className="bg-green-100 text-green-800 text-xs">1-3 months</Badge>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>

                              {/* Action Buttons */}
                              <div className="flex justify-end space-x-3 pt-4 border-t">
                                <Button variant="outline">
                                  <Calculator className="h-4 w-4 mr-2" />
                                  Generate Care Plan
                                </Button>
                                <Button variant="outline">
                                  <Download className="h-4 w-4 mr-2" />
                                  Export Analysis
                                </Button>
                                <Button>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Approve with Optimizations
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      <Button size="sm" variant="outline">
                        <Calculator className="h-4 w-4 mr-2" />
                        Auto-Code
                      </Button>
                      <Button size="sm" variant="outline">
                        <Heart className="h-4 w-4 mr-2" />
                        Generate Plan
                      </Button>
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
                <DollarSign className="h-5 w-5 text-green-600" />
                Financial Optimization Dashboard
              </CardTitle>
              <CardDescription>Maximize reimbursement potential through AI-powered coding optimization</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6 text-center">
                    <DollarSign className="h-8 w-8 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-600">${dashboardStats.totalPotentialIncrease}</div>
                    <div className="text-sm text-gray-600">Monthly Opportunity</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-600">{dashboardStats.averageRiskScore.toFixed(2)}</div>
                    <div className="text-sm text-gray-600">Avg Risk Score</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <Calculator className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-600">94%</div>
                    <div className="text-sm text-gray-600">Coding Accuracy</div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="risk-analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                Patient Risk Factor Analysis
              </CardTitle>
              <CardDescription>AI-identified clinical, financial, and compliance risk factors</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {records.map((record) => (
                  <div key={record.id} className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-3">{record.patientName}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-red-600">Clinical Risks</Label>
                        <div className="mt-1 space-y-1">
                          {record.riskFactors.clinical.map((risk, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs mr-1 mb-1 text-red-600 border-red-200"
                            >
                              {risk}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-yellow-600">Financial Risks</Label>
                        <div className="mt-1 space-y-1">
                          {record.riskFactors.financial.map((risk, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs mr-1 mb-1 text-yellow-600 border-yellow-200"
                            >
                              {risk}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-blue-600">Compliance Risks</Label>
                        <div className="mt-1 space-y-1">
                          {record.riskFactors.compliance.map((risk, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs mr-1 mb-1 text-blue-600 border-blue-200"
                            >
                              {risk}
                            </Badge>
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

        <TabsContent value="treatment-plans" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-blue-600" />
                AI-Generated Treatment Plan Suggestions
              </CardTitle>
              <CardDescription>
                Evidence-based treatment recommendations based on patient assessment data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {records.map((record) => (
                  <div key={record.id} className="p-4 border rounded-lg">
                    <h3 className="font-medium mb-4">{record.patientName} - Treatment Recommendations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-medium text-red-600 mb-2">Immediate Actions</h4>
                        <div className="space-y-2">
                          {record.treatmentSuggestions.immediate.map((suggestion, index) => (
                            <div key={index} className="p-2 bg-red-50 rounded text-sm">
                              {suggestion}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-yellow-600 mb-2">Short-term Goals</h4>
                        <div className="space-y-2">
                          {record.treatmentSuggestions.shortTerm.map((suggestion, index) => (
                            <div key={index} className="p-2 bg-yellow-50 rounded text-sm">
                              {suggestion}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-green-600 mb-2">Long-term Goals</h4>
                        <div className="space-y-2">
                          {record.treatmentSuggestions.longTerm.map((suggestion, index) => (
                            <div key={index} className="p-2 bg-green-50 rounded text-sm">
                              {suggestion}
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

        <TabsContent value="ai-insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                AI Performance Analytics
              </CardTitle>
              <CardDescription>
                Detailed analysis of AI assessment accuracy and optimization recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-4">AI Analysis Breakdown</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Coding Accuracy</span>
                        <span className="text-sm font-medium">94%</span>
                      </div>
                      <Progress value={94} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Documentation Completeness</span>
                        <span className="text-sm font-medium">89%</span>
                      </div>
                      <Progress value={89} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Clinical Consistency</span>
                        <span className="text-sm font-medium">91%</span>
                      </div>
                      <Progress value={91} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">Reimbursement Optimization</span>
                        <span className="text-sm font-medium">82%</span>
                      </div>
                      <Progress value={82} className="h-2" />
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-4">Optimization Impact</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-green-50 rounded">
                      <span className="text-sm">Average Reimbursement Increase</span>
                      <span className="font-medium text-green-600">+18.2%</span>
                    </div>
                    <div className="flex justify-between p-3 bg-blue-50 rounded">
                      <span className="text-sm">Risk Adjustment Improvement</span>
                      <span className="font-medium text-blue-600">+0.15</span>
                    </div>
                    <div className="flex justify-between p-3 bg-purple-50 rounded">
                      <span className="text-sm">Documentation Quality Score</span>
                      <span className="font-medium text-purple-600">A+</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Compliance Monitoring
              </CardTitle>
              <CardDescription>Track regulatory compliance and identify potential issues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Award className="h-6 w-6 text-green-500 mx-auto mb-2" />
                    <div className="text-xl font-bold text-green-600">{dashboardStats.complianceRate}%</div>
                    <div className="text-sm text-gray-600">Compliance Rate</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <AlertTriangle className="h-6 w-6 text-orange-500 mx-auto mb-2" />
                    <div className="text-xl font-bold text-orange-600">3</div>
                    <div className="text-sm text-gray-600">Active Issues</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <CheckCircle className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                    <div className="text-xl font-bold text-blue-600">12</div>
                    <div className="text-sm text-gray-600">Resolved This Month</div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Recent Compliance Issues</h4>
                <div className="space-y-3">
                  <div className="p-3 border border-orange-200 bg-orange-50 rounded">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Missing Physician Signature</span>
                      <Badge className="bg-orange-100 text-orange-800">Medium Priority</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">2 records require physician signature within 24 hours</p>
                  </div>
                  <div className="p-3 border border-yellow-200 bg-yellow-50 rounded">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Incomplete Medication Reconciliation</span>
                      <Badge className="bg-yellow-100 text-yellow-800">Low Priority</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">1 record needs medication reconciliation update</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AIVoiceAssistant onNavigate={handleNavigate} currentPage="/oasis-qa/enhanced" userRole="staff" />
    </div>
  )
}
