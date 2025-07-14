"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Heart,
  Bell,
  Settings,
  LogOut,
  Search,
  MapPin,
  DollarSign,
  Calendar,
  Star,
  Building2,
  Eye,
  Edit,
  Plus,
  Download,
} from "lucide-react"
import Link from "next/link"

export default function ApplicantDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [searchQuery, setSearchQuery] = useState("")

  // Mock applicant data
  const applicantInfo = {
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    phone: "(248) 555-0123",
    profession: "Registered Nurse",
    experience: "5 years",
    location: "Detroit, MI",
    profileCompletion: 85,
    memberSince: "2024-01-15",
  }

  const applicationStats = {
    totalApplications: 12,
    pendingApplications: 4,
    interviewsScheduled: 2,
    offersReceived: 1,
    profileViews: 23,
    savedJobs: 8,
  }

  const myApplications = [
    {
      id: 1,
      jobTitle: "Registered Nurse - Night Shift",
      company: "Sunrise Senior Living",
      location: "Detroit, MI",
      appliedDate: "2024-01-18",
      status: "interview_scheduled",
      salary: "$65,000 - $75,000",
      type: "Full-time",
      interviewDate: "2024-01-25",
    },
    {
      id: 2,
      jobTitle: "Home Health Nurse",
      company: "Comfort Care Services",
      location: "Ann Arbor, MI",
      appliedDate: "2024-01-16",
      status: "under_review",
      salary: "$60,000 - $70,000",
      type: "Part-time",
    },
    {
      id: 3,
      jobTitle: "ICU Nurse",
      company: "Detroit Medical Center",
      location: "Detroit, MI",
      appliedDate: "2024-01-14",
      status: "offer_received",
      salary: "$75,000 - $85,000",
      type: "Full-time",
      offerDeadline: "2024-01-28",
    },
    {
      id: 4,
      jobTitle: "Pediatric Nurse",
      company: "Children's Hospital",
      location: "Grand Rapids, MI",
      appliedDate: "2024-01-12",
      status: "rejected",
      salary: "$68,000 - $78,000",
      type: "Full-time",
    },
  ]

  const recommendedJobs = [
    {
      id: 1,
      title: "Emergency Room Nurse",
      company: "Metro Health Hospital",
      location: "Grand Rapids, MI",
      salary: "$70,000 - $80,000",
      type: "Full-time",
      posted: "2 days ago",
      match: 95,
    },
    {
      id: 2,
      title: "Cardiac Care Nurse",
      company: "Spectrum Health",
      location: "Kalamazoo, MI",
      salary: "$72,000 - $82,000",
      type: "Full-time",
      posted: "3 days ago",
      match: 92,
    },
    {
      id: 3,
      title: "Home Health RN",
      company: "Visiting Nurse Service",
      location: "Lansing, MI",
      salary: "$65,000 - $75,000",
      type: "Part-time",
      posted: "1 week ago",
      match: 88,
    },
  ]

  const recentActivity = [
    {
      id: 1,
      type: "application_submitted",
      message: "Applied for Registered Nurse position at Sunrise Senior Living",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "interview_scheduled",
      message: "Interview scheduled for ICU Nurse position",
      time: "1 day ago",
    },
    {
      id: 3,
      type: "profile_viewed",
      message: "Your profile was viewed by Detroit Medical Center",
      time: "2 days ago",
    },
    {
      id: 4,
      type: "job_saved",
      message: "Saved Emergency Room Nurse position",
      time: "3 days ago",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "interview_scheduled":
        return "bg-blue-100 text-blue-800"
      case "under_review":
        return "bg-yellow-100 text-yellow-800"
      case "offer_received":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "withdrawn":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "application_submitted":
        return <FileText className="h-4 w-4 text-blue-500" />
      case "interview_scheduled":
        return <Calendar className="h-4 w-4 text-green-500" />
      case "profile_viewed":
        return <Eye className="h-4 w-4 text-purple-500" />
      case "job_saved":
        return <Star className="h-4 w-4 text-yellow-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const getMatchColor = (match: number) => {
    if (match >= 90) return "text-green-600 bg-green-100"
    if (match >= 80) return "text-blue-600 bg-blue-100"
    if (match >= 70) return "text-yellow-600 bg-yellow-100"
    return "text-gray-600 bg-gray-100"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">IrishTriplets Job Portal</h1>
                <p className="text-sm text-gray-600">Welcome back, {applicantInfo.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="applications">My Applications</TabsTrigger>
            <TabsTrigger value="jobs">Job Search</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Profile Completion */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Profile Completion</CardTitle>
                    <CardDescription>Complete your profile to increase your chances of getting hired</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{applicantInfo.profileCompletion}%</div>
                    <div className="text-sm text-gray-600">Complete</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Progress value={applicantInfo.profileCompletion} className="mb-4" />
                <div className="flex space-x-2">
                  <Button size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Complete Profile
                  </Button>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Profile
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{applicationStats.totalApplications}</p>
                      <p className="text-sm text-gray-600">Total Applications</p>
                    </div>
                    <FileText className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-green-600">{applicationStats.interviewsScheduled}</p>
                      <p className="text-sm text-gray-600">Interviews Scheduled</p>
                    </div>
                    <Calendar className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold text-purple-600">{applicationStats.profileViews}</p>
                      <p className="text-sm text-gray-600">Profile Views</p>
                    </div>
                    <Eye className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Applications */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Recent Applications</CardTitle>
                      <CardDescription>Your latest job applications</CardDescription>
                    </div>
                    <Link href="#applications">
                      <Button variant="outline" size="sm">
                        View All
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {myApplications.slice(0, 3).map((application) => (
                      <div key={application.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h3 className="font-medium">{application.jobTitle}</h3>
                            <p className="text-sm text-gray-600">{application.company}</p>
                            <p className="text-xs text-gray-500">{application.location}</p>
                          </div>
                          <Badge className={getStatusColor(application.status)}>
                            {application.status.replace("_", " ")}
                          </Badge>
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>Applied: {application.appliedDate}</span>
                          <span>{application.salary}</span>
                        </div>
                        {application.status === "interview_scheduled" && application.interviewDate && (
                          <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-700">
                            Interview scheduled for {application.interviewDate}
                          </div>
                        )}
                        {application.status === "offer_received" && application.offerDeadline && (
                          <div className="mt-2 p-2 bg-green-50 rounded text-sm text-green-700">
                            Offer expires on {application.offerDeadline}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recommended Jobs */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Recommended Jobs</CardTitle>
                      <CardDescription>Jobs matching your profile</CardDescription>
                    </div>
                    <Link href="#jobs">
                      <Button variant="outline" size="sm">
                        View All
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recommendedJobs.map((job) => (
                      <div key={job.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-medium">{job.title}</h3>
                            <p className="text-sm text-gray-600">{job.company}</p>
                            <p className="text-xs text-gray-500">{job.location}</p>
                          </div>
                          <Badge className={`${getMatchColor(job.match)} text-xs`}>{job.match}% match</Badge>
                        </div>
                        <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
                          <span>{job.salary}</span>
                          <span>Posted {job.posted}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" className="flex-1">
                            Apply Now
                          </Button>
                          <Button size="sm" variant="outline">
                            <Star className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest job search activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0 mt-0.5">{getActivityIcon(activity.type)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Frequently used functions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                  >
                    <Search className="h-6 w-6" />
                    <span className="text-sm">Search Jobs</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                  >
                    <FileText className="h-6 w-6" />
                    <span className="text-sm">My Applications</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                  >
                    <Edit className="h-6 w-6" />
                    <span className="text-sm">Edit Profile</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                  >
                    <Star className="h-6 w-6" />
                    <span className="text-sm">Saved Jobs</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            {/* Application Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <FileText className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">{applicationStats.totalApplications}</p>
                  <p className="text-sm text-gray-600">Total Applications</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Clock className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-yellow-600">{applicationStats.pendingApplications}</p>
                  <p className="text-sm text-gray-600">Pending Review</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Calendar className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">{applicationStats.interviewsScheduled}</p>
                  <p className="text-sm text-gray-600">Interviews Scheduled</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-purple-600">{applicationStats.offersReceived}</p>
                  <p className="text-sm text-gray-600">Offers Received</p>
                </CardContent>
              </Card>
            </div>

            {/* Applications List */}
            <Card>
              <CardHeader>
                <CardTitle>All Applications</CardTitle>
                <CardDescription>Track the status of your job applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myApplications.map((application) => (
                    <div key={application.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <Building2 className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">{application.jobTitle}</h3>
                            <p className="text-sm text-gray-600">{application.company}</p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-xs text-gray-500">Applied: {application.appliedDate}</span>
                              <span className="text-xs text-gray-500">{application.location}</span>
                              <span className="text-xs text-gray-500">{application.type}</span>
                              <span className="text-xs text-gray-500">{application.salary}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge className={getStatusColor(application.status)}>
                            {application.status.replace("_", " ")}
                          </Badge>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            {application.status === "offer_received" && (
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                Respond to Offer
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                      {application.status === "interview_scheduled" && application.interviewDate && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-blue-500" />
                              <span className="text-sm text-blue-700">
                                Interview scheduled for {application.interviewDate}
                              </span>
                            </div>
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </div>
                        </div>
                      )}
                      {application.status === "offer_received" && application.offerDeadline && (
                        <div className="mt-3 p-3 bg-green-50 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-sm text-green-700">
                                Offer expires on {application.offerDeadline}
                              </span>
                            </div>
                            <div className="flex space-x-2">
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                Accept
                              </Button>
                              <Button size="sm" variant="outline">
                                Decline
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-6">
            {/* Job Search */}
            <Card>
              <CardHeader>
                <CardTitle>Job Search</CardTitle>
                <CardDescription>Find your next healthcare opportunity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4 mb-6">
                  <div className="flex-1">
                    <Input
                      placeholder="Search jobs by title, company, or keywords..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>

                <div className="text-center py-8">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Search for Jobs</h3>
                  <p className="text-gray-600 mb-4">
                    Use the search bar above to find healthcare jobs that match your skills and preferences.
                  </p>
                  <Link href="/jobs">
                    <Button>Browse All Jobs</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Recommended Jobs */}
            <Card>
              <CardHeader>
                <CardTitle>Recommended for You</CardTitle>
                <CardDescription>Jobs that match your profile and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recommendedJobs.map((job) => (
                    <div key={job.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-medium">{job.title}</h3>
                          <p className="text-sm text-gray-600">{job.company}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{job.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <DollarSign className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{job.salary}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{job.type}</span>
                            </div>
                          </div>
                        </div>
                        <Badge className={`${getMatchColor(job.match)} text-xs`}>{job.match}% match</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-500">Posted {job.posted}</span>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Star className="h-3 w-3 mr-1" />
                            Save
                          </Button>
                          <Button size="sm">Apply Now</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            {/* Profile Management */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Keep your profile up to date to attract employers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" value={applicantInfo.name} />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" value={applicantInfo.email} />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" type="tel" value={applicantInfo.phone} />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" value={applicantInfo.location} />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="profession">Profession</Label>
                      <Input id="profession" value={applicantInfo.profession} />
                    </div>
                    <div>
                      <Label htmlFor="experience">Experience</Label>
                      <Input id="experience" value={applicantInfo.experience} />
                    </div>
                    <div>
                      <Label htmlFor="memberSince">Member Since</Label>
                      <Input id="memberSince" value={applicantInfo.memberSince} disabled />
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex space-x-4">
                  <Button>Save Changes</Button>
                  <Button variant="outline">Cancel</Button>
                </div>
              </CardContent>
            </Card>

            {/* Profile Completion */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Completion</CardTitle>
                <CardDescription>Complete these sections to improve your profile visibility</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Basic Information</span>
                    </div>
                    <Badge variant="secondary">Complete</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span>Professional Experience</span>
                    </div>
                    <Badge variant="secondary">Complete</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      <span>Certifications & Licenses</span>
                    </div>
                    <Button size="sm" variant="outline">
                      Add Details
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      <span>Resume Upload</span>
                    </div>
                    <Button size="sm" variant="outline">
                      Upload Resume
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            {/* Document Management */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>My Documents</CardTitle>
                    <CardDescription>Manage your professional documents and certifications</CardDescription>
                  </div>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Resume.pdf", type: "Resume", uploaded: "2024-01-15", status: "verified" },
                    { name: "RN_License.pdf", type: "License", uploaded: "2024-01-15", status: "verified" },
                    { name: "CPR_Certificate.pdf", type: "Certification", uploaded: "2024-01-10", status: "pending" },
                    {
                      name: "Background_Check.pdf",
                      type: "Background Check",
                      uploaded: "2024-01-08",
                      status: "verified",
                    },
                  ].map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-8 w-8 text-blue-500" />
                        <div>
                          <h3 className="font-medium">{doc.name}</h3>
                          <p className="text-sm text-gray-600">{doc.type}</p>
                          <p className="text-xs text-gray-500">Uploaded: {doc.uploaded}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge
                          className={
                            doc.status === "verified" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                          }
                        >
                          {doc.status}
                        </Badge>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Document Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Required Documents</CardTitle>
                <CardDescription>Documents needed to complete your profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Professional Resume", required: true, uploaded: true },
                    { name: "Professional License", required: true, uploaded: true },
                    { name: "CPR Certification", required: true, uploaded: false },
                    { name: "Background Check", required: true, uploaded: true },
                    { name: "References", required: false, uploaded: false },
                  ].map((req, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        {req.uploaded ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-yellow-500" />
                        )}
                        <span className={req.required ? "font-medium" : ""}>{req.name}</span>
                        {req.required && (
                          <Badge variant="secondary" className="text-xs">
                            Required
                          </Badge>
                        )}
                      </div>
                      {!req.uploaded && (
                        <Button size="sm" variant="outline">
                          Upload
                        </Button>
                      )}
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
