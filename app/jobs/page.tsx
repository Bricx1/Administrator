"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Clock, DollarSign, Users, Star, Heart, Briefcase, Building2, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")

  const featuredJobs = [
    {
      id: "JOB-001",
      title: "Registered Nurse - ICU",
      company: "Sunrise Senior Living",
      location: "Miami, FL",
      type: "Full-time",
      department: "Intensive Care",
      salary: "$65,000 - $75,000",
      description:
        "Join our dedicated ICU team providing critical care to our residents. We offer competitive compensation and excellent benefits.",
      requirements: ["RN License", "BLS Certification", "2+ years ICU experience"],
      benefits: ["Health Insurance", "401k Match", "Paid Time Off", "Continuing Education"],
      posted: "2024-07-01",
      applications: 12,
      featured: true,
      urgent: false,
      companyRating: 4.7,
      companyLogo: "/placeholder.svg?height=60&width=60&text=SSL",
    },
    {
      id: "JOB-002",
      title: "Physical Therapist",
      company: "Memorial Hospital",
      location: "Orlando, FL",
      type: "Part-time",
      department: "Rehabilitation",
      salary: "$35 - $45/hour",
      description:
        "Seeking a compassionate Physical Therapist to join our rehabilitation team. Flexible scheduling available.",
      requirements: ["PT License", "BLS Certification", "1+ years experience"],
      benefits: ["Flexible Schedule", "Professional Development", "Health Benefits"],
      posted: "2024-06-30",
      applications: 8,
      featured: true,
      urgent: true,
      companyRating: 4.5,
      companyLogo: "/placeholder.svg?height=60&width=60&text=MH",
    },
  ]

  const allJobs = [
    ...featuredJobs,
    {
      id: "JOB-003",
      title: "Certified Nursing Assistant",
      company: "City Medical Center",
      location: "Tampa, FL",
      type: "Full-time",
      department: "General Care",
      salary: "$28,000 - $35,000",
      description: "Looking for dedicated CNAs to provide quality patient care in our medical center.",
      requirements: ["CNA Certification", "BLS Certification", "High School Diploma"],
      benefits: ["Health Insurance", "Paid Training", "Career Advancement"],
      posted: "2024-06-28",
      applications: 15,
      featured: false,
      urgent: false,
      companyRating: 4.3,
      companyLogo: "/placeholder.svg?height=60&width=60&text=CMC",
    },
    {
      id: "JOB-004",
      title: "Licensed Practical Nurse",
      company: "Golden Years Care",
      location: "Jacksonville, FL",
      type: "Full-time",
      department: "Long-term Care",
      salary: "$45,000 - $52,000",
      description: "Join our caring team providing long-term care services to elderly residents.",
      requirements: ["LPN License", "BLS Certification", "Experience preferred"],
      benefits: ["Competitive Pay", "Health Benefits", "Retirement Plan"],
      posted: "2024-06-25",
      applications: 9,
      featured: false,
      urgent: true,
      companyRating: 4.6,
      companyLogo: "/placeholder.svg?height=60&width=60&text=GYC",
    },
    {
      id: "JOB-005",
      title: "Occupational Therapist",
      company: "Rehabilitation Plus",
      location: "Fort Lauderdale, FL",
      type: "Contract",
      department: "Rehabilitation",
      salary: "$40 - $50/hour",
      description: "Contract position for experienced OT to work with diverse patient population.",
      requirements: ["OT License", "2+ years experience", "Reliable transportation"],
      benefits: ["High Hourly Rate", "Flexible Schedule", "Professional Growth"],
      posted: "2024-06-22",
      applications: 6,
      featured: false,
      urgent: false,
      companyRating: 4.4,
      companyLogo: "/placeholder.svg?height=60&width=60&text=RP",
    },
    {
      id: "JOB-006",
      title: "Medical Assistant",
      company: "Family Health Clinic",
      location: "Gainesville, FL",
      type: "Part-time",
      department: "Primary Care",
      salary: "$15 - $18/hour",
      description: "Part-time Medical Assistant position in busy family practice clinic.",
      requirements: ["Medical Assistant Certification", "Computer Skills", "Customer Service"],
      benefits: ["Flexible Hours", "Training Provided", "Growth Opportunities"],
      posted: "2024-06-20",
      applications: 11,
      featured: false,
      urgent: false,
      companyRating: 4.2,
      companyLogo: "/placeholder.svg?height=60&width=60&text=FHC",
    },
  ]

  const filteredJobs = allJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.department.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLocation = locationFilter === "all" || job.location.includes(locationFilter)
    const matchesType = typeFilter === "all" || job.type === typeFilter
    const matchesDepartment = departmentFilter === "all" || job.department === departmentFilter

    return matchesSearch && matchesLocation && matchesType && matchesDepartment
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                  <Heart className="h-4 w-4 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">IrishTriplets</h1>
              </Link>
              <div className="hidden md:block">
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  Job Board
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/register">
                <Button variant="outline">Create Account</Button>
              </Link>
              <Link href="/login">
                <Button>Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Next Healthcare Career</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover opportunities with top healthcare facilities across Florida. Join our network of dedicated
            professionals making a difference in patient care.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{allJobs.length}+</div>
              <div className="text-gray-600">Active Jobs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">50+</div>
              <div className="text-gray-600">Healthcare Facilities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">98%</div>
              <div className="text-gray-600">Placement Success</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search jobs, companies, or keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="Miami">Miami, FL</SelectItem>
                  <SelectItem value="Orlando">Orlando, FL</SelectItem>
                  <SelectItem value="Tampa">Tampa, FL</SelectItem>
                  <SelectItem value="Jacksonville">Jacksonville, FL</SelectItem>
                  <SelectItem value="Fort Lauderdale">Fort Lauderdale, FL</SelectItem>
                  <SelectItem value="Gainesville">Gainesville, FL</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Per Diem">Per Diem</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-between items-center mt-4">
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="Intensive Care">Intensive Care</SelectItem>
                  <SelectItem value="Rehabilitation">Rehabilitation</SelectItem>
                  <SelectItem value="General Care">General Care</SelectItem>
                  <SelectItem value="Long-term Care">Long-term Care</SelectItem>
                  <SelectItem value="Primary Care">Primary Care</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-sm text-gray-600">{filteredJobs.length} jobs found</div>
            </div>
          </CardContent>
        </Card>

        {/* Featured Jobs */}
        {featuredJobs.some((job) => filteredJobs.includes(job)) && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Star className="h-6 w-6 text-yellow-500 mr-2" />
              Featured Opportunities
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredJobs
                .filter((job) => filteredJobs.includes(job))
                .map((job) => (
                  <Card
                    key={job.id}
                    className="border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50"
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                            <Building2 className="h-6 w-6 text-gray-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{job.title}</CardTitle>
                            <CardDescription className="flex items-center space-x-2">
                              <span>{job.company}</span>
                              <div className="flex items-center">
                                <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                                <span className="text-xs">{job.companyRating}</span>
                              </div>
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>
                          {job.urgent && <Badge variant="destructive">Urgent</Badge>}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-gray-700">{job.description}</p>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center text-gray-600">
                            <MapPin className="h-4 w-4 mr-2" />
                            {job.location}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Clock className="h-4 w-4 mr-2" />
                            {job.type}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <DollarSign className="h-4 w-4 mr-2" />
                            {job.salary}
                          </div>
                          <div className="flex items-center text-gray-600">
                            <Users className="h-4 w-4 mr-2" />
                            {job.applications} applicants
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <h4 className="font-medium text-sm mb-1">Requirements:</h4>
                            <div className="flex flex-wrap gap-1">
                              {job.requirements.slice(0, 3).map((req) => (
                                <Badge key={req} variant="secondary" className="text-xs">
                                  {req}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium text-sm mb-1">Benefits:</h4>
                            <div className="flex flex-wrap gap-1">
                              {job.benefits.slice(0, 3).map((benefit) => (
                                <Badge key={benefit} variant="outline" className="text-xs">
                                  {benefit}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t">
                          <span className="text-sm text-gray-600">Posted {job.posted}</span>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              Learn More
                            </Button>
                            <Link href="/register">
                              <Button size="sm">
                                Apply Now
                                <ArrowRight className="h-4 w-4 ml-1" />
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}

        {/* All Jobs */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Opportunities</h2>
          <div className="space-y-4">
            {filteredJobs
              .filter((job) => !job.featured)
              .map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                            {job.urgent && (
                              <Badge variant="destructive" className="text-xs">
                                Urgent
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-gray-600">{job.company}</span>
                            <div className="flex items-center">
                              <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                              <span className="text-sm text-gray-600">{job.companyRating}</span>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-3">{job.description}</p>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {job.location}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {job.type}
                            </div>
                            <div className="flex items-center">
                              <DollarSign className="h-4 w-4 mr-1" />
                              {job.salary}
                            </div>
                            <div className="flex items-center">
                              <Briefcase className="h-4 w-4 mr-1" />
                              {job.department}
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-1 mb-3">
                            {job.requirements.slice(0, 4).map((req) => (
                              <Badge key={req} variant="secondary" className="text-xs">
                                {req}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end space-y-2">
                        <div className="text-right">
                          <div className="text-sm text-gray-600">{job.applications} applicants</div>
                          <div className="text-sm text-gray-600">Posted {job.posted}</div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Details
                          </Button>
                          <Link href="/register">
                            <Button size="sm">
                              Apply
                              <ArrowRight className="h-4 w-4 ml-1" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        {/* Call to Action */}
        <Card className="mt-12 bg-gradient-to-r from-blue-500 to-green-500 text-white">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Start Your Healthcare Career?</h2>
            <p className="text-lg mb-6 opacity-90">
              Join thousands of healthcare professionals who have found their perfect job through IrishTriplets.
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/register">
                <Button size="lg" variant="secondary">
                  Create Your Profile
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
