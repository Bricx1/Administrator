"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Star,
  TrendingUp,
  TrendingDown,
  HeartPulse,
  Smile,
  FileCheck2,
  Lightbulb,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  Minus,
} from "lucide-react"
import Link from "next/link"

interface Metric {
  name: string
  value: number
  goal: number
  trend: "up" | "down" | "stable"
}

interface StarRatingData {
  overallRating: {
    current: number
    previous: number
    nationalAverage: number
    goal: number
  }
  qualityOfPatientCare: {
    current: number
    previous: number
    nationalAverage: number
    metrics: Metric[]
  }
  patientSatisfaction: {
    current: number
    previous: number
    nationalAverage: number
    metrics: Metric[]
  }
  actionableInsights: {
    id: string
    type: string
    description: string
    priority: "High" | "Medium" | "Low"
    link: string
  }[]
  oasisAccuracy: {
    averageScore: number
    submissionsPendingReview: number
    rejectionRate: number
  }
}

const TrendIcon = ({ trend }: { trend: "up" | "down" | "stable" }) => {
  if (trend === "up") return <TrendingUp className="h-4 w-4 text-green-500" />
  if (trend === "down") return <TrendingDown className="h-4 w-4 text-red-500" />
  return <Minus className="h-4 w-4 text-gray-500" />
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-5 w-5 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
      />
    ))}
    <span className="ml-2 text-lg font-bold">{rating.toFixed(1)}</span>
  </div>
)

export default function EmployerDashboard() {
  const [data, setData] = useState<StarRatingData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await fetch("/api/analytics/star-ratings")
        if (response.ok) {
          const result = await response.json()
          setData(result)
        }
      } catch (error) {
        console.error("Failed to fetch star rating data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-lg font-semibold">Loading Star Rating Dashboard...</p>
          <p className="text-sm text-gray-500">Aggregating data from Axxess...</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 mx-auto mb-4 text-red-500" />
          <p className="text-lg font-semibold">Could not load dashboard data.</p>
          <p className="text-sm text-gray-500">Please try again later or check your Axxess integration.</p>
          <Link href="/integrations/axxess-setup">
            <Button variant="outline" className="mt-4 bg-transparent">
              Check Integration
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Medicare Star Rating Dashboard</h1>
            <p className="text-gray-600">Your agency's performance at a glance, powered by Axxess data.</p>
          </div>
          <Link href="/integrations/axxess-setup">
            <Button variant="outline">Axxess Integration Settings</Button>
          </Link>
        </div>

        {/* Main Rating Card */}
        <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Overall Star Rating</CardTitle>
            <CardDescription className="text-blue-200">Projected based on current performance</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Star className="h-16 w-16 text-yellow-300 fill-yellow-300" />
              <div>
                <div className="text-6xl font-bold">{data.overallRating.current.toFixed(1)}</div>
                <div className="text-lg text-blue-200">out of 5 stars</div>
              </div>
            </div>
            <div className="text-center sm:text-right">
              <div className="flex items-center justify-center sm:justify-end gap-2">
                <TrendIcon trend={data.overallRating.current > data.overallRating.previous ? "up" : "down"} />
                <span className="font-semibold">
                  {Math.abs(data.overallRating.current - data.overallRating.previous).toFixed(1)} from last period
                </span>
              </div>
              <p className="text-sm text-blue-200 mt-1">
                National Average: {data.overallRating.nationalAverage.toFixed(1)} stars
              </p>
              <div className="mt-2">
                <Progress value={(data.overallRating.current / 5) * 100} className="bg-blue-500 [&>*]:bg-white" />
                <p className="text-xs text-blue-200 mt-1">
                  {(5 - data.overallRating.current).toFixed(1)} stars to goal
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actionable Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="text-yellow-500" />
              Actionable Insights
            </CardTitle>
            <CardDescription>AI-powered recommendations to improve your star ratings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.actionableInsights.map((insight) => (
              <Alert
                key={insight.id}
                variant={insight.priority === "High" ? "destructive" : "default"}
                className={insight.priority === "Medium" ? "bg-yellow-50 border-yellow-200" : ""}
              >
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle className="flex justify-between items-center">
                  <span>
                    {insight.priority} Priority: {insight.type}
                  </span>
                  <Link href={insight.link}>
                    <Button variant="secondary" size="sm">
                      View <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </AlertTitle>
                <AlertDescription>{insight.description}</AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quality of Patient Care */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HeartPulse className="text-red-500" />
                Quality of Patient Care
              </CardTitle>
              <div className="flex items-center gap-4">
                <StarRating rating={data.qualityOfPatientCare.current} />
                <Badge variant="outline">Nat'l Avg: {data.qualityOfPatientCare.nationalAverage.toFixed(1)}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.qualityOfPatientCare.metrics.map((metric) => (
                <div key={metric.name}>
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span className="font-medium">{metric.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{metric.value}%</span>
                      <TrendIcon trend={metric.trend} />
                    </div>
                  </div>
                  <Progress value={(metric.value / metric.goal) * 100} />
                  <p className="text-xs text-gray-500 text-right mt-1">Goal: {metric.goal}%</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Patient Satisfaction (HHCAHPS) */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smile className="text-green-500" />
                Patient Satisfaction (HHCAHPS)
              </CardTitle>
              <div className="flex items-center gap-4">
                <StarRating rating={data.patientSatisfaction.current} />
                <Badge variant="outline">Nat'l Avg: {data.patientSatisfaction.nationalAverage.toFixed(1)}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.patientSatisfaction.metrics.map((metric) => (
                <div key={metric.name}>
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span className="font-medium">{metric.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{metric.value}%</span>
                      <TrendIcon trend={metric.trend} />
                    </div>
                  </div>
                  <Progress value={(metric.value / metric.goal) * 100} />
                  <p className="text-xs text-gray-500 text-right mt-1">Goal: {metric.goal}%</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* OASIS Accuracy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck2 className="text-blue-500" />
              OASIS Accuracy & Processing
            </CardTitle>
            <CardDescription>Ensure accurate data submission for optimal outcomes and reimbursement.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-gray-100 rounded-lg">
              <p className="text-sm font-medium text-gray-600">Avg. Quality Score</p>
              <p className="text-3xl font-bold text-blue-600">{data.oasisAccuracy.averageScore}%</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg">
              <p className="text-sm font-medium text-gray-600">Pending QA Review</p>
              <p className="text-3xl font-bold text-yellow-600">{data.oasisAccuracy.submissionsPendingReview}</p>
            </div>
            <div className="p-4 bg-gray-100 rounded-lg">
              <p className="text-sm font-medium text-gray-600">Rejection Rate</p>
              <p className="text-3xl font-bold text-red-600">{data.oasisAccuracy.rejectionRate}%</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
