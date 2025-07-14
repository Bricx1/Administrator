"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  Shield,
  Lock,
  Eye,
  Building2,
  FileCheck,
  Clock,
  AlertTriangle,
  CheckCircle,
  Users,
  BarChart3,
} from "lucide-react"

export default function SurveyLogin() {
  const [credentials, setCredentials] = useState({
    surveyorId: "",
    accessCode: "",
    organization: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Simulate authentication
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In real implementation, validate credentials against survey user database
      if (credentials.surveyorId && credentials.accessCode) {
        // Redirect directly to survey dashboard
        router.push("/survey-ready")
      } else {
        setError("Invalid surveyor credentials. Please check your ID and access code.")
      }
    } catch (err) {
      setError("Authentication failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const surveyStats = [
    {
      title: "Survey Sections",
      value: "15",
      description: "Complete sections ready for review",
      icon: FileCheck,
      color: "text-green-600",
    },
    {
      title: "Last Updated",
      value: "Today",
      description: "All documentation current",
      icon: Clock,
      color: "text-blue-600",
    },
    {
      title: "Compliance Rate",
      value: "94.2%",
      description: "Overall compliance score",
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: "Active Staff",
      value: "156",
      description: "Total active employees",
      icon: Users,
      color: "text-purple-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Panel - Survey Information */}
        <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto lg:mx-0">
            <div className="flex items-center mb-8">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <Shield className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">Survey Access Portal</h1>
                <p className="text-gray-600">Secure State Surveyor Dashboard</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="p-6 bg-white rounded-lg border border-gray-200 shadow-sm">
                <div className="flex items-center mb-4">
                  <Building2 className="h-5 w-5 text-indigo-600 mr-2" />
                  <h3 className="font-semibold text-gray-900">Irish Triplets Health Services</h3>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• Homecare Agency License: #HC-2024-001</p>
                  <p>• Medicare Provider: 12-3456</p>
                  <p>• Accreditation: Joint Commission</p>
                  <p>• Survey Type: Routine Compliance Review</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {surveyStats.map((stat, index) => (
                  <div key={index} className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="flex items-center mb-2">
                      <stat.icon className={`h-4 w-4 ${stat.color} mr-2`} />
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{stat.title}</span>
                    </div>
                    <div className="text-lg font-bold text-gray-900">{stat.value}</div>
                    <div className="text-xs text-gray-600">{stat.description}</div>
                  </div>
                ))}
              </div>

              <Alert>
                <Lock className="h-4 w-4" />
                <AlertDescription>
                  This portal provides secure, read-only access to survey documentation. All access is logged and
                  monitored for compliance purposes.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>

        {/* Right Panel - Login Form */}
        <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center bg-white lg:bg-gray-50">
          <div className="max-w-md mx-auto w-full">
            <Card className="border-0 shadow-xl lg:border lg:shadow-lg">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <Eye className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle className="text-2xl font-bold">Surveyor Access</CardTitle>
                <CardDescription>Enter your credentials to access the survey dashboard</CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="surveyorId" className="text-sm font-medium">
                        Surveyor ID
                      </Label>
                      <Input
                        id="surveyorId"
                        type="text"
                        placeholder="Enter your surveyor ID"
                        value={credentials.surveyorId}
                        onChange={(e) => setCredentials({ ...credentials, surveyorId: e.target.value })}
                        className="mt-1"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="accessCode" className="text-sm font-medium">
                        Access Code
                      </Label>
                      <Input
                        id="accessCode"
                        type="password"
                        placeholder="Enter your access code"
                        value={credentials.accessCode}
                        onChange={(e) => setCredentials({ ...credentials, accessCode: e.target.value })}
                        className="mt-1"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="organization" className="text-sm font-medium">
                        Organization
                      </Label>
                      <Input
                        id="organization"
                        type="text"
                        placeholder="State Health Department"
                        value={credentials.organization}
                        onChange={(e) => setCredentials({ ...credentials, organization: e.target.value })}
                        className="mt-1"
                        required
                      />
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Authenticating...
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4 mr-2" />
                        Access Survey Dashboard
                      </>
                    )}
                  </Button>

                  <Separator />

                  <div className="text-center space-y-2">
                    <p className="text-xs text-gray-500">
                      Need access? Contact the facility administrator or your survey coordinator.
                    </p>
                    <div className="flex justify-center space-x-4 text-xs text-gray-400">
                      <span>• Secure Access</span>
                      <span>• Audit Logged</span>
                      <span>• Read-Only</span>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Quick Access Preview */}
            <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <BarChart3 className="h-4 w-4 mr-2 text-indigo-600" />
                Available Survey Sections
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  "Census Reports",
                  "HR Files",
                  "Training Records",
                  "Policy Manual",
                  "Patient Packet",
                  "QAPI Reports",
                  "Incident Log",
                  "Emergency Plans",
                ].map((section, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span className="text-gray-700">{section}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
