"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Star,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  FileText,
  Users,
  BarChart3,
} from "lucide-react"
import Link from "next/link"

export default function QualityAssurance() {
  const [selectedStaff, setSelectedStaff] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState("month")

  const qualityMetrics = [
    {
      id: "patient-satisfaction",
      name: "Patient Satisfaction",
      current: 4.6,
      target: 4.5,
      trend: "up",
      change: "+0.2",
      unit: "/5.0",
    },
    {
      id: "care-quality",
      name: "Care Quality Score",
      current: 92,
      target: 90,
      trend: "up",
      change: "+3%",
      unit: "%",
    },
    {
      id: "incident-rate",
      name: "Incident Rate",
      current: 0.8,
      target: 1.0,
      trend: "down",
      change: "-0.3",
      unit: "%",
    },
    {
      id: "compliance-score",
      name: "Compliance Score",
      current: 96,
      target: 95,
      trend: "up",
      change: "+1%",
      unit: "%",
    },
  ]

  const staffPerformance = [
    {
      id: "1",
      name: "Sarah Johnson",
      role: "RN",
      patientSatisfaction: 4.8,
      qualityScore: 94,
      incidentCount: 0,
      complianceRate: 98,
      trend: "up",
    },
    {
      id: "2",
      name: "Michael Chen",
      role: "PT",
      patientSatisfaction: 4.7,
      qualityScore: 91,
      incidentCount: 1,
      complianceRate: 95,
      trend: "stable",
    },
    {
      id: "3",
      name: "Emily Davis",
      role: "OT",
      patientSatisfaction: 4.5,
      qualityScore: 89,
      incidentCount: 0,
      complianceRate: 97,
      trend: "up",
    },
    {
      id: "4",
      name: "Robert Wilson",
      role: "HHA",
      patientSatisfaction: 4.3,
      qualityScore: 87,
      incidentCount: 2,
      complianceRate: 92,
      trend: "down",
    },
  ]

  const incidentReports = [
    {
      id: "INC-001",
      date: "2024-01-14",
      type: "Medication Error",
      severity: "Low",
      staff: "Michael Chen",
      status: "Resolved",
      description: "Incorrect dosage administered, corrected immediately",
    },
    {
      id: "INC-002",
      date: "2024-01-12",
      type: "Fall Risk",
      severity: "Medium",
      staff: "Robert Wilson",
      status: "Under Review",
      description: "Patient fall during transfer, no injury sustained",
    },
    {
      id: "INC-003",
      date: "2024-01-10",
      type: "Documentation",
      severity: "Low",
      staff: "Sarah Johnson",
      status: "Resolved",
      description: "Missing signature on care plan, corrected",
    },
  ]

  const patientFeedback = [
    {
      id: "FB-001",
      patient: "Anonymous",
      staff: "Sarah Johnson",
      rating: 5,
      date: "2024-01-15",
      comment: "Excellent care and very professional. Sarah was attentive and caring.",
      category: "Care Quality",
    },
    {
      id: "FB-002",
      patient: "Anonymous",
      staff: "Michael Chen",
      rating: 4,
      date: "2024-01-14",
      comment: "Good therapy sessions, helped me improve mobility significantly.",
      category: "Treatment Effectiveness",
    },
    {
      id: "FB-003",
      patient: "Anonymous",
      staff: "Emily Davis",
      rating: 5,
      date: "2024-01-13",
      comment: "Very knowledgeable and patient. Explained everything clearly.",
      category: "Communication",
    },
  ]

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <div className="h-4 w-4" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "resolved":
        return "bg-green-100 text-green-800"
      case "under review":
        return "bg-yellow-100 text-yellow-800"
      case "pending":
        return "bg-orange-100 text-orange-800"
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
                <h1 className="text-2xl font-bold text-gray-900">Quality Assurance</h1>
                <p className="text-gray-600">Monitor and improve care quality standards</p>
              </div>
            </div>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              New Incident Report
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Staff Performance</TabsTrigger>
            <TabsTrigger value="incidents">Incident Reports</TabsTrigger>
            <TabsTrigger value="feedback">Patient Feedback</TabsTrigger>
            <TabsTrigger value="improvement">Improvement Plans</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Quality Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {qualityMetrics.map((metric) => (
                <Card key={metric.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-sm">{metric.name}</h3>
                      {getTrendIcon(metric.trend)}
                    </div>
                    <div className="flex items-baseline space-x-2">
                      <p className="text-2xl font-bold">{metric.current}</p>
                      <span className="text-sm text-gray-600">{metric.unit}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        Target: {metric.target}
                        {metric.unit}
                      </span>
                      <span className={`text-xs ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                        {metric.change}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quality Trends Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Quality Trends</CardTitle>
                <CardDescription>Track quality metrics over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {qualityMetrics.map((metric) => (
                    <div key={metric.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{metric.name}</span>
                        <span className="text-sm text-gray-600">
                          {metric.current}
                          {metric.unit}
                        </span>
                      </div>
                      <Progress value={(metric.current / (metric.target * 1.2)) * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>Quality Alerts</CardTitle>
                <CardDescription>Items requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      type: "Patient Satisfaction",
                      message: "Robert Wilson's patient satisfaction below threshold",
                      priority: "medium",
                    },
                    {
                      type: "Incident Rate",
                      message: "Increase in medication errors this week",
                      priority: "high",
                    },
                    {
                      type: "Compliance",
                      message: "3 staff members need compliance training update",
                      priority: "low",
                    },
                  ].map((alert, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{alert.type}</p>
                        <p className="text-sm text-gray-600">{alert.message}</p>
                      </div>
                      <Badge variant={alert.priority === "high" ? "destructive" : "secondary"}>{alert.priority}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            {/* Staff Performance Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Staff Performance Metrics</CardTitle>
                <CardDescription>Individual quality performance tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {staffPerformance.map((staff) => (
                    <div key={staff.id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Users className="h-8 w-8 text-blue-500" />
                          <div>
                            <h3 className="font-medium">{staff.name}</h3>
                            <p className="text-sm text-gray-600">{staff.role}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {getTrendIcon(staff.trend)}
                          <Badge variant="outline">{staff.trend}</Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Patient Satisfaction</p>
                          <div className="flex items-center space-x-1">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="font-medium">{staff.patientSatisfaction}/5.0</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-600">Quality Score</p>
                          <p className="font-medium">{staff.qualityScore}%</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Incidents</p>
                          <p className="font-medium">{staff.incidentCount}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Compliance</p>
                          <p className="font-medium">{staff.complianceRate}%</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Comparison */}
            <Card>
              <CardHeader>
                <CardTitle>Department Comparison</CardTitle>
                <CardDescription>Compare performance across departments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { dept: "Nursing", satisfaction: 4.6, quality: 92, compliance: 96 },
                    { dept: "Therapy", satisfaction: 4.5, quality: 90, compliance: 94 },
                    { dept: "Home Health", satisfaction: 4.4, quality: 88, compliance: 93 },
                    { dept: "Social Work", satisfaction: 4.7, quality: 94, compliance: 97 },
                  ].map((dept) => (
                    <div key={dept.dept} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{dept.dept}</span>
                        <span className="text-sm text-gray-600">
                          Avg:{" "}
                          {(((dept.satisfaction / 5 + dept.quality / 100 + dept.compliance / 100) / 3) * 100).toFixed(
                            0,
                          )}
                          %
                        </span>
                      </div>
                      <Progress
                        value={((dept.satisfaction / 5 + dept.quality / 100 + dept.compliance / 100) / 3) * 100}
                        className="h-2"
                      />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Satisfaction: {dept.satisfaction}/5</span>
                        <span>Quality: {dept.quality}%</span>
                        <span>Compliance: {dept.compliance}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="incidents" className="space-y-6">
            {/* Incident Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <AlertTriangle className="h-8 w-8 text-red-500 mr-3" />
                    <div>
                      <p className="text-2xl font-bold">3</p>
                      <p className="text-gray-600 text-sm">Open Incidents</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
                    <div>
                      <p className="text-2xl font-bold">15</p>
                      <p className="text-gray-600 text-sm">Resolved This Month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <BarChart3 className="h-8 w-8 text-blue-500 mr-3" />
                    <div>
                      <p className="text-2xl font-bold">0.8%</p>
                      <p className="text-gray-600 text-sm">Incident Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Incident Reports List */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Incident Reports</CardTitle>
                <CardDescription>Track and manage quality incidents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {incidentReports.map((incident) => (
                    <div key={incident.id} className="p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-medium">
                            {incident.id} - {incident.type}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {incident.staff} • {incident.date}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Badge className={getSeverityColor(incident.severity)}>{incident.severity}</Badge>
                          <Badge className={getStatusColor(incident.status)}>{incident.status}</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-3">{incident.description}</p>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        {incident.status !== "Resolved" && <Button size="sm">Update Status</Button>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6">
            {/* Patient Feedback Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Star className="h-8 w-8 text-yellow-500 mr-3" />
                    <div>
                      <p className="text-2xl font-bold">4.6</p>
                      <p className="text-gray-600 text-sm">Average Rating</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-blue-500 mr-3" />
                    <div>
                      <p className="text-2xl font-bold">47</p>
                      <p className="text-gray-600 text-sm">Responses This Month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-green-500 mr-3" />
                    <div>
                      <p className="text-2xl font-bold">+0.2</p>
                      <p className="text-gray-600 text-sm">Rating Improvement</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Patient Feedback List */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Patient Feedback</CardTitle>
                <CardDescription>Patient satisfaction and comments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patientFeedback.map((feedback) => (
                    <div key={feedback.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < feedback.rating ? "text-yellow-500 fill-current" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="font-medium">{feedback.rating}/5</span>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{feedback.staff}</p>
                          <p className="text-xs text-gray-500">{feedback.date}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{feedback.comment}</p>
                      <Badge variant="outline" className="text-xs">
                        {feedback.category}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="improvement" className="space-y-6">
            {/* Quality Improvement Plans */}
            <Card>
              <CardHeader>
                <CardTitle>Active Improvement Plans</CardTitle>
                <CardDescription>Ongoing quality improvement initiatives</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      title: "Medication Safety Protocol Enhancement",
                      description: "Implement double-check system for high-risk medications",
                      progress: 75,
                      dueDate: "2024-02-15",
                      owner: "Pharmacy Team",
                    },
                    {
                      title: "Patient Communication Training",
                      description: "Improve patient satisfaction through enhanced communication skills",
                      progress: 45,
                      dueDate: "2024-03-01",
                      owner: "Training Department",
                    },
                    {
                      title: "Fall Prevention Program",
                      description: "Reduce patient fall incidents through environmental modifications",
                      progress: 90,
                      dueDate: "2024-01-30",
                      owner: "Safety Committee",
                    },
                  ].map((plan, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="font-medium">{plan.title}</h3>
                        <Badge variant="outline">{plan.progress}% Complete</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{plan.description}</p>
                      <div className="space-y-2">
                        <Progress value={plan.progress} className="h-2" />
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Owner: {plan.owner}</span>
                          <span>Due: {plan.dueDate}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Create New Improvement Plan */}
            <Card>
              <CardHeader>
                <CardTitle>Create Improvement Plan</CardTitle>
                <CardDescription>Start a new quality improvement initiative</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="plan-title">Plan Title</Label>
                    <Input id="plan-title" placeholder="Enter improvement plan title" />
                  </div>
                  <div>
                    <Label htmlFor="plan-owner">Plan Owner</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select owner" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nursing">Nursing Department</SelectItem>
                        <SelectItem value="therapy">Therapy Department</SelectItem>
                        <SelectItem value="training">Training Department</SelectItem>
                        <SelectItem value="safety">Safety Committee</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="plan-description">Description</Label>
                  <Textarea
                    id="plan-description"
                    placeholder="Describe the improvement plan objectives and methods"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="target-date">Target Completion Date</Label>
                    <Input type="date" id="target-date" />
                  </div>
                  <div>
                    <Label htmlFor="success-metric">Success Metric</Label>
                    <Input id="success-metric" placeholder="How will success be measured?" />
                  </div>
                </div>
                <Button>Create Improvement Plan</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
