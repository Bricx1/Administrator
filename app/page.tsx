"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Calendar,
  FileText,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Stethoscope,
  Brain,
  Shield,
  Zap,
  BarChart3,
  Settings,
  Bell,
  Search,
  ArrowRight,
  Heart,
  UserCheck,
  ClipboardList,
  LigatureIcon as Bandage,
  Building,
  Phone,
  MessageSquare,
  MapPin,
  Navigation,
} from "lucide-react"
import Link from "next/link"

export default function MASEDashboard() {
  const [notifications] = useState([
    { id: 1, type: "urgent", message: "3 SOC assessments overdue", time: "5 min ago" },
    { id: 2, type: "info", message: "New patient referral from General Hospital", time: "15 min ago" },
    { id: 3, type: "warning", message: "Wound care supplies running low", time: "1 hour ago" },
  ])

  const quickStats = {
    totalPatients: 156,
    activePatients: 89,
    overdueSOC: 3,
    woundCarePatients: 24,
    staffOnDuty: 12,
    todayAppointments: 18,
    pendingReferrals: 7,
    complianceRate: 94,
  }

  const recentActivity = [
    { id: 1, action: "SOC completed", patient: "Margaret Anderson", staff: "Sarah Johnson, RN", time: "2 hours ago" },
    { id: 2, action: "Wound assessment", patient: "Robert Thompson", staff: "Michael Chen, PT", time: "3 hours ago" },
    { id: 3, action: "New referral", patient: "Dorothy Williams", staff: "Emily Davis, OT", time: "4 hours ago" },
    { id: 4, action: "Discharge planning", patient: "James Wilson", staff: "Lisa Garcia, RN", time: "5 hours ago" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Homecare Automation Dashboard
                  </h1>
                  <p className="text-gray-600">Medical Automation & Smart Efficiency Platform</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button variant="outline" size="sm" className="relative bg-transparent">
                <Bell className="h-4 w-4" />
                {notifications.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-red-500">
                    {notifications.length}
                  </Badge>
                )}
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">Welcome to M.A.S.E AI</h2>
                <p className="text-blue-100 mb-4">
                  Your intelligent healthcare automation platform is ready to streamline patient care and optimize
                  workflows.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Zap className="h-5 w-5 mr-2" />
                    <span>AI-Powered</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 mr-2" />
                    <span>HIPAA Compliant</span>
                  </div>
                  <div className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    <span>Real-time Monitoring</span>
                  </div>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm">
                  <Heart className="h-16 w-16 text-white/80" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Patients</p>
                  <p className="text-2xl font-bold text-blue-600">{quickStats.totalPatients}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Patients</p>
                  <p className="text-2xl font-bold text-green-600">{quickStats.activePatients}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-lg">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Overdue SOC</p>
                  <p className="text-2xl font-bold text-red-600">{quickStats.overdueSOC}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Bandage className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Wound Care</p>
                  <p className="text-2xl font-bold text-purple-600">{quickStats.woundCarePatients}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Features */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Access frequently used features and tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link href="/patient-tracking">
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center hover:bg-blue-50 bg-transparent"
                    >
                      <Users className="h-6 w-6 mb-2 text-blue-600" />
                      <span className="text-sm">Patient Tracking</span>
                    </Button>
                  </Link>
                  <Link href="/oasis-upload">
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center hover:bg-green-50 bg-transparent"
                    >
                      <FileText className="h-6 w-6 mb-2 text-green-600" />
                      <span className="text-sm">OASIS Upload</span>
                    </Button>
                  </Link>
                  <Link href="/wound-care-supplies">
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center hover:bg-purple-50 bg-transparent"
                    >
                      <Bandage className="h-6 w-6 mb-2 text-purple-600" />
                      <span className="text-sm">Wound Care</span>
                    </Button>
                  </Link>
                  <Link href="/nurse-scanner">
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center hover:bg-orange-50 bg-transparent"
                    >
                      <Stethoscope className="h-6 w-6 mb-2 text-orange-600" />
                      <span className="text-sm">Nurse Scanner</span>
                    </Button>
                  </Link>
                  <Link href="/fleet-management">
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center hover:bg-indigo-50 bg-transparent"
                    >
                      <MapPin className="h-6 w-6 mb-2 text-indigo-600" />
                      <span className="text-sm">Fleet Tracking</span>
                    </Button>
                  </Link>
                  <Link href="/route-optimization">
                    <Button
                      variant="outline"
                      className="h-20 flex flex-col items-center justify-center hover:bg-teal-50 bg-transparent"
                    >
                      <Navigation className="h-6 w-6 mb-2 text-teal-600" />
                      <span className="text-sm">Route Optimizer</span>
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* AI-Powered Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  AI-Powered Features
                </CardTitle>
                <CardDescription>Intelligent automation and predictive analytics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Link href="/predictive-analytics">
                    <div className="p-4 border rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all cursor-pointer">
                      <div className="flex items-center mb-2">
                        <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
                        <h3 className="font-medium">Predictive Analytics</h3>
                      </div>
                      <p className="text-sm text-gray-600">AI-driven patient outcome predictions and risk assessment</p>
                    </div>
                  </Link>
                  <Link href="/oasis-qa/enhanced">
                    <div className="p-4 border rounded-lg hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 transition-all cursor-pointer">
                      <div className="flex items-center mb-2">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        <h3 className="font-medium">AI Quality Assurance</h3>
                      </div>
                      <p className="text-sm text-gray-600">Automated OASIS review and compliance checking</p>
                    </div>
                  </Link>
                  <Link href="/analytics">
                    <div className="p-4 border rounded-lg hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all cursor-pointer">
                      <div className="flex items-center mb-2">
                        <BarChart3 className="h-5 w-5 text-purple-600 mr-2" />
                        <h3 className="font-medium">Advanced Analytics</h3>
                      </div>
                      <p className="text-sm text-gray-600">Comprehensive reporting and business intelligence</p>
                    </div>
                  </Link>
                  <div className="p-4 border rounded-lg hover:bg-gradient-to-r hover:from-orange-50 hover:to-red-50 transition-all cursor-pointer">
                    <div className="flex items-center mb-2">
                      <MessageSquare className="h-5 w-5 text-orange-600 mr-2" />
                      <h3 className="font-medium">AI Voice Assistant</h3>
                    </div>
                    <p className="text-sm text-gray-600">Voice-activated commands and documentation</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Recent Activity
                </CardTitle>
                <CardDescription>Latest updates and actions across the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-full mr-3">
                          <Activity className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{activity.action}</p>
                          <p className="text-xs text-gray-600">
                            {activity.patient} • {activity.staff}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-3 rounded-lg border-l-4 ${
                        notification.type === "urgent"
                          ? "bg-red-50 border-red-500"
                          : notification.type === "warning"
                            ? "bg-yellow-50 border-yellow-500"
                            : "bg-blue-50 border-blue-500"
                      }`}
                    >
                      <p className="text-sm font-medium">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">SOC Compliance</span>
                    <span className="text-sm font-bold text-green-600">{quickStats.complianceRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${quickStats.complianceRate}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Staff Utilization</span>
                    <span className="text-sm font-bold text-blue-600">87%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: "87%" }}></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Patient Satisfaction</span>
                    <span className="text-sm font-bold text-purple-600">92%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: "92%" }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Today's Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="text-sm">Appointments</span>
                    </div>
                    <span className="font-bold">{quickStats.todayAppointments}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <UserCheck className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm">Staff on Duty</span>
                    </div>
                    <span className="font-bold">{quickStats.staffOnDuty}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ClipboardList className="h-4 w-4 text-orange-600 mr-2" />
                      <span className="text-sm">Pending Referrals</span>
                    </div>
                    <span className="font-bold">{quickStats.pendingReferrals}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ArrowRight className="h-5 w-5 mr-2" />
                  Quick Links
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link href="/admin/users">
                    <Button variant="ghost" className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      User Management
                    </Button>
                  </Link>
                  <Link href="/survey-ready">
                    <Button variant="ghost" className="w-full justify-start">
                      <Shield className="h-4 w-4 mr-2" />
                      Survey Readiness
                    </Button>
                  </Link>
                  <Link href="/integrations">
                    <Button variant="ghost" className="w-full justify-start">
                      <Building className="h-4 w-4 mr-2" />
                      Integrations
                    </Button>
                  </Link>
                  <Link href="/communications">
                    <Button variant="ghost" className="w-full justify-start">
                      <Phone className="h-4 w-4 mr-2" />
                      Communications
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
