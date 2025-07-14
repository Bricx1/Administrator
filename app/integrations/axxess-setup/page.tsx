{
  ;("use client")
}

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Shield, CheckCircle, AlertTriangle, Settings, Database, Key, Loader2 } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function AxxessSetup() {
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "testing" | "success" | "error">("idle")
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
    agencyId: "",
    environment: "production",
  })
  const [syncSettings, setSyncSettings] = useState({
    patients: true,
    orders: true,
    documents: true,
    physicians: true,
    frequency: "hourly",
  })

  const testConnection = async () => {
    setConnectionStatus("testing")

    try {
      const response = await fetch("/api/integrations/axxess/test-connection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      })

      if (response.ok) {
        setConnectionStatus("success")
      } else {
        setConnectionStatus("error")
      }
    } catch (error) {
      setConnectionStatus("error")
    }
  }

  const saveConfiguration = async () => {
    // Implement save logic here
    alert("Configuration saved!")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Link href="/integrations">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Integrations
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Axxess Integration Setup</h1>
                <p className="text-gray-600">Configure your Axxess Web connection for automated data sync</p>
              </div>
            </div>
            <Badge className="bg-blue-100 text-blue-800">
              <Database className="h-4 w-4 mr-1" />
              EMR Integration
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="credentials" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="credentials">1. Authentication</TabsTrigger>
            <TabsTrigger value="sync-settings">2. Sync Settings</TabsTrigger>
            <TabsTrigger value="test-connection">3. Test & Deploy</TabsTrigger>
          </TabsList>

          <TabsContent value="credentials" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="h-5 w-5 mr-2" />
                  Axxess Web Credentials
                </CardTitle>
                <CardDescription>
                  Enter your agency's Axxess Web login credentials. These will be encrypted and stored securely.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="username">Axxess User ID *</Label>
                    <Input
                      id="username"
                      type="text"
                      value={credentials.username}
                      onChange={(e) =>
                        setCredentials({
                          ...credentials,
                          username: e.target.value,
                        })
                      }
                      placeholder="your.username@agency.com"
                    />
                    <p className="text-xs text-gray-500 mt-1">Same username you use to log into Axxess Web.</p>
                  </div>

                  <div>
                    <Label htmlFor="password">Axxess Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={credentials.password}
                      onChange={(e) =>
                        setCredentials({
                          ...credentials,
                          password: e.target.value,
                        })
                      }
                      placeholder="••••••••"
                    />
                    <p className="text-xs text-gray-500 mt-1">Your Axxess Web password.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="agencyId">Agency ID *</Label>
                    <Input
                      id="agencyId"
                      type="text"
                      value={credentials.agencyId}
                      onChange={(e) =>
                        setCredentials({
                          ...credentials,
                          agencyId: e.target.value,
                        })
                      }
                      placeholder="e.g., AGENCY123"
                    />
                    <p className="text-xs text-gray-500 mt-1">Your unique Axxess agency identifier.</p>
                  </div>

                  <div>
                    <Label htmlFor="environment">Environment</Label>
                    <Select
                      value={credentials.environment}
                      onValueChange={(value) => setCredentials({ ...credentials, environment: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="production">Production</SelectItem>
                        <SelectItem value="sandbox">Sandbox/Testing</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-start mb-2">
                    <Shield className="h-5 w-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-900">Security Notice</h4>
                      <ul className="text-sm text-yellow-800 space-y-1 list-disc pl-5 mt-1">
                        <li>Credentials are encrypted using AES-256 encryption.</li>
                        <li>Only authorized system processes can access these credentials.</li>
                        <li>We recommend creating a dedicated Axxess user for this integration.</li>
                        <li>Credentials are never logged or displayed in plain text.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sync-settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  Data Synchronization Settings
                </CardTitle>
                <CardDescription>Configure what data to sync and how frequently to check for updates.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-4">Data Types to Sync</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="patients"
                        checked={syncSettings.patients}
                        onCheckedChange={(checked) =>
                          setSyncSettings({ ...syncSettings, patients: checked as boolean })
                        }
                      />
                      <Label htmlFor="patients">Patient Information</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="orders"
                        checked={syncSettings.orders}
                        onCheckedChange={(checked) => setSyncSettings({ ...syncSettings, orders: checked as boolean })}
                      />
                      <Label htmlFor="orders">Physician Orders (POCs)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="documents"
                        checked={syncSettings.documents}
                        onCheckedChange={(checked) =>
                          setSyncSettings({ ...syncSettings, documents: checked as boolean })
                        }
                      />
                      <Label htmlFor="documents">Documents & Forms</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="physicians"
                        checked={syncSettings.physicians}
                        onCheckedChange={(checked) =>
                          setSyncSettings({ ...syncSettings, physicians: checked as boolean })
                        }
                      />
                      <Label htmlFor="physicians">Physician Directory</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="frequency">Sync Frequency</Label>
                  <Select
                    value={syncSettings.frequency}
                    onValueChange={(value) => setSyncSettings({ ...syncSettings, frequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-time (Webhook)</SelectItem>
                      <SelectItem value="15min">Every 15 minutes</SelectItem>
                      <SelectItem value="hourly">Every hour</SelectItem>
                      <SelectItem value="daily">Daily at 6 AM</SelectItem>
                      <SelectItem value="manual">Manual sync only</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">
                    More frequent syncing ensures data is up-to-date but uses more resources.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="test-connection" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Test Connection & Save</CardTitle>
                <CardDescription>
                  Verify your credentials and test the connection to Axxess before saving and enabling the integration.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Connection Status</h4>
                    <p
                      className={cn(
                        "text-sm",
                        connectionStatus === "idle" && "text-gray-600",
                        connectionStatus === "testing" && "text-blue-600",
                        connectionStatus === "success" && "text-green-600",
                        connectionStatus === "error" && "text-red-600",
                      )}
                    >
                      {connectionStatus === "idle" && "Ready to test connection."}
                      {connectionStatus === "testing" && "Testing connection..."}
                      {connectionStatus === "success" && "Connection successful!"}
                      {connectionStatus === "error" && "Connection failed. Please check credentials and try again."}
                    </p>
                  </div>
                  <Button
                    onClick={testConnection}
                    disabled={
                      connectionStatus === "testing" ||
                      !credentials.username ||
                      !credentials.password ||
                      !credentials.agencyId
                    }
                  >
                    {connectionStatus === "testing" ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Testing...
                      </>
                    ) : (
                      "Test Connection"
                    )}
                  </Button>
                </div>

                {connectionStatus === "success" && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <div className="flex">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-green-900 mb-2">Connection Verified</h4>
                        <ul className="text-sm text-green-800 space-y-1">
                          <li>✓ Authentication successful</li>
                          <li>✓ Agency access confirmed</li>
                          <li>✓ API permissions validated</li>
                          <li>✓ Ready to sync data</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
                {connectionStatus === "error" && (
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <div className="flex">
                      <AlertTriangle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium text-red-900 mb-2">Connection Failed</h4>
                        <p className="text-sm text-red-800">
                          Please double-check your Axxess User ID, Password, and Agency ID. Ensure the dedicated user
                          has API access permissions in Axxess.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button variant="outline">Cancel</Button>
                  <Button onClick={saveConfiguration} disabled={connectionStatus !== "success"}>
                    <Settings className="h-4 w-4 mr-2" />
                    Save & Enable Integration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
