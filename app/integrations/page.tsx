"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import useIntegrations from "@/hooks/useIntegrations"

async function toggleIntegration(id: string, enabled: boolean, refresh: () => void) {
  try {
    const res = await fetch(`/api/integrations/${id}/toggle`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enabled }),
    })
    if (res.ok) {
      refresh()
    } else {
      console.error("Failed to toggle integration")
      alert("Failed to toggle integration")
    }
  } catch (err) {
    console.error(err)
    alert("Failed to toggle integration")
  }
}

export default function IntegrationsPage() {
  const { data, loading, error, refresh } = useIntegrations()

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Integrations</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {data.map((integration) => (
        <Card key={integration.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{integration.name}</CardTitle>
            <span
              className={
                integration.status === 'connected'
                  ? 'text-green-600'
                  : integration.status === 'error'
                  ? 'text-red-600'
                  : 'text-gray-600'
              }
            >
              {integration.status}
            </span>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Uptime: {integration.uptime}%</p>
            <div className="space-x-2">
              <Button asChild size="sm">
                <Link href={`/integrations/${integration.id}-setup`}>Configure</Link>
              </Button>
              <Button
                size="sm"
                onClick={() =>
                  toggleIntegration(
                    integration.id,
                    integration.status !== 'connected',
                    refresh,
                  )
                }
              >
                {integration.status === 'connected' ? 'Disable' : 'Enable'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() =>
                  fetch("/api/integrations/test-connection", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: integration.id }),
                  })
                }
              >
                Test
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
      <Button onClick={refresh} variant="secondary">
        Refresh
      </Button>
    </div>
  )
}
