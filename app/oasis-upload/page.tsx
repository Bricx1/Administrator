"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Upload,
  FileText,
  ImageIcon,
  AlertTriangle,
  Clock,
  Brain,
  Stethoscope,
  FileCheck,
  X,
  Plus,
  Eye,
} from "lucide-react"

interface UploadedFile {
  id: string
  file: File
  type: string
  priority: string
  patientId?: string
  notes?: string
  status: "uploading" | "processing" | "completed" | "error"
  progress: number
  aiResults?: {
    extractedText?: string
    qualityScore?: number
    suggestedCodes?: string[]
    riskFactors?: string[]
    financialImpact?: number
  }
}

export default function OasisUpload() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploadType, setUploadType] = useState("")
  const [priority, setPriority] = useState("")
  const [patientId, setPatientId] = useState("")
  const [notes, setNotes] = useState("")

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)

      const files = Array.from(e.dataTransfer.files)
      handleFiles(files)
    },
    [uploadType, priority, patientId, notes],
  )

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      handleFiles(files)
    }
  }

  const handleFiles = async (files: File[]) => {
    if (!uploadType || !priority) {
      alert("Please select upload type and priority before uploading files")
      return
    }

    const newFiles: UploadedFile[] = files.map((file) => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      file,
      type: uploadType,
      priority,
      patientId: patientId || undefined,
      notes: notes || undefined,
      status: "uploading",
      progress: 0,
    }))

    setUploadedFiles((prev) => [...prev, ...newFiles])

    // Simulate file upload and processing
    for (const uploadedFile of newFiles) {
      await simulateUpload(uploadedFile)
    }
  }

  const simulateUpload = async (uploadedFile: UploadedFile) => {
    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise((resolve) => setTimeout(resolve, 100))
      setUploadedFiles((prev) => prev.map((f) => (f.id === uploadedFile.id ? { ...f, progress } : f)))
    }

    // Change to processing
    setUploadedFiles((prev) =>
      prev.map((f) => (f.id === uploadedFile.id ? { ...f, status: "processing", progress: 0 } : f)),
    )

    // Simulate AI processing
    for (let progress = 0; progress <= 100; progress += 20) {
      await new Promise((resolve) => setTimeout(resolve, 300))
      setUploadedFiles((prev) => prev.map((f) => (f.id === uploadedFile.id ? { ...f, progress } : f)))
    }

    // Complete with AI results
    const aiResults = {
      extractedText: "Patient assessment data extracted successfully...",
      qualityScore: Math.floor(Math.random() * 30) + 70,
      suggestedCodes: ["M79.3", "Z51.11", "I10"],
      riskFactors: ["Fall Risk", "Medication Compliance"],
      financialImpact: Math.floor(Math.random() * 500) + 200,
    }

    setUploadedFiles((prev) =>
      prev.map((f) =>
        f.id === uploadedFile.id
          ? {
              ...f,
              status: "completed",
              progress: 100,
              aiResults,
            }
          : f,
      ),
    )

    // Send notification based on type
    await sendNotification(uploadedFile.type, uploadedFile.priority)
  }

  const sendNotification = async (type: string, priority: string) => {
    try {
      const response = await fetch("/api/notifications/upload-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, priority }),
      })

      if (response.ok) {
        console.log("Notification sent successfully")
      }
    } catch (error) {
      console.error("Failed to send notification:", error)
    }
  }

  const removeFile = (fileId: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "uploading":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">OASIS File Upload</h1>
          <p className="text-gray-600">Upload files for QA review, coding, or referral processing</p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            AI Processing Enabled
          </Badge>
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View Queue
          </Button>
        </div>
      </div>

      {/* Upload Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Upload className="h-5 w-5 mr-2" />
            Upload Configuration
          </CardTitle>
          <CardDescription>Configure upload settings before selecting files</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="upload-type">Upload Type *</Label>
              <Select value={uploadType} onValueChange={setUploadType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="qa-review">QA Review</SelectItem>
                  <SelectItem value="coding-review">Coding Review</SelectItem>
                  <SelectItem value="referral">Referral Processing</SelectItem>
                  <SelectItem value="assessment-review">Assessment Review</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priority Level *</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgent">Urgent (Same Day)</SelectItem>
                  <SelectItem value="high">High (24 Hours)</SelectItem>
                  <SelectItem value="medium">Medium (48 Hours)</SelectItem>
                  <SelectItem value="low">Low (72 Hours)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="patient-id">Patient ID (Optional)</Label>
              <Input
                id="patient-id"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                placeholder="Enter patient ID"
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Input
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional notes"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>File Upload</CardTitle>
          <CardDescription>
            Drag and drop files or click to browse. Supported formats: PDF, JPG, PNG, TIFF, DOC, DOCX
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
              isDragOver ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-gray-400"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-gray-100 rounded-full">
                <Upload className="h-8 w-8 text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Drop files here or click to browse</h3>
                <p className="text-gray-600">Maximum file size: 50MB per file</p>
              </div>
              <input
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.tiff,.doc,.docx"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button size="lg" className="cursor-pointer">
                  <Plus className="h-5 w-5 mr-2" />
                  Choose Files
                </Button>
              </label>
            </div>
          </div>

          {!uploadType || !priority ? (
            <Alert className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>Please configure upload type and priority before uploading files.</AlertDescription>
            </Alert>
          ) : null}
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Files ({uploadedFiles.length})</CardTitle>
            <CardDescription>Track the status of your uploaded files</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        {file.file.type.startsWith("image/") ? (
                          <ImageIcon className="h-5 w-5 text-blue-600" />
                        ) : (
                          <FileText className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium">{file.file.name}</h3>
                        <p className="text-sm text-gray-600">
                          {(file.file.size / 1024 / 1024).toFixed(2)} MB • {file.type}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityColor(file.priority)}>{file.priority}</Badge>
                      <Badge className={getStatusColor(file.status)}>{file.status}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {(file.status === "uploading" || file.status === "processing") && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">
                          {file.status === "uploading" ? "Uploading..." : "AI Processing..."}
                        </span>
                        <span className="text-sm text-gray-600">{file.progress}%</span>
                      </div>
                      <Progress value={file.progress} />
                    </div>
                  )}

                  {/* AI Results */}
                  {file.status === "completed" && file.aiResults && (
                    <div className="mt-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center mb-2">
                        <Brain className="h-4 w-4 text-green-600 mr-2" />
                        <span className="font-medium text-green-900">AI Processing Complete</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <Label className="text-xs font-medium text-green-800">Quality Score</Label>
                          <p className="text-green-700">{file.aiResults.qualityScore}%</p>
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-green-800">Financial Impact</Label>
                          <p className="text-green-700">${file.aiResults.financialImpact}</p>
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-green-800">Suggested Codes</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {file.aiResults.suggestedCodes?.map((code, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {code}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-green-800">Risk Factors</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {file.aiResults.riskFactors?.map((risk, index) => (
                              <Badge key={index} variant="outline" className="text-xs text-orange-600">
                                {risk}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* File Details */}
                  <div className="mt-3 text-sm text-gray-600">
                    {file.patientId && <span>Patient ID: {file.patientId} • </span>}
                    {file.notes && <span>Notes: {file.notes}</span>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processing Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Stethoscope className="h-5 w-5 mr-2" />
            Processing Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-3">Upload Types</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <FileCheck className="h-4 w-4 text-blue-500" />
                  <span>
                    <strong>QA Review:</strong> Complete OASIS assessments
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileCheck className="h-4 w-4 text-green-500" />
                  <span>
                    <strong>Coding Review:</strong> Documents needing ICD-10/HCC codes
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileCheck className="h-4 w-4 text-purple-500" />
                  <span>
                    <strong>Referral:</strong> New patient referrals from hospitals
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileCheck className="h-4 w-4 text-orange-500" />
                  <span>
                    <strong>Assessment Review:</strong> Handwritten assessments
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-3">Priority Levels</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-red-500" />
                  <span>
                    <strong>Urgent:</strong> Processed within same day
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-orange-500" />
                  <span>
                    <strong>High:</strong> Processed within 24 hours
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span>
                    <strong>Medium:</strong> Processed within 48 hours
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-green-500" />
                  <span>
                    <strong>Low:</strong> Processed within 72 hours
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
