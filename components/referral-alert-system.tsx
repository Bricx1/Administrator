"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  AlertTriangle,
  DollarSign,
  Clock,
  Bell,
  Volume2,
  VolumeX,
  Settings,
  CheckCircle,
  XCircle,
  Zap,
  Mail,
  MessageSquare,
  Users,
} from "lucide-react"

interface AlertRule {
  id: string
  name: string
  type: "stat" | "high_value" | "urgent_review" | "processing_delay" | "insurance_issue"
  enabled: boolean
  conditions: {
    urgency?: string[]
    minValue?: number
    maxProcessingTime?: number
    insuranceTypes?: string[]
    sources?: string[]
  }
  notifications: {
    visual: boolean
    audio: boolean
    email: boolean
    sms: boolean
    desktop: boolean
  }
  recipients: string[]
  priority: "low" | "medium" | "high" | "critical"
}

interface ActiveAlert {
  id: string
  ruleId: string
  referralId: string
  patientName: string
  message: string
  priority: "low" | "medium" | "high" | "critical"
  timestamp: string
  acknowledged: boolean
  autoResolve: boolean
  resolveAfter?: number // minutes
}

const defaultAlertRules: AlertRule[] = [
  {
    id: "stat-referrals",
    name: "STAT Referrals",
    type: "stat",
    enabled: true,
    conditions: {
      urgency: ["STAT"],
    },
    notifications: {
      visual: true,
      audio: true,
      email: true,
      sms: true,
      desktop: true,
    },
    recipients: ["admin@agency.com", "supervisor@agency.com"],
    priority: "critical",
  },
  {
    id: "high-value-referrals",
    name: "High Value Referrals",
    type: "high_value",
    enabled: true,
    conditions: {
      minValue: 5000,
    },
    notifications: {
      visual: true,
      audio: true,
      email: true,
      sms: false,
      desktop: true,
    },
    recipients: ["admin@agency.com", "billing@agency.com"],
    priority: "high",
  },
  {
    id: "urgent-review-needed",
    name: "Urgent Review Required",
    type: "urgent_review",
    enabled: true,
    conditions: {
      urgency: ["Urgent"],
    },
    notifications: {
      visual: true,
      audio: false,
      email: true,
      sms: false,
      desktop: true,
    },
    recipients: ["supervisor@agency.com"],
    priority: "medium",
  },
  {
    id: "processing-delays",
    name: "Processing Delays",
    type: "processing_delay",
    enabled: true,
    conditions: {
      maxProcessingTime: 300, // 5 minutes
    },
    notifications: {
      visual: true,
      audio: false,
      email: false,
      sms: false,
      desktop: true,
    },
    recipients: ["tech@agency.com"],
    priority: "medium",
  },
  {
    id: "insurance-issues",
    name: "Insurance Verification Issues",
    type: "insurance_issue",
    enabled: true,
    conditions: {
      insuranceTypes: ["Medicaid", "Self Pay"],
    },
    notifications: {
      visual: true,
      audio: false,
      email: true,
      sms: false,
      desktop: false,
    },
    recipients: ["billing@agency.com"],
    priority: "low",
  },
]

export function ReferralAlertSystem() {
  const [alertRules, setAlertRules] = useState<AlertRule[]>(defaultAlertRules)
  const [activeAlerts, setActiveAlerts] = useState<ActiveAlert[]>([])
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [desktopNotificationsEnabled, setDesktopNotificationsEnabled] = useState(false)
  const [alertVolume, setAlertVolume] = useState(0.7)
  const [showSettings, setShowSettings] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Request desktop notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        setDesktopNotificationsEnabled(permission === "granted")
      })
    } else if ("Notification" in window && Notification.permission === "granted") {
      setDesktopNotificationsEnabled(true)
    }
  }, [])

  // Simulate incoming referrals and trigger alerts
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate random referral events
      const shouldTriggerAlert = Math.random() > 0.8 // 20% chance

      if (shouldTriggerAlert) {
        const alertTypes = [
          {
            type: "stat",
            message: "STAT referral received - Immediate attention required",
            priority: "critical" as const,
            patientName: "Emergency Patient",
          },
          {
            type: "high_value",
            message: "High-value referral ($8,500) - Review for acceptance",
            priority: "high" as const,
            patientName: "Premium Care Patient",
          },
          {
            type: "urgent_review",
            message: "Urgent referral requires manual review",
            priority: "medium" as const,
            patientName: "Review Required Patient",
          },
        ]

        const randomAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)]
        triggerAlert(randomAlert.type, randomAlert.message, randomAlert.priority, randomAlert.patientName)
      }
    }, 15000) // Check every 15 seconds

    return () => clearInterval(interval)
  }, [alertRules, soundEnabled, desktopNotificationsEnabled])

  // Auto-resolve alerts
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAlerts((prev) =>
        prev.filter((alert) => {
          if (alert.autoResolve && alert.resolveAfter) {
            const alertTime = new Date(alert.timestamp).getTime()
            const now = new Date().getTime()
            const minutesElapsed = (now - alertTime) / (1000 * 60)
            return minutesElapsed < alert.resolveAfter
          }
          return true
        }),
      )
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  const triggerAlert = (ruleType: string, message: string, priority: ActiveAlert["priority"], patientName: string) => {
    const rule = alertRules.find((r) => r.type === ruleType && r.enabled)
    if (!rule) return

    const newAlert: ActiveAlert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ruleId: rule.id,
      referralId: `REF-${Date.now()}`,
      patientName,
      message,
      priority,
      timestamp: new Date().toISOString(),
      acknowledged: false,
      autoResolve: priority !== "critical",
      resolveAfter: priority === "critical" ? undefined : 30, // Auto-resolve non-critical alerts after 30 minutes
    }

    setActiveAlerts((prev) => [newAlert, ...prev])

    // Trigger notifications based on rule settings
    if (rule.notifications.visual) {
      // Visual alert is handled by the UI
    }

    if (rule.notifications.audio && soundEnabled) {
      playAlertSound(priority)
    }

    if (rule.notifications.desktop && desktopNotificationsEnabled) {
      showDesktopNotification(newAlert)
    }

    if (rule.notifications.email) {
      sendEmailAlert(newAlert, rule.recipients)
    }

    if (rule.notifications.sms) {
      sendSMSAlert(newAlert, rule.recipients)
    }
  }

  const playAlertSound = (priority: ActiveAlert["priority"]) => {
    if (audioRef.current) {
      audioRef.current.volume = alertVolume
      // Different sounds for different priorities
      switch (priority) {
        case "critical":
          // Play urgent beeping sound
          audioRef.current.src = "/sounds/critical-alert.mp3"
          break
        case "high":
          audioRef.current.src = "/sounds/high-alert.mp3"
          break
        default:
          audioRef.current.src = "/sounds/standard-alert.mp3"
          break
      }
      audioRef.current.play().catch(console.error)
    }
  }

  const showDesktopNotification = (alert: ActiveAlert) => {
    if ("Notification" in window && Notification.permission === "granted") {
      const notification = new Notification(`${alert.priority.toUpperCase()} Alert`, {
        body: `${alert.patientName}: ${alert.message}`,
        icon: "/icons/alert-icon.png",
        tag: alert.id,
        requireInteraction: alert.priority === "critical",
      })

      notification.onclick = () => {
        window.focus()
        acknowledgeAlert(alert.id)
        notification.close()
      }

      // Auto-close non-critical notifications
      if (alert.priority !== "critical") {
        setTimeout(() => notification.close(), 10000)
      }
    }
  }

  const sendEmailAlert = async (alert: ActiveAlert, recipients: string[]) => {
    try {
      await fetch("/api/notifications/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipients,
          subject: `${alert.priority.toUpperCase()} Referral Alert`,
          message: `Patient: ${alert.patientName}\nAlert: ${alert.message}\nTime: ${new Date(alert.timestamp).toLocaleString()}\nReferral ID: ${alert.referralId}`,
          priority: alert.priority,
        }),
      })
    } catch (error) {
      console.error("Failed to send email alert:", error)
    }
  }

  const sendSMSAlert = async (alert: ActiveAlert, recipients: string[]) => {
    try {
      await fetch("/api/notifications/sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipients,
          message: `ALERT: ${alert.patientName} - ${alert.message}. Referral ID: ${alert.referralId}`,
          priority: alert.priority,
        }),
      })
    } catch (error) {
      console.error("Failed to send SMS alert:", error)
    }
  }

  const acknowledgeAlert = (alertId: string) => {
    setActiveAlerts((prev) => prev.map((alert) => (alert.id === alertId ? { ...alert, acknowledged: true } : alert)))
  }

  const dismissAlert = (alertId: string) => {
    setActiveAlerts((prev) => prev.filter((alert) => alert.id !== alertId))
  }

  const updateAlertRule = (ruleId: string, updates: Partial<AlertRule>) => {
    setAlertRules((prev) => prev.map((rule) => (rule.id === ruleId ? { ...rule, ...updates } : rule)))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-500 text-white animate-pulse"
      case "high":
        return "bg-orange-500 text-white"
      case "medium":
        return "bg-yellow-500 text-black"
      case "low":
        return "bg-blue-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "critical":
        return <Zap className="h-4 w-4" />
      case "high":
        return <AlertTriangle className="h-4 w-4" />
      case "medium":
        return <Clock className="h-4 w-4" />
      case "low":
        return <Bell className="h-4 w-4" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  const criticalAlerts = activeAlerts.filter((a) => a.priority === "critical" && !a.acknowledged)
  const highAlerts = activeAlerts.filter((a) => a.priority === "high" && !a.acknowledged)
  const otherAlerts = activeAlerts.filter((a) => !["critical", "high"].includes(a.priority) && !a.acknowledged)

  return (
    <div className="space-y-6">
      {/* Audio element for alert sounds */}
      <audio ref={audioRef} preload="auto" />

      {/* Critical Alerts Banner */}
      {criticalAlerts.length > 0 && (
        <Alert className="border-red-500 bg-red-50 animate-pulse">
          <Zap className="h-4 w-4 text-red-500" />
          <AlertDescription className="font-semibold text-red-700">
            🚨 {criticalAlerts.length} CRITICAL ALERT{criticalAlerts.length > 1 ? "S" : ""} - Immediate Action Required!
          </AlertDescription>
        </Alert>
      )}

      {/* Alert Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Referral Alert System</span>
                {activeAlerts.filter((a) => !a.acknowledged).length > 0 && (
                  <Badge variant="destructive" className="animate-bounce">
                    {activeAlerts.filter((a) => !a.acknowledged).length} Active
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>Real-time alerts for STAT referrals and high-value cases</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={() => setShowSettings(!showSettings)}>
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
              <div className="flex items-center space-x-2">
                {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} />
              </div>
            </div>
          </div>
        </CardHeader>

        {showSettings && (
          <CardContent className="border-t">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Alert Volume</Label>
                  <Input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={alertVolume}
                    onChange={(e) => setAlertVolume(Number.parseFloat(e.target.value))}
                  />
                  <div className="text-xs text-muted-foreground">{Math.round(alertVolume * 100)}%</div>
                </div>

                <div className="space-y-2">
                  <Label>Desktop Notifications</Label>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={desktopNotificationsEnabled}
                      onCheckedChange={setDesktopNotificationsEnabled}
                      disabled={!("Notification" in window)}
                    />
                    <span className="text-sm">
                      {!("Notification" in window)
                        ? "Not supported"
                        : Notification.permission === "denied"
                          ? "Permission denied"
                          : desktopNotificationsEnabled
                            ? "Enabled"
                            : "Disabled"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Test Alerts</Label>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => triggerAlert("stat", "Test STAT alert", "critical", "Test Patient")}
                    >
                      Test STAT
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => triggerAlert("high_value", "Test high-value alert", "high", "Test Patient")}
                    >
                      Test High Value
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Alert Rules Configuration */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Alert Rules</h3>
                <div className="space-y-3">
                  {alertRules.map((rule) => (
                    <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Switch
                          checked={rule.enabled}
                          onCheckedChange={(enabled) => updateAlertRule(rule.id, { enabled })}
                        />
                        <div>
                          <div className="font-medium">{rule.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {rule.type === "stat" && "Triggers on STAT urgency referrals"}
                            {rule.type === "high_value" && `Triggers on referrals ≥ $${rule.conditions.minValue}`}
                            {rule.type === "urgent_review" && "Triggers on urgent referrals needing review"}
                            {rule.type === "processing_delay" && "Triggers on processing delays"}
                            {rule.type === "insurance_issue" && "Triggers on insurance verification issues"}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(rule.priority)}>{rule.priority.toUpperCase()}</Badge>
                        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                          {rule.notifications.visual && <Bell className="h-3 w-3" />}
                          {rule.notifications.audio && <Volume2 className="h-3 w-3" />}
                          {rule.notifications.email && <Mail className="h-3 w-3" />}
                          {rule.notifications.sms && <MessageSquare className="h-3 w-3" />}
                          {rule.notifications.desktop && <Users className="h-3 w-3" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Active Alerts */}
      {activeAlerts.filter((a) => !a.acknowledged).length > 0 && (
        <div className="space-y-4">
          {/* Critical Alerts */}
          {criticalAlerts.length > 0 && (
            <Card className="border-red-500">
              <CardHeader className="bg-red-50">
                <CardTitle className="text-red-700 flex items-center space-x-2">
                  <Zap className="h-5 w-5" />
                  <span>Critical Alerts ({criticalAlerts.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {criticalAlerts.map((alert) => (
                  <div key={alert.id} className="p-4 border-b last:border-b-0 bg-red-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-red-500 rounded-full animate-pulse">
                          <Zap className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-red-900">{alert.patientName}</div>
                          <div className="text-red-700">{alert.message}</div>
                          <div className="text-xs text-red-600">
                            {new Date(alert.timestamp).toLocaleTimeString()} • Referral: {alert.referralId}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" onClick={() => acknowledgeAlert(alert.id)}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Acknowledge
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => dismissAlert(alert.id)}>
                          <XCircle className="h-4 w-4 mr-2" />
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* High Priority Alerts */}
          {highAlerts.length > 0 && (
            <Card className="border-orange-500">
              <CardHeader className="bg-orange-50">
                <CardTitle className="text-orange-700 flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5" />
                  <span>High Priority Alerts ({highAlerts.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {highAlerts.map((alert) => (
                  <div key={alert.id} className="p-4 border-b last:border-b-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-orange-500 rounded-full">
                          <DollarSign className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold">{alert.patientName}</div>
                          <div className="text-muted-foreground">{alert.message}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(alert.timestamp).toLocaleTimeString()} • Referral: {alert.referralId}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" onClick={() => acknowledgeAlert(alert.id)}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Acknowledge
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => dismissAlert(alert.id)}>
                          <XCircle className="h-4 w-4 mr-2" />
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Other Alerts */}
          {otherAlerts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Other Alerts ({otherAlerts.length})</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {otherAlerts.map((alert) => (
                  <div key={alert.id} className="p-4 border-b last:border-b-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${getPriorityColor(alert.priority)}`}>
                          {getPriorityIcon(alert.priority)}
                        </div>
                        <div>
                          <div className="font-medium">{alert.patientName}</div>
                          <div className="text-muted-foreground">{alert.message}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(alert.timestamp).toLocaleTimeString()} • Referral: {alert.referralId}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" onClick={() => acknowledgeAlert(alert.id)}>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Acknowledge
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => dismissAlert(alert.id)}>
                          <XCircle className="h-4 w-4 mr-2" />
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Alert History */}
      {activeAlerts.filter((a) => a.acknowledged).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Acknowledged Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {activeAlerts
                .filter((a) => a.acknowledged)
                .map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{alert.patientName}</span>
                      <span className="text-xs text-muted-foreground">{alert.message}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Active Alerts */}
      {activeAlerts.filter((a) => !a.acknowledged).length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-700">All Clear!</h3>
            <p className="text-muted-foreground">No active alerts at this time.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
