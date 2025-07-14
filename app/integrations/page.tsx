"use client"

import IntegrationCard from '@/components/IntegrationCard'
import { useIntegrations } from '@/hooks/useIntegrations'

export default function IntegrationsPage() {
  const { data, loading, error, refresh } = useIntegrations()

  const categories = ['Healthcare', 'Communication', 'Payments', 'Infrastructure']

  const group = (category: string) =>
    data.filter((i) => i.category?.toLowerCase() === category.toLowerCase())

  if (loading) return <p className="p-4">Loading integrations...</p>
  if (error) return <p className="p-4 text-red-500">{error}</p>

  return (
    <div className="space-y-8 p-4">
      {categories.map((cat) => {
        const list = group(cat)
        if (list.length === 0) return null
        return (
          <section key={cat} className="space-y-4">
            <h2 className="text-xl font-semibold">{cat}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {list.map((integration) => (
                <IntegrationCard
                  key={integration.id}
                  integration={integration}
                  onRefresh={refresh}
                />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
