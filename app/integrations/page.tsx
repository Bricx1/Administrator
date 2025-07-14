"use client"

import IntegrationCard from '@/components/IntegrationCard'
import { useIntegrations } from '@/hooks/useIntegrations'

export default function IntegrationsPage() {
  const { data, loading, error } = useIntegrations()

  const categories = [
    { key: 'Healthcare', title: 'Healthcare & Eligibility Platforms' },
    { key: 'Communication', title: 'Communication Platforms' },
    { key: 'Payments', title: 'Financial & Payment Platforms' },
    { key: 'Infrastructure', title: 'Infrastructure & Core Services' },
  ]

  const group = (key: string) =>
    data.filter((i) => i.category?.toLowerCase() === key.toLowerCase())

  const totalConnected = data.filter((i) => i.status).length
  const totalDown = data.filter((i) => !i.status).length
  const totalCalls = data.reduce((sum, i) => sum + (i.api_calls_today || 0), 0)
  const avgUptime =
    data.length > 0
      ? Math.round(
          data.reduce((sum, i) => sum + (i.uptime || 0), 0) / data.length,
        )
      : 0

  if (loading) return <p className="p-4">Loading integrations...</p>
  if (error) return <p className="p-4 text-red-500">{error}</p>

  return (
    <div className="max-w-screen-xl mx-auto space-y-8 p-4">
      <h1 className="text-2xl font-bold">M.A.S.E Integrations</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="rounded-lg bg-green-50 p-4">
          <div className="text-sm">✔️ Connected</div>
          <div className="text-2xl font-semibold">{totalConnected}</div>
        </div>
        <div className="rounded-lg bg-red-50 p-4">
          <div className="text-sm">❌ Down</div>
          <div className="text-2xl font-semibold">{totalDown}</div>
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

      {categories.map(({ key, title }) => {
        const list = group(key)
        if (list.length === 0) return null
        return (
          <section key={key} className="space-y-4">
            <h2 className="text-xl font-semibold">{title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {list.map((integration) => (
                <IntegrationCard
                  key={integration.id}
                  name={integration.name}
                  status={integration.status}
                  lastSync={
                    integration.last_sync
                      ? new Date(integration.last_sync).toLocaleString()
                      : 'Never'
                  }
                  category={integration.category}
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
