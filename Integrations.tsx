"use client"

import IntegrationCard from '@/components/IntegrationCard'
import { useIntegrations } from '@/hooks/useIntegrations'

export default function Integrations() {
  const { data: integrations, loading, error } = useIntegrations()

  const categories: Record<string, string> = {
    Healthcare: 'Healthcare & Eligibility Platforms',
    Communication: 'Communication Platforms',
    Payments: 'Financial & Payment Platforms',
    Infrastructure: 'Infrastructure & Core Services',
  }

  const totalConnected = integrations.filter(
    (i) => i.status === true || i.status === 'connected',
  ).length
  const totalErrors = integrations.filter(
    (i) => i.status === false || i.status === 'error',
  ).length
  const totalCalls = integrations.reduce(
    (sum, i) => sum + (i.api_calls_today || 0),
    0,
  )
  const avgUptime =
    integrations.length > 0
      ? Math.round(
          integrations.reduce((sum, i) => sum + (i.uptime || 0), 0) /
            integrations.length,
        )
      : 0

  if (loading) return <p className="p-4">Loading integrations...</p>
  if (error)
    return (
      <p className="p-4 text-red-500">Failed to load integrations: {error}</p>
    )

  return (
    <div className="mx-auto max-w-screen-xl space-y-8 p-4">
      <h1 className="text-2xl font-bold">M.A.S.E Integrations</h1>
      <div className="grid grid-cols-2 gap-4 text-center sm:grid-cols-4">
        <div className="rounded-lg bg-green-50 p-4">
          <div className="text-sm">✔️ Connected</div>
          <div className="text-2xl font-semibold">{totalConnected}</div>
        </div>
        <div className="rounded-lg bg-red-50 p-4">
          <div className="text-sm">❌ Errors</div>
          <div className="text-2xl font-semibold">{totalErrors}</div>
        </div>
        <div className="rounded-lg bg-blue-50 p-4">
          <div className="text-sm">API Calls Today</div>
          <div className="text-2xl font-semibold">{totalCalls}</div>
        </div>
        <div className="rounded-lg bg-yellow-50 p-4">
          <div className="text-sm">Avg Uptime</div>
          <div className="text-2xl font-semibold">{avgUptime}%</div>
        </div>
      </div>

      {Object.entries(categories).map(([key, title]) => {
        const items = integrations.filter(
          (i) => i.category?.toLowerCase() === key.toLowerCase(),
        )
        if (items.length === 0) return null
        return (
          <section key={key} className="space-y-4">
            <h2 className="text-xl font-semibold">{title}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((integration) => (
                <IntegrationCard
                  key={integration.id}
                  name={integration.name}
                  shortLabel={integration.type}
                  status={integration.status as any}
                  lastSync={
                    integration.last_sync
                      ? new Date(integration.last_sync).toLocaleString()
                      : null
                  }
                  apiCalls={integration.api_calls_today}
                  uptime={integration.uptime ?? undefined}
                  iconColor="bg-gray-300"
                  onConfigure={() => {}}
                  onTest={() => {}}
                />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
