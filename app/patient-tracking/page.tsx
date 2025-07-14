"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  ArrowLeft,
  Search,
  Filter,
  Plus,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  Calendar,
  FileText,
  Activity,
  Download,
  RefreshCw,
  Eye,
  Edit,
  Hospital,
  Building,
  Stethoscope,
  DollarSign,
  Target,
  AlertCircle,
  UserCheck,
  Timer,
  BarChart3,
  Zap,
  Inbox,
} from "lucide-react"
import Link from "next/link"
import { Video, Camera, Mic, Play, Square, Brain, Award, BookOpen, Shield, TrendingUp } from "lucide-react"

interface VisitFrequency {
  discipline: "RN" | "PT" | "OT" | "MSW" | "HHA"
  authorized: number
  used: number
  remaining: number
  weeklyFrequency: string
  lastVisit: string
  nextScheduled: string
  lupaThreshold: number
  isOverThreshold: boolean
  costPerVisit: number
  totalCost: number
}

interface PatientGoal {
  id: string
  discipline: string
  goal: string
  targetDate: string
  status: "Not Started" | "In Progress" | "Achieved" | "Modified" | "Discontinued"
  progress: number
  notes: string
}

interface Patient {
  id: string
  name: string
  axxessId: string
  referralDate: string
  currentStatus: "Active" | "Pending" | "Discharged" | "On Hold"
  dischargeStatus: "N/A" | "Completed" | "Transferred" | "Deceased" | "Against Medical Advice"
  referralAccepted: boolean
  assignedStaff: string
  socDueDate: string
  socWindowStatus: "On Track" | "Due Soon" | "Overdue"
  location: string
  referralType: "Hospital" | "Facility" | "Clinic"
  priority: "High" | "Medium" | "Low"
  diagnosis: string
  age: number
  insurance: string
  phoneNumber: string
  address: string
  emergencyContact: string
  episodeStartDate: string
  episodeEndDate: string
  nextReEvalDate: string
  lupaStatus: "Safe" | "At Risk" | "Over Threshold"
  totalEpisodeCost: number
  projectedCost: number
  visitFrequencies: VisitFrequency[]
  patientGoals: PatientGoal[]
  woundCare?: {
    hasWounds: boolean
    woundCount: number
    woundTypes: string[]
    lastAssessment: string
    healingProgress: "Improving" | "Stable" | "Declining"
    nextDressing: string
    supplies: string[]
  }
}

export default function PatientTrackingDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [staffFilter, setStaffFilter] = useState("All")
  const [locationFilter, setLocationFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")
  const [referralTypeFilter, setReferralTypeFilter] = useState("All")
  const [lupaFilter, setLupaFilter] = useState("All")
  const [showAddPatient, setShowAddPatient] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [showPatientDetails, setShowPatientDetails] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(false)
  const [lastSync, setLastSync] = useState<string | null>(null)
  const [selectedStaffMember, setSelectedStaffMember] = useState<string>("")
  const [isRecordingSupervision, setIsRecordingSupervision] = useState(false)
  const [supervisionTime, setSupervisionTime] = useState(0)
  const [aiInsights, setAiInsights] = useState<any[]>([])
  const [supervisionNotes, setSupervisionNotes] = useState("")
  const [showSupervisionModal, setShowSupervisionModal] = useState(false)
  const [showCompetencyModal, setShowCompetencyModal] = useState(false)
  const [selectedStaffForEvaluation, setSelectedStaffForEvaluation] = useState<any>(null)
  const [evaluationInProgress, setEvaluationInProgress] = useState(false)
  const [aiAnalysisResults, setAiAnalysisResults] = useState<any[]>([])
  const [competencyScores, setCompetencyScores] = useState<any>({})

  // Mock patient data with comprehensive visit frequency and LUPA information
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: "PT-2024-001",
      name: "Margaret Anderson",
      axxessId: "AX-12345",
      referralDate: "2024-01-15",
      currentStatus: "Active",
      dischargeStatus: "N/A",
      referralAccepted: true,
      assignedStaff: "Sarah Johnson, RN",
      socDueDate: "2024-01-22",
      socWindowStatus: "Overdue",
      location: "Downtown Clinic",
      referralType: "Hospital",
      priority: "High",
      diagnosis: "Diabetic foot ulcer, CHF",
      age: 78,
      insurance: "Medicare",
      phoneNumber: "(555) 123-4567",
      address: "123 Main St, City, ST 12345",
      emergencyContact: "John Anderson (Son) - (555) 987-6543",
      episodeStartDate: "2024-01-15",
      episodeEndDate: "2024-03-15",
      nextReEvalDate: "2024-02-14",
      lupaStatus: "At Risk",
      totalEpisodeCost: 2850.0,
      projectedCost: 3200.0,
      visitFrequencies: [
        {
          discipline: "RN",
          authorized: 14,
          used: 8,
          remaining: 6,
          weeklyFrequency: "2x/week",
          lastVisit: "2024-01-20",
          nextScheduled: "2024-01-22",
          lupaThreshold: 10,
          isOverThreshold: false,
          costPerVisit: 125.0,
          totalCost: 1000.0,
        },
        {
          discipline: "PT",
          authorized: 12,
          used: 7,
          remaining: 5,
          weeklyFrequency: "2x/week",
          lastVisit: "2024-01-19",
          nextScheduled: "2024-01-21",
          lupaThreshold: 10,
          isOverThreshold: false,
          costPerVisit: 150.0,
          totalCost: 1050.0,
        },
        {
          discipline: "HHA",
          authorized: 20,
          used: 12,
          remaining: 8,
          weeklyFrequency: "3x/week",
          lastVisit: "2024-01-20",
          nextScheduled: "2024-01-22",
          lupaThreshold: 15,
          isOverThreshold: false,
          costPerVisit: 65.0,
          totalCost: 780.0,
        },
      ],
      patientGoals: [
        {
          id: "G001",
          discipline: "PT",
          goal: "Patient will ambulate 50 feet with walker independently",
          targetDate: "2024-02-15",
          status: "In Progress",
          progress: 65,
          notes: "Good progress, patient can now walk 35 feet",
        },
        {
          id: "G002",
          discipline: "RN",
          goal: "Wound healing with 50% reduction in size",
          targetDate: "2024-02-20",
          status: "In Progress",
          progress: 40,
          notes: "Wound showing signs of improvement",
        },
      ],
      woundCare: {
        hasWounds: true,
        woundCount: 2,
        woundTypes: ["Diabetic ulcer", "Pressure sore"],
        lastAssessment: "2024-01-20",
        healingProgress: "Improving",
        nextDressing: "2024-01-22",
        supplies: ["Hydrocolloid dressing", "Silver foam", "Gauze pads"],
      },
    },
    {
      id: "PT-2024-002",
      name: "Robert Thompson",
      axxessId: "AX-12346",
      referralDate: "2024-01-18",
      currentStatus: "Active",
      dischargeStatus: "N/A",
      referralAccepted: true,
      assignedStaff: "Michael Chen, PT",
      socDueDate: "2024-01-23",
      socWindowStatus: "Due Soon",
      location: "North Branch",
      referralType: "Facility",
      priority: "Medium",
      diagnosis: "Post-surgical rehabilitation",
      age: 65,
      insurance: "Blue Cross",
      phoneNumber: "(555) 234-5678",
      address: "456 Oak Ave, City, ST 12345",
      emergencyContact: "Mary Thompson (Wife) - (555) 876-5432",
      episodeStartDate: "2024-01-18",
      episodeEndDate: "2024-03-18",
      nextReEvalDate: "2024-02-17",
      lupaStatus: "Over Threshold",
      totalEpisodeCost: 3200.0,
      projectedCost: 3800.0,
      visitFrequencies: [
        {
          discipline: "PT",
          authorized: 15,
          used: 12,
          remaining: 3,
          weeklyFrequency: "3x/week",
          lastVisit: "2024-01-20",
          nextScheduled: "2024-01-22",
          lupaThreshold: 10,
          isOverThreshold: true,
          costPerVisit: 150.0,
          totalCost: 1800.0,
        },
        {
          discipline: "OT",
          authorized: 10,
          used: 8,
          remaining: 2,
          weeklyFrequency: "2x/week",
          lastVisit: "2024-01-19",
          nextScheduled: "2024-01-21",
          lupaThreshold: 10,
          isOverThreshold: false,
          costPerVisit: 140.0,
          totalCost: 1120.0,
        },
        {
          discipline: "RN",
          authorized: 6,
          used: 2,
          remaining: 4,
          weeklyFrequency: "1x/week",
          lastVisit: "2024-01-18",
          nextScheduled: "2024-01-25",
          lupaThreshold: 10,
          isOverThreshold: false,
          costPerVisit: 125.0,
          totalCost: 250.0,
        },
      ],
      patientGoals: [
        {
          id: "G003",
          discipline: "PT",
          goal: "Return to pre-surgery mobility level",
          targetDate: "2024-02-28",
          status: "In Progress",
          progress: 80,
          notes: "Excellent progress, ahead of schedule",
        },
        {
          id: "G004",
          discipline: "OT",
          goal: "Independent ADL performance",
          targetDate: "2024-02-25",
          status: "In Progress",
          progress: 70,
          notes: "Patient demonstrating good adaptation",
        },
      ],
    },
    {
      id: "PT-2024-003",
      name: "Dorothy Williams",
      axxessId: "AX-12347",
      referralDate: "2024-01-20",
      currentStatus: "Pending",
      dischargeStatus: "N/A",
      referralAccepted: false,
      assignedStaff: "Emily Davis, OT",
      socDueDate: "2024-01-25",
      socWindowStatus: "On Track",
      location: "South Campus",
      referralType: "Clinic",
      priority: "Low",
      diagnosis: "Stroke recovery, occupational therapy",
      age: 72,
      insurance: "Medicaid",
      phoneNumber: "(555) 345-6789",
      address: "789 Pine St, City, ST 12345",
      emergencyContact: "James Williams (Brother) - (555) 765-4321",
      episodeStartDate: "2024-01-20",
      episodeEndDate: "2024-03-20",
      nextReEvalDate: "2024-02-19",
      lupaStatus: "Safe",
      totalEpisodeCost: 1800.0,
      projectedCost: 2100.0,
      visitFrequencies: [
        {
          discipline: "OT",
          authorized: 12,
          used: 3,
          remaining: 9,
          weeklyFrequency: "2x/week",
          lastVisit: "2024-01-19",
          nextScheduled: "2024-01-21",
          lupaThreshold: 10,
          isOverThreshold: false,
          costPerVisit: 140.0,
          totalCost: 420.0,
        },
        {
          discipline: "MSW",
          authorized: 4,
          used: 1,
          remaining: 3,
          weeklyFrequency: "1x/month",
          lastVisit: "2024-01-20",
          nextScheduled: "2024-02-20",
          lupaThreshold: 5,
          isOverThreshold: false,
          costPerVisit: 120.0,
          totalCost: 120.0,
        },
      ],
      patientGoals: [
        {
          id: "G005",
          discipline: "OT",
          goal: "Improve fine motor skills for daily tasks",
          targetDate: "2024-03-01",
          status: "Not Started",
          progress: 10,
          notes: "Initial assessment completed",
        },
      ],
      woundCare: {
        hasWounds: true,
        woundCount: 1,
        woundTypes: ["Pressure ulcer"],
        lastAssessment: "2024-01-19",
        healingProgress: "Stable",
        nextDressing: "2024-01-21",
        supplies: ["Foam dressing", "Barrier cream"],
      },
    },
  ])

  // Sync with Axxess API
  const syncWithAxxess = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/axxess/patients/sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          lastSync: lastSync,
          includeVisitData: true,
          includeLupaData: true,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          // Update patients with Axxess data
          setPatients((prevPatients) => {
            const updatedPatients = [...prevPatients]
            data.patients.forEach((axxessPatient: any) => {
              const existingIndex = updatedPatients.findIndex((p) => p.axxessId === axxessPatient.axxessId)
              if (existingIndex >= 0) {
                updatedPatients[existingIndex] = { ...updatedPatients[existingIndex], ...axxessPatient }
              } else {
                updatedPatients.push(axxessPatient)
              }
            })
            return updatedPatients
          })
          setLastSync(new Date().toISOString())
        }
      }
    } catch (error) {
      console.error("Axxess sync error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-sync every 15 minutes
  useEffect(() => {
    const interval = setInterval(syncWithAxxess, 15 * 60 * 1000)
    return () => clearInterval(interval)
  }, [lastSync])

  // Calculate SOC window status based on current date
  const calculateSOCStatus = (socDueDate: string): "On Track" | "Due Soon" | "Overdue" => {
    const today = new Date()
    const dueDate = new Date(socDueDate)
    const timeDiff = dueDate.getTime() - today.getTime()
    const hoursDiff = timeDiff / (1000 * 3600)

    if (hoursDiff < 0) return "Overdue"
    if (hoursDiff < 24) return "Due Soon"
    return "On Track"
  }

  // Update SOC status for all patients
  const updatedPatients = patients.map((patient) => ({
    ...patient,
    socWindowStatus: calculateSOCStatus(patient.socDueDate),
  }))

  // Get unique values for filters
  const uniqueStaff = [...new Set(updatedPatients.map((p) => p.assignedStaff))]
  const uniqueLocations = [...new Set(updatedPatients.map((p) => p.location))]
  const uniqueReferralTypes = [...new Set(updatedPatients.map((p) => p.referralType))]

  // Filter and search patients
  const filteredPatients = useMemo(() => {
    let filtered = updatedPatients

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (patient) =>
          patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.axxessId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Staff filter
    if (staffFilter !== "All") {
      filtered = filtered.filter((patient) => patient.assignedStaff === staffFilter)
    }

    // Location filter
    if (locationFilter !== "All") {
      filtered = filtered.filter((patient) => patient.location === locationFilter)
    }

    // Status filter
    if (statusFilter !== "All") {
      filtered = filtered.filter((patient) => patient.socWindowStatus === statusFilter)
    }

    // Referral type filter
    if (referralTypeFilter !== "All") {
      filtered = filtered.filter((patient) => patient.referralType === referralTypeFilter)
    }

    // LUPA filter
    if (lupaFilter !== "All") {
      filtered = filtered.filter((patient) => patient.lupaStatus === lupaFilter)
    }

    // Sort by priority (Hospital first, then Facility, then Clinic)
    const priorityOrder = { Hospital: 1, Facility: 2, Clinic: 3 }
    filtered.sort((a, b) => priorityOrder[a.referralType] - priorityOrder[b.referralType])

    return filtered
  }, [updatedPatients, searchTerm, staffFilter, locationFilter, statusFilter, referralTypeFilter, lupaFilter])

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const onTrack = updatedPatients.filter((p) => p.socWindowStatus === "On Track").length
    const dueSoon = updatedPatients.filter((p) => p.socWindowStatus === "Due Soon").length
    const overdue = updatedPatients.filter((p) => p.socWindowStatus === "Overdue").length
    const totalActive = updatedPatients.filter((p) => p.currentStatus === "Active").length
    const totalWoundCare = updatedPatients.filter((p) => p.woundCare?.hasWounds).length
    const hospitalReferrals = updatedPatients.filter((p) => p.referralType === "Hospital").length

    // LUPA statistics
    const lupaSafe = updatedPatients.filter((p) => p.lupaStatus === "Safe").length
    const lupaAtRisk = updatedPatients.filter((p) => p.lupaStatus === "At Risk").length
    const lupaOverThreshold = updatedPatients.filter((p) => p.lupaStatus === "Over Threshold").length

    // Financial statistics
    const totalEpisodeCost = updatedPatients.reduce((sum, p) => sum + p.totalEpisodeCost, 0)
    const totalProjectedCost = updatedPatients.reduce((sum, p) => sum + p.projectedCost, 0)

    // Re-evaluation alerts
    const reEvalDue = updatedPatients.filter((p) => {
      const reEvalDate = new Date(p.nextReEvalDate)
      const today = new Date()
      const daysDiff = (reEvalDate.getTime() - today.getTime()) / (1000 * 3600 * 24)
      return daysDiff <= 7 && daysDiff >= 0
    }).length

    const pendingReferrals = 4 // Mock data, in reality this would come from the referral system

    return {
      onTrack,
      dueSoon,
      overdue,
      totalActive,
      totalWoundCare,
      hospitalReferrals,
      lupaSafe,
      lupaAtRisk,
      lupaOverThreshold,
      totalEpisodeCost,
      totalProjectedCost,
      reEvalDue,
      pendingReferrals, // Add this
      total: updatedPatients.length,
    }
  }, [updatedPatients])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "On Track":
        return "bg-green-100 text-green-800"
      case "Due Soon":
        return "bg-yellow-100 text-yellow-800"
      case "Overdue":
        return "bg-red-100 text-red-800"
      case "Active":
        return "bg-blue-100 text-blue-800"
      case "Pending":
        return "bg-orange-100 text-orange-800"
      case "Discharged":
        return "bg-gray-100 text-gray-800"
      case "On Hold":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getLupaStatusColor = (status: string) => {
    switch (status) {
      case "Safe":
        return "bg-green-100 text-green-800"
      case "At Risk":
        return "bg-yellow-100 text-yellow-800"
      case "Over Threshold":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getReferralTypeColor = (type: string) => {
    switch (type) {
      case "Hospital":
        return "bg-red-100 text-red-800"
      case "Facility":
        return "bg-blue-100 text-blue-800"
      case "Clinic":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getReferralTypeIcon = (type: string) => {
    switch (type) {
      case "Hospital":
        return <Hospital className="h-3 w-3" />
      case "Facility":
        return <Building className="h-3 w-3" />
      case "Clinic":
        return <Stethoscope className="h-3 w-3" />
      default:
        return <Building className="h-3 w-3" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "Low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getWoundProgressColor = (progress: string) => {
    switch (progress) {
      case "Improving":
        return "text-green-600"
      case "Stable":
        return "text-yellow-600"
      case "Declining":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getGoalStatusColor = (status: string) => {
    switch (status) {
      case "Achieved":
        return "bg-green-100 text-green-800"
      case "In Progress":
        return "bg-blue-100 text-blue-800"
      case "Not Started":
        return "bg-gray-100 text-gray-800"
      case "Modified":
        return "bg-yellow-100 text-yellow-800"
      case "Discontinued":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const startStaffEvaluation = async (staffMember: any) => {
    setSelectedStaffForEvaluation(staffMember)
    setEvaluationInProgress(true)
    setShowCompetencyModal(true)

    // Start AI analysis simulation
    setTimeout(() => {
      setAiAnalysisResults([
        {
          category: "Clinical Skills",
          score: 92,
          insights: ["Excellent medication administration technique", "Proper sterile procedure followed"],
          recommendations: ["Continue current practices", "Consider mentoring junior staff"],
        },
        {
          category: "Communication",
          score: 88,
          insights: ["Good patient rapport", "Clear documentation"],
          recommendations: ["Improve interdisciplinary communication", "Practice active listening"],
        },
      ])
    }, 3000)
  }

  const completeEvaluation = async () => {
    setEvaluationInProgress(false)
    setShowCompetencyModal(false)
    // Save evaluation results
  }

  const getEligibilityColor = (status: string) => {
    switch (status) {
      case "Eligible":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Not Eligible":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAuthColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Denied":
        return "bg-red-100 text-red-800"
      case "Not Required":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link href="/">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">M.A.S.E AI Patient Tracking Dashboard</h1>
                <p className="text-gray-600">
                  AI-powered patient management with LUPA monitoring, visit frequency tracking, and Axxess integration
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm" onClick={syncWithAxxess} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                {isLoading ? "Syncing..." : "Sync Axxess"}
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Dialog open={showAddPatient} onOpenChange={setShowAddPatient}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Patient
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Add New Patient</DialogTitle>
                    <DialogDescription>Enter patient information and referral details</DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="patientName">Patient Name</Label>
                      <Input id="patientName" placeholder="Enter full name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="patientId">Patient ID</Label>
                      <Input id="patientId" placeholder="PT-2024-XXX" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="axxessId">Axxess ID</Label>
                      <Input id="axxessId" placeholder="AX-XXXXX" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="referralType">Referral Type</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Hospital">Hospital (High Priority)</SelectItem>
                          <SelectItem value="Facility">Facility (Medium Priority)</SelectItem>
                          <SelectItem value="Clinic">Clinic (Low Priority)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="assignedStaff">Assigned Staff</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select staff" />
                        </SelectTrigger>
                        <SelectContent>
                          {uniqueStaff.map((staff) => (
                            <SelectItem key={staff} value={staff}>
                              {staff}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          {uniqueLocations.map((location) => (
                            <SelectItem key={location} value={location}>
                              {location}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="socDueDate">SOC Due Date</Label>
                      <Input id="socDueDate" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="episodeStartDate">Episode Start Date</Label>
                      <Input id="episodeStartDate" type="date" />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="diagnosis">Diagnosis</Label>
                      <Textarea id="diagnosis" placeholder="Enter primary diagnosis and conditions" />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowAddPatient(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setShowAddPatient(false)}>Add Patient</Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Link href="/referral-management">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100"
                >
                  <Inbox className="h-4 w-4 mr-2" />
                  Process Referrals
                  <Badge className="ml-2 bg-indigo-500 text-white">{summaryStats.pendingReferrals}</Badge>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Critical Alerts */}
        {summaryStats.lupaOverThreshold > 0 && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertTitle className="text-red-800">LUPA Threshold Alert</AlertTitle>
            <AlertDescription className="text-red-700">
              {summaryStats.lupaOverThreshold} patient(s) are over the LUPA threshold. Review visit frequencies to
              prevent financial loss.
            </AlertDescription>
          </Alert>
        )}

        {summaryStats.reEvalDue > 0 && (
          <Alert className="mb-6 border-yellow-200 bg-yellow-50">
            <Calendar className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-800">Re-Evaluation Due</AlertTitle>
            <AlertDescription className="text-yellow-700">
              {summaryStats.reEvalDue} patient(s) have re-evaluations due within 7 days for potential visit
              authorization increases.
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Patient Overview</TabsTrigger>
            <TabsTrigger value="visit-frequency">Visit Frequency</TabsTrigger>
            <TabsTrigger value="lupa-monitoring">LUPA Monitoring</TabsTrigger>
            <TabsTrigger value="goals-tracking">Goals Tracking</TabsTrigger>
            <TabsTrigger value="performance-supervision">Performance & Supervision</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Enhanced Summary Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">On Track</p>
                      <p className="text-2xl font-bold text-green-600">{summaryStats.onTrack}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Clock className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Due Soon</p>
                      <p className="text-2xl font-bold text-yellow-600">{summaryStats.dueSoon}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Overdue</p>
                      <p className="text-2xl font-bold text-red-600">{summaryStats.overdue}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Active</p>
                      <p className="text-2xl font-bold text-blue-600">{summaryStats.totalActive}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Zap className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">LUPA Safe</p>
                      <p className="text-2xl font-bold text-green-600">{summaryStats.lupaSafe}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <AlertCircle className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">At Risk</p>
                      <p className="text-2xl font-bold text-yellow-600">{summaryStats.lupaAtRisk}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <DollarSign className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Over Threshold</p>
                      <p className="text-2xl font-bold text-red-600">{summaryStats.lupaOverThreshold}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Timer className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Re-Eval Due</p>
                      <p className="text-2xl font-bold text-purple-600">{summaryStats.reEvalDue}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <Inbox className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">New Referrals</p>
                      <p className="text-2xl font-bold text-indigo-600">{summaryStats.pendingReferrals}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Filters and Search */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters & Search
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
                  <div className="lg:col-span-2">
                    <Label htmlFor="search">Search Patients</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="search"
                        placeholder="Search by name, ID, Axxess ID, or diagnosis..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="staff-filter">Staff</Label>
                    <Select value={staffFilter} onValueChange={setStaffFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Staff</SelectItem>
                        {uniqueStaff.map((staff) => (
                          <SelectItem key={staff} value={staff}>
                            {staff}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="location-filter">Location</Label>
                    <Select value={locationFilter} onValueChange={setLocationFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Locations</SelectItem>
                        {uniqueLocations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="status-filter">SOC Status</Label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Statuses</SelectItem>
                        <SelectItem value="On Track">On Track</SelectItem>
                        <SelectItem value="Due Soon">Due Soon</SelectItem>
                        <SelectItem value="Overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="referral-filter">Referral Type</Label>
                    <Select value={referralTypeFilter} onValueChange={setReferralTypeFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All Types</SelectItem>
                        {uniqueReferralTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="lupa-filter">LUPA Status</Label>
                    <Select value={lupaFilter} onValueChange={setLupaFilter}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="All">All LUPA</SelectItem>
                        <SelectItem value="Safe">Safe</SelectItem>
                        <SelectItem value="At Risk">At Risk</SelectItem>
                        <SelectItem value="Over Threshold">Over Threshold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Patient Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Patient List ({filteredPatients.length} of {summaryStats.total})
                  </span>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{filteredPatients.length} patients shown</Badge>
                    {lastSync && (
                      <Badge variant="outline" className="text-xs">
                        Last sync: {new Date(lastSync).toLocaleTimeString()}
                      </Badge>
                    )}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="text-left p-3 font-medium">Patient Info</th>
                        <th className="text-left p-3 font-medium">Auth Status</th>
                        <th className="text-left p-3 font-medium">Episode Dates</th>
                        <th className="text-left p-3 font-medium">Axxess ID</th>
                        <th className="text-left p-3 font-medium">LUPA Status</th>
                        <th className="text-left p-3 font-medium">Visit Summary</th>
                        <th className="text-left p-3 font-medium">Episode Cost</th>
                        <th className="text-left p-3 font-medium">Re-Eval Date</th>
                        <th className="text-left p-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPatients.map((patient) => (
                        <tr key={patient.id} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="p-3">
                            <div>
                              <div className="font-medium">{patient.name}</div>
                              <div className="text-sm text-gray-600">{patient.id}</div>
                              <div className="text-xs text-gray-500">{patient.diagnosis}</div>
                              <div className="flex items-center mt-1 space-x-1">
                                <Badge className={getReferralTypeColor(patient.referralType)}>
                                  {getReferralTypeIcon(patient.referralType)}
                                  <span className="ml-1">{patient.referralType}</span>
                                </Badge>
                                <Badge className={getStatusColor(patient.currentStatus)}>{patient.currentStatus}</Badge>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex flex-col space-y-1">
                              <Badge
                                className={getEligibilityColor(
                                  patient.id === "PT-2024-001"
                                    ? "Eligible"
                                    : patient.id === "PT-2024-002"
                                      ? "Eligible"
                                      : "Not Checked",
                                )}
                              >
                                {patient.id === "PT-2024-001"
                                  ? "Eligible"
                                  : patient.id === "PT-2024-002"
                                    ? "Eligible"
                                    : "Not Checked"}
                              </Badge>
                              <Badge
                                className={getAuthColor(
                                  patient.id === "PT-2024-001"
                                    ? "Approved"
                                    : patient.id === "PT-2024-002"
                                      ? "Pending"
                                      : "Not Required",
                                )}
                              >
                                {patient.id === "PT-2024-001"
                                  ? "Approved"
                                  : patient.id === "PT-2024-002"
                                    ? "Pending"
                                    : "Not Required"}
                              </Badge>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="text-sm">
                              <div>Start: {patient.episodeStartDate}</div>
                              <div>End: {patient.episodeEndDate}</div>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="font-mono text-sm">{patient.axxessId}</div>
                          </td>
                          <td className="p-3">
                            <Badge className={getLupaStatusColor(patient.lupaStatus)}>{patient.lupaStatus}</Badge>
                          </td>
                          <td className="p-3">
                            <div className="space-y-1">
                              {patient.visitFrequencies.map((freq, index) => (
                                <div key={index} className="flex items-center text-xs">
                                  <span className="font-medium w-8">{freq.discipline}:</span>
                                  <span className={freq.isOverThreshold ? "text-red-600 font-medium" : "text-gray-600"}>
                                    {freq.used}/{freq.authorized}
                                  </span>
                                  {freq.isOverThreshold && <AlertTriangle className="h-3 w-3 text-red-500 ml-1" />}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="text-sm">
                              <div className="font-medium">${patient.totalEpisodeCost.toFixed(2)}</div>
                              <div className="text-gray-500">Proj: ${patient.projectedCost.toFixed(2)}</div>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="text-sm">
                              {patient.nextReEvalDate}
                              {(() => {
                                const reEvalDate = new Date(patient.nextReEvalDate)
                                const today = new Date()
                                const daysDiff = Math.ceil(
                                  (reEvalDate.getTime() - today.getTime()) / (1000 * 3600 * 24),
                                )
                                if (daysDiff <= 7 && daysDiff >= 0) {
                                  return <Badge className="ml-1 bg-yellow-100 text-yellow-800 text-xs">Due Soon</Badge>
                                }
                                return null
                              })()}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedPatient(patient)
                                  setShowPatientDetails(true)
                                }}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <BarChart3 className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="visit-frequency" className="space-y-6">
            {/* Visit Frequency Management */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <UserCheck className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">RN Visits</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {updatedPatients.reduce(
                          (sum, p) =>
                            sum +
                            p.visitFrequencies.filter((v) => v.discipline === "RN").reduce((s, v) => s + v.used, 0),
                          0,
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Activity className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">PT Visits</p>
                      <p className="text-2xl font-bold text-green-600">
                        {updatedPatients.reduce(
                          (sum, p) =>
                            sum +
                            p.visitFrequencies.filter((v) => v.discipline === "PT").reduce((s, v) => s + v.used, 0),
                          0,
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Target className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">OT Visits</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {updatedPatients.reduce(
                          (sum, p) =>
                            sum +
                            p.visitFrequencies.filter((v) => v.discipline === "OT").reduce((s, v) => s + v.used, 0),
                          0,
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Users className="h-6 w-6 text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">MSW Visits</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {updatedPatients.reduce(
                          (sum, p) =>
                            sum +
                            p.visitFrequencies.filter((v) => v.discipline === "MSW").reduce((s, v) => s + v.used, 0),
                          0,
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Visit Frequency Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Visit Frequency Details
                </CardTitle>
                <CardDescription>Monitor visit utilization and prevent over-visits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {filteredPatients.map((patient) => (
                    <div key={patient.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium">{patient.name}</h3>
                          <p className="text-sm text-gray-600">
                            {patient.id} • {patient.axxessId}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getLupaStatusColor(patient.lupaStatus)}>{patient.lupaStatus}</Badge>
                          <Badge variant="outline">
                            Episode: {patient.episodeStartDate} - {patient.episodeEndDate}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {patient.visitFrequencies.map((freq, index) => (
                          <div
                            key={index}
                            className={`p-3 rounded border ${freq.isOverThreshold ? "border-red-200 bg-red-50" : "border-gray-200 bg-gray-50"}`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-lg">{freq.discipline}</span>
                              {freq.isOverThreshold && <AlertTriangle className="h-4 w-4 text-red-500" />}
                            </div>

                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Used/Authorized:</span>
                                <span className={freq.isOverThreshold ? "text-red-600 font-medium" : ""}>
                                  {freq.used}/{freq.authorized}
                                </span>
                              </div>

                              <Progress
                                value={(freq.used / freq.authorized) * 100}
                                className={`h-2 ${freq.isOverThreshold ? "bg-red-100" : ""}`}
                              />

                              <div className="flex justify-between text-sm">
                                <span>Remaining:</span>
                                <span className={freq.remaining < 2 ? "text-yellow-600 font-medium" : ""}>
                                  {freq.remaining}
                                </span>
                              </div>

                              <div className="flex justify-between text-sm">
                                <span>Frequency:</span>
                                <span>{freq.weeklyFrequency}</span>
                              </div>

                              <div className="flex justify-between text-sm">
                                <span>Cost:</span>
                                <span>${freq.totalCost.toFixed(2)}</span>
                              </div>

                              <div className="flex justify-between text-sm">
                                <span>Next Visit:</span>
                                <span>{freq.nextScheduled}</span>
                              </div>

                              {freq.isOverThreshold && (
                                <div className="text-xs text-red-600 font-medium">
                                  ⚠️ Over LUPA threshold ({freq.lupaThreshold})
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* PT/OT Shared Frequency Alert */}
                      {patient.visitFrequencies.some((f) => f.discipline === "PT") &&
                        patient.visitFrequencies.some((f) => f.discipline === "OT") && (
                          <Alert className="mt-4 border-blue-200 bg-blue-50">
                            <AlertCircle className="h-4 w-4 text-blue-600" />
                            <AlertTitle className="text-blue-800">PT/OT Shared Frequency</AlertTitle>
                            <AlertDescription className="text-blue-700">
                              Both PT and OT are on this case. Monitor combined visit frequency to prevent over-visits
                              while ensuring patient goals are met.
                            </AlertDescription>
                          </Alert>
                        )}

                      <div className="flex space-x-2 mt-4">
                        <Button size="sm" variant="outline">
                          <Calendar className="h-3 w-3 mr-1" />
                          Schedule Visit
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3 mr-1" />
                          Adjust Frequency
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="h-3 w-3 mr-1" />
                          Request Auth
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lupa-monitoring" className="space-y-6">
            {/* LUPA Monitoring Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">LUPA Compliance Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {Math.round((summaryStats.lupaSafe / summaryStats.total) * 100)}%
                    </div>
                    <p className="text-sm text-gray-600">Patients within safe threshold</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Financial Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      ${(summaryStats.totalProjectedCost - summaryStats.totalEpisodeCost).toFixed(0)}
                    </div>
                    <p className="text-sm text-gray-600">Projected additional cost</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Risk Assessment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">High Risk:</span>
                      <span className="font-medium text-red-600">{summaryStats.lupaOverThreshold}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Medium Risk:</span>
                      <span className="font-medium text-yellow-600">{summaryStats.lupaAtRisk}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Low Risk:</span>
                      <span className="font-medium text-green-600">{summaryStats.lupaSafe}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* LUPA Details */}
            <Card>
              <CardHeader>
                <CardTitle>LUPA Threshold Monitoring</CardTitle>
                <CardDescription>Track patients approaching or exceeding LUPA thresholds</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredPatients
                    .filter((p) => p.lupaStatus !== "Safe")
                    .map((patient) => (
                      <div
                        key={patient.id}
                        className={`p-4 border rounded-lg ${
                          patient.lupaStatus === "Over Threshold"
                            ? "border-red-200 bg-red-50"
                            : "border-yellow-200 bg-yellow-50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-medium">{patient.name}</h3>
                            <p className="text-sm text-gray-600">
                              {patient.id} • {patient.axxessId}
                            </p>
                          </div>
                          <Badge className={getLupaStatusColor(patient.lupaStatus)}>{patient.lupaStatus}</Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="p-3 bg-white rounded border">
                            <p className="text-sm font-medium text-gray-700">Current Episode Cost</p>
                            <p className="text-lg font-bold">${patient.totalEpisodeCost.toFixed(2)}</p>
                          </div>
                          <div className="p-3 bg-white rounded border">
                            <p className="text-sm font-medium text-gray-700">Projected Cost</p>
                            <p className="text-lg font-bold text-orange-600">${patient.projectedCost.toFixed(2)}</p>
                          </div>
                          <div className="p-3 bg-white rounded border">
                            <p className="text-sm font-medium text-gray-700">Potential Overage</p>
                            <p className="text-lg font-bold text-red-600">
                              ${(patient.projectedCost - patient.totalEpisodeCost).toFixed(2)}
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                          {patient.visitFrequencies.map((freq, index) => (
                            <div
                              key={index}
                              className={`text-center p-2 rounded text-sm ${
                                freq.isOverThreshold ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              <div className="font-medium">{freq.discipline}</div>
                              <div>
                                {freq.used}/{freq.authorized}
                              </div>
                              {freq.isOverThreshold && <div className="text-xs">Over Threshold</div>}
                            </div>
                          ))}
                        </div>

                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Review Case
                          </Button>
                          <Button size="sm" variant="outline">
                            <FileText className="h-3 w-3 mr-1" />
                            Request Re-Auth
                          </Button>
                          <Button size="sm" variant="outline">
                            <DollarSign className="h-3 w-3 mr-1" />
                            Cost Analysis
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals-tracking" className="space-y-6">
            {/* Goals Tracking Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Achieved</p>
                      <p className="text-2xl font-bold text-green-600">
                        {updatedPatients.reduce(
                          (sum, p) => sum + p.patientGoals.filter((g) => g.status === "Achieved").length,
                          0,
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Activity className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">In Progress</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {updatedPatients.reduce(
                          (sum, p) => sum + p.patientGoals.filter((g) => g.status === "In Progress").length,
                          0,
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Clock className="h-6 w-6 text-gray-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Not Started</p>
                      <p className="text-2xl font-bold text-gray-600">
                        {updatedPatients.reduce(
                          (sum, p) => sum + p.patientGoals.filter((g) => g.status === "Not Started").length,
                          0,
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <Target className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Modified</p>
                      <p className="text-2xl font-bold text-yellow-600">
                        {updatedPatients.reduce(
                          (sum, p) => sum + p.patientGoals.filter((g) => g.status === "Modified").length,
                          0,
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Patient Goals Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Patient Goals Tracking
                </CardTitle>
                <CardDescription>Monitor patient progress towards therapy goals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {filteredPatients.map((patient) => (
                    <div key={patient.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium">{patient.name}</h3>
                          <p className="text-sm text-gray-600">
                            {patient.id} • {patient.assignedStaff}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">{patient.patientGoals.length} Goals</Badge>
                          <Badge className={getLupaStatusColor(patient.lupaStatus)}>{patient.lupaStatus}</Badge>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {patient.patientGoals.map((goal) => (
                          <div key={goal.id} className="p-3 bg-gray-50 rounded border">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline" className="text-xs">
                                  {goal.discipline}
                                </Badge>
                                <Badge className={getGoalStatusColor(goal.status)}>{goal.status}</Badge>
                              </div>
                              <span className="text-sm text-gray-600">Target: {goal.targetDate}</span>
                            </div>

                            <p className="font-medium mb-2">{goal.goal}</p>

                            <div className="mb-2">
                              <div className="flex justify-between text-sm mb-1">
                                <span>Progress</span>
                                <span>{goal.progress}%</span>
                              </div>
                              <Progress value={goal.progress} className="h-2" />
                            </div>

                            {goal.notes && <p className="text-sm text-gray-600 italic">Notes: {goal.notes}</p>}
                          </div>
                        ))}
                      </div>

                      <div className="flex space-x-2 mt-4">
                        <Button size="sm" variant="outline">
                          <Plus className="h-3 w-3 mr-1" />
                          Add Goal
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3 mr-1" />
                          Update Progress
                        </Button>
                        <Button size="sm" variant="outline">
                          <FileText className="h-3 w-3 mr-1" />
                          Progress Report
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance-supervision" className="space-y-6">
            {/* Staff Performance Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <UserCheck className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Active Staff</p>
                      <p className="text-2xl font-bold text-blue-600">24</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Award className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Competent</p>
                      <p className="text-2xl font-bold text-green-600">21</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <BookOpen className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">In Training</p>
                      <p className="text-2xl font-bold text-yellow-600">2</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Needs Improvement</p>
                      <p className="text-2xl font-bold text-red-600">1</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Live Supervision Center */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Video className="h-5 w-5 mr-2 text-indigo-600" />
                  Live Supervision & AI Evaluation Center
                </CardTitle>
                <CardDescription>
                  Conduct live supervision visits with AI-powered analysis for RN, LPN, and HHA staff
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Video Controls */}
                  <div className="lg:col-span-2 space-y-4">
                    {/* Staff Selection */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Staff Member</Label>
                        <Select value={selectedStaffMember} onValueChange={setSelectedStaffMember}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select staff member" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sarah-johnson">Sarah Johnson, RN</SelectItem>
                            <SelectItem value="michael-chen">Michael Chen, PT</SelectItem>
                            <SelectItem value="emily-davis">Emily Davis, OT</SelectItem>
                            <SelectItem value="lisa-garcia">Lisa Garcia, LPN</SelectItem>
                            <SelectItem value="david-rodriguez">David Rodriguez, HHA</SelectItem>
                            <SelectItem value="jennifer-martinez">Jennifer Martinez, RN</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Supervision Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="initial-competency">Initial Competency</SelectItem>
                            <SelectItem value="annual-evaluation">Annual Evaluation</SelectItem>
                            <SelectItem value="skills-validation">Skills Validation</SelectItem>
                            <SelectItem value="performance-improvement">Performance Improvement</SelectItem>
                            <SelectItem value="lpn-supervision">LPN Supervision Visit</SelectItem>
                            <SelectItem value="hha-supervision">HHA Supervision Visit</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Video Player */}
                    <div className="relative bg-black rounded-lg overflow-hidden">
                      <div className="w-full h-64 bg-gray-900 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p className="text-sm opacity-75">Live Supervision Feed</p>
                          <p className="text-xs opacity-50">Click "Start Supervision" to begin</p>
                        </div>
                      </div>

                      {/* Video Overlay Controls */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                        <div className="flex items-center space-x-2 text-white">
                          {isRecordingSupervision && (
                            <>
                              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                              <span className="text-sm font-medium">
                                SUPERVISING {Math.floor(supervisionTime / 60)}:
                                {(supervisionTime % 60).toString().padStart(2, "0")}
                              </span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center space-x-2">
                          {aiInsights.length > 0 && (
                            <Badge className="bg-purple-500 text-white pointer-events-auto">
                              <Brain className="h-3 w-3 mr-1" />
                              AI Analyzing
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-center space-x-4">
                      {!isRecordingSupervision ? (
                        <Button className="bg-indigo-600 hover:bg-indigo-700" disabled={!selectedStaffMember}>
                          <Play className="h-4 w-4 mr-2" />
                          Start Supervision
                        </Button>
                      ) : (
                        <>
                          <Button variant="outline">
                            <Mic className="h-4 w-4" />
                          </Button>
                          <Button variant="outline">
                            <Camera className="h-4 w-4" />
                          </Button>
                          <Button variant="outline">
                            <Square className="h-4 w-4 mr-2" />
                            End Supervision
                          </Button>
                        </>
                      )}
                    </div>

                    {/* Supervision Notes */}
                    <div className="space-y-2">
                      <Label>Live Supervision Notes</Label>
                      <Textarea
                        placeholder="Add real-time observations and feedback..."
                        value={supervisionNotes}
                        onChange={(e) => setSupervisionNotes(e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Right Panel - AI Insights and Competency Checklist */}
                  <div className="space-y-4">
                    {/* AI Performance Insights */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center">
                          <Brain className="h-4 w-4 mr-2 text-purple-600" />
                          AI Performance Analysis
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3 max-h-48 overflow-y-auto">
                          <div className="p-3 rounded-lg border-l-4 border-l-green-500 bg-green-50">
                            <div className="flex items-center justify-between mb-1">
                              <Badge variant="outline" className="text-xs">
                                Communication
                              </Badge>
                              <span className="text-xs text-gray-500">95% confidence</span>
                            </div>
                            <p className="text-sm text-gray-700">Excellent patient rapport and clear explanations</p>
                            <div className="flex items-center mt-2">
                              <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                              <span className="text-xs text-gray-500">2:15</span>
                            </div>
                          </div>

                          <div className="p-3 rounded-lg border-l-4 border-l-blue-500 bg-blue-50">
                            <div className="flex items-center justify-between mb-1">
                              <Badge variant="outline" className="text-xs">
                                Clinical Skills
                              </Badge>
                              <span className="text-xs text-gray-500">92% confidence</span>
                            </div>
                            <p className="text-sm text-gray-700">Proper hand hygiene and sterile technique observed</p>
                            <div className="flex items-center mt-2">
                              <CheckCircle className="h-3 w-3 text-blue-500 mr-1" />
                              <span className="text-xs text-gray-500">3:45</span>
                            </div>
                          </div>

                          <div className="p-3 rounded-lg border-l-4 border-l-yellow-500 bg-yellow-50">
                            <div className="flex items-center justify-between mb-1">
                              <Badge variant="outline" className="text-xs">
                                Documentation
                              </Badge>
                              <span className="text-xs text-gray-500">78% confidence</span>
                            </div>
                            <p className="text-sm text-gray-700">Consider documenting patient response in real-time</p>
                            <div className="flex items-center mt-2">
                              <AlertTriangle className="h-3 w-3 text-yellow-500 mr-1" />
                              <span className="text-xs text-gray-500">5:20</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Competency Checklist */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center justify-between">
                          <span className="flex items-center">
                            <Shield className="h-4 w-4 mr-2 text-green-600" />
                            Competency Checklist
                          </span>
                          <span className="text-xs text-gray-500">8/12</span>
                        </CardTitle>
                        <Progress value={67} className="h-2" />
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                          {[
                            { item: "Hand hygiene protocol", completed: true, category: "Safety" },
                            { item: "Patient identification", completed: true, category: "Safety" },
                            { item: "Medication administration", completed: true, category: "Clinical" },
                            { item: "Vital signs assessment", completed: true, category: "Clinical" },
                            { item: "Wound care technique", completed: true, category: "Clinical" },
                            { item: "Patient education", completed: true, category: "Communication" },
                            { item: "Documentation accuracy", completed: false, category: "Documentation" },
                            { item: "Emergency procedures", completed: true, category: "Safety" },
                            { item: "Infection control", completed: true, category: "Safety" },
                            { item: "Professional communication", completed: false, category: "Communication" },
                            { item: "Time management", completed: false, category: "Efficiency" },
                            { item: "Critical thinking", completed: false, category: "Clinical" },
                          ].map((item, index) => (
                            <div key={index} className="flex items-start space-x-3">
                              <CheckCircle
                                className={`h-4 w-4 mt-0.5 ${item.completed ? "text-green-500" : "text-gray-300"}`}
                              />
                              <div className="flex-1">
                                <p className={`text-sm ${item.completed ? "text-gray-700" : "text-gray-500"}`}>
                                  {item.item}
                                </p>
                                <Badge variant="outline" className="text-xs mt-1">
                                  {item.category}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Staff Performance Dashboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Staff Performance Dashboard
                </CardTitle>
                <CardDescription>Monitor staff competency levels and supervision requirements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* RN Staff */}
                  <div>
                    <h3 className="font-medium mb-3 flex items-center">
                      <UserCheck className="h-4 w-4 mr-2 text-blue-600" />
                      Registered Nurses (RN)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        {
                          name: "Sarah Johnson",
                          competencyScore: 95,
                          lastEval: "2024-01-15",
                          status: "Competent",
                          nextDue: "2025-01-15",
                          nextDue: "2025-01-15",
                        },
                        {
                          name: "Jennifer Martinez",
                          competencyScore: 88,
                          lastEval: "2024-01-10",
                          status: "Competent",
                          nextDue: "2025-01-10",
                        },
                        {
                          name: "Patricia Wilson",
                          competencyScore: 92,
                          lastEval: "2024-01-08",
                          status: "Competent",
                          nextDue: "2025-01-08",
                        },
                      ].map((staff, index) => (
                        <div key={index} className="p-4 border rounded-lg bg-blue-50">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{staff.name}</h4>
                            <Badge className="bg-blue-100 text-blue-800">{staff.status}</Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Competency Score:</span>
                              <span className="font-medium">{staff.competencyScore}%</span>
                            </div>
                            <Progress value={staff.competencyScore} className="h-2" />
                            <div className="flex justify-between text-xs text-gray-600">
                              <span>Last Eval: {staff.lastEval}</span>
                              <span>Next Due: {staff.nextDue}</span>
                            </div>
                          </div>
                          <div className="flex space-x-2 mt-3">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="outline">
                              <Video className="h-3 w-3 mr-1" />
                              Supervise
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                startStaffEvaluation({
                                  name: "Sarah Johnson",
                                  role: "RN",
                                  id: "STAFF-001",
                                })
                              }
                            >
                              <Brain className="h-3 w-3 mr-1" />
                              AI Evaluate
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* LPN Staff */}
                  <div>
                    <h3 className="font-medium mb-3 flex items-center">
                      <UserCheck className="h-4 w-4 mr-2 text-green-600" />
                      Licensed Practical Nurses (LPN)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        {
                          name: "Lisa Garcia",
                          competencyScore: 85,
                          lastSupervision: "2024-01-20",
                          status: "Competent",
                          nextDue: "2024-02-20",
                          supervisorRequired: true,
                        },
                        {
                          name: "Maria Rodriguez",
                          competencyScore: 78,
                          lastSupervision: "2024-01-18",
                          status: "In Training",
                          nextDue: "2024-02-18",
                          supervisorRequired: true,
                        },
                      ].map((staff, index) => (
                        <div key={index} className="p-4 border rounded-lg bg-green-50">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{staff.name}</h4>
                            <Badge
                              className={
                                staff.status === "Competent"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {staff.status}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Competency Score:</span>
                              <span className="font-medium">{staff.competencyScore}%</span>
                            </div>
                            <Progress value={staff.competencyScore} className="h-2" />
                            <div className="flex justify-between text-xs text-gray-600">
                              <span>Last Supervision: {staff.lastSupervision}</span>
                              <span>Next Due: {staff.nextDue}</span>
                            </div>
                            {staff.supervisorRequired && (
                              <div className="flex items-center text-xs text-orange-600">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                RN Supervision Required
                              </div>
                            )}
                          </div>
                          <div className="flex space-x-2 mt-3">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="outline">
                              <Video className="h-3 w-3 mr-1" />
                              Supervise
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* HHA Staff */}
                  <div>
                    <h3 className="font-medium mb-3 flex items-center">
                      <UserCheck className="h-4 w-4 mr-2 text-purple-600" />
                      Home Health Aides (HHA)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        {
                          name: "Robert Wilson",
                          competencyScore: 82,
                          lastSupervision: "2024-01-19",
                          status: "Competent",
                          nextDue: "2024-02-19",
                          supervisorRequired: true,
                        },
                        {
                          name: "Angela Davis",
                          competencyScore: 75,
                          lastSupervision: "2024-01-17",
                          status: "Needs Improvement",
                          nextDue: "2024-02-01",
                          supervisorRequired: true,
                        },
                        {
                          name: "Carlos Martinez",
                          competencyScore: 88,
                          lastSupervision: "2024-01-21",
                          status: "Competent",
                          nextDue: "2024-02-21",
                          supervisorRequired: true,
                        },
                      ].map((staff, index) => (
                        <div key={index} className="p-4 border rounded-lg bg-purple-50">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{staff.name}</h4>
                            <Badge
                              className={
                                staff.status === "Competent"
                                  ? "bg-green-100 text-green-800"
                                  : staff.status === "Needs Improvement"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {staff.status}
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Competency Score:</span>
                              <span className="font-medium">{staff.competencyScore}%</span>
                            </div>
                            <Progress value={staff.competencyScore} className="h-2" />
                            <div className="flex justify-between text-xs text-gray-600">
                              <span>Last Supervision: {staff.lastSupervision}</span>
                              <span>Next Due: {staff.nextDue}</span>
                            </div>
                            {staff.supervisorRequired && (
                              <div className="flex items-center text-xs text-orange-600">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                RN Supervision Required
                              </div>
                            )}
                          </div>
                          <div className="flex space-x-2 mt-3">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button size="sm" variant="outline">
                              <Video className="h-3 w-3 mr-1" />
                              Supervise
                            </Button>
                            {staff.status === "Needs Improvement" && (
                              <Button size="sm" variant="outline" className="text-red-600 bg-transparent">
                                <AlertTriangle className="h-3 w-3 mr-1" />
                                PIP
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Improvement Plans */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Performance Improvement Plans
                </CardTitle>
                <CardDescription>Active improvement plans and competency development</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg border-red-200 bg-red-50">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium">Angela Davis - HHA</h3>
                        <p className="text-sm text-gray-600">Performance Improvement Plan</p>
                      </div>
                      <Badge className="bg-red-100 text-red-800">Active</Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="p-3 bg-white rounded border">
                        <p className="text-sm font-medium text-gray-700">Issue Identified</p>
                        <p className="text-sm">Inconsistent documentation and time management</p>
                      </div>
                      <div className="p-3 bg-white rounded border">
                        <p className="text-sm font-medium text-gray-700">Target Improvement</p>
                        <p className="text-sm">Achieve 85% competency score within 30 days</p>
                      </div>
                      <div className="p-3 bg-white rounded border">
                        <p className="text-sm font-medium text-gray-700">Next Review</p>
                        <p className="text-sm">February 1, 2024</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span>Progress:</span>
                        <span>60% Complete</span>
                      </div>
                      <Progress value={60} className="h-2" />
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <FileText className="h-3 w-3 mr-1" />
                        View Plan
                      </Button>
                      <Button size="sm" variant="outline">
                        <Video className="h-3 w-3 mr-1" />
                        Schedule Supervision
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3 mr-1" />
                        Update Progress
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Supervision Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Supervision Schedule
                </CardTitle>
                <CardDescription>Upcoming supervision visits and evaluations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      staff: "Lisa Garcia, LPN",
                      type: "Monthly Supervision",
                      date: "2024-01-25",
                      time: "10:00 AM",
                      supervisor: "Sarah Johnson, RN",
                    },
                    {
                      staff: "Robert Wilson, HHA",
                      type: "Competency Evaluation",
                      date: "2024-01-26",
                      time: "2:00 PM",
                      supervisor: "Jennifer Martinez, RN",
                    },
                    {
                      staff: "Angela Davis, HHA",
                      type: "PIP Review",
                      date: "2024-01-27",
                      time: "9:00 AM",
                      supervisor: "Patricia Wilson, RN",
                    },
                    {
                      staff: "Maria Rodriguez, LPN",
                      type: "Skills Validation",
                      date: "2024-01-28",
                      time: "11:00 AM",
                      supervisor: "Sarah Johnson, RN",
                    },
                  ].map((supervision, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-blue-100 rounded">
                          <Calendar className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{supervision.staff}</p>
                          <p className="text-xs text-gray-600">{supervision.type}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {supervision.date} at {supervision.time}
                        </p>
                        <p className="text-xs text-gray-600">Supervisor: {supervision.supervisor}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
