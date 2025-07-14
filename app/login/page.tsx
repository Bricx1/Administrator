"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  Users,
  Building2,
  UserCheck,
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
  Heart,
  ArrowRight,
} from "lucide-react"
import Link from "next/link"

export default function StaffLogin() {
  const [activeTab, setActiveTab] = useState("staff")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Demo login - redirect based on role
      const redirectMap = {
        staff: "/staff-dashboard",
        employer: "/employer-dashboard",
        applicant: "/applicant-dashboard",
      }

      window.location.href = redirectMap[activeTab as keyof typeof redirectMap] || "/"
    } catch (error) {
      setErrors({ general: "Login failed. Please check your credentials and try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const getDemoCredentials = (role: string) => {
    const credentials = {
      staff: { email: "staff@irishtripletshealth.com", password: "staff123" },
      employer: { email: "employer@hospital.com", password: "employer123" },
      applicant: { email: "applicant@email.com", password: "applicant123" },
    }
    return credentials[role as keyof typeof credentials]
  }

  const fillDemoCredentials = (role: string) => {
    const creds = getDemoCredentials(role)
    if (creds) {
      setFormData(creds)
      setErrors({})
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-indigo-200 rounded-full opacity-30 animate-bounce"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-200 rounded-full opacity-25"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <Users className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Staff & Provider Login</CardTitle>
            <CardDescription className="text-gray-600">Access your healthcare staffing dashboard</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Role Selection Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                <TabsTrigger value="staff" className="text-sm">
                  <Users className="h-4 w-4 mr-2" />
                  Staff
                </TabsTrigger>
                <TabsTrigger value="employer" className="text-sm">
                  <Building2 className="h-4 w-4 mr-2" />
                  Employer
                </TabsTrigger>
                <TabsTrigger value="applicant" className="text-sm">
                  <UserCheck className="h-4 w-4 mr-2" />
                  Applicant
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className={`h-12 pl-10 ${errors.email ? "border-red-300 focus:border-red-500" : "border-gray-300"}`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className={`h-12 pl-10 pr-10 ${errors.password ? "border-red-300 focus:border-red-500" : "border-gray-300"}`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                    {errors.password && (
                      <p className="text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.password}
                      </p>
                    )}
                  </div>

                  {/* General Error */}
                  {errors.general && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">{errors.general}</AlertDescription>
                    </Alert>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-medium shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Signing In...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Sign In as {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                      </div>
                    )}
                  </Button>
                </form>

                {/* Demo Credentials */}
                <div className="mt-4">
                  <Alert className="border-blue-200 bg-blue-50">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800 text-sm">
                      <div className="space-y-2">
                        <p>
                          <strong>
                            Demo Credentials for {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}:
                          </strong>
                        </p>
                        <p>Email: {getDemoCredentials(activeTab)?.email}</p>
                        <p>Password: {getDemoCredentials(activeTab)?.password}</p>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-blue-600 hover:text-blue-700 p-0 h-auto"
                          onClick={() => fillDemoCredentials(activeTab)}
                        >
                          Click to fill credentials
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </Tabs>

            <Separator />

            {/* Patient Portal Link */}
            <div className="text-center space-y-3">
              <p className="text-sm text-gray-600">Are you a patient looking for your health portal?</p>
              <Link href="/auth/patient-login">
                <Button className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white">
                  <Heart className="h-4 w-4 mr-2" />
                  Access Patient Portal
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Help Links */}
            <div className="space-y-2">
              <Link href="/forgot-password">
                <Button variant="ghost" className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                  <Lock className="h-4 w-4 mr-2" />
                  Forgot Password?
                </Button>
              </Link>

              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Need help with your account?</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent"
                >
                  Contact IT Support: (555) 123-4567
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>© 2024 IrishTriplets Healthcare Staffing. All rights reserved.</p>
          <p className="mt-1">
            <Link href="/privacy" className="text-blue-600 hover:text-blue-700">
              Privacy Policy
            </Link>
            {" • "}
            <Link href="/terms" className="text-blue-600 hover:text-blue-700">
              Terms of Service
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
