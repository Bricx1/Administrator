"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { useToast } from '@/hooks/use-toast'
import StatusDot from './StatusDot'
import { Integration } from '@/hooks/useIntegrations'

interface Props {
  integration: Integration
  onRefresh?: () => void
}

export default function IntegrationCard({ integration, onRefresh }: Props) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [syncing, setSyncing] = useState(false)
  const [enabled, setEnabled] = useState(integration.status)

  const toggle = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/integrations/${integration.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!res.ok) throw new Error('failed')
      const data = await res.json()
      setEnabled(data.status)
      onRefresh?.()
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Failed to toggle integration',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const syncNow = async () => {
    setSyncing(true)
    try {
      const res = await fetch(`/api/integrations/${integration.id}/sync`, { method: 'POST' })
      if (!res.ok) throw new Error('failed')
      await res.json()
      toast({ title: 'Synced' })
      onRefresh?.()
    } catch (err) {
      toast({ title: 'Error', description: 'Failed to sync', variant: 'destructive' })
    } finally {
      setSyncing(false)
    }
  }

  return (
    <Card className={enabled ? '' : 'opacity-50'}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <StatusDot active={enabled} lastSync={integration.last_sync} />
          {integration.name}
        </CardTitle>
        <Switch checked={enabled} disabled={loading} onCheckedChange={toggle} />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm text-gray-600">Type: {integration.type}</div>
        <div className="text-sm text-gray-600">
          Last Sync: {integration.last_sync ? new Date(integration.last_sync).toLocaleString() : 'Never'}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">Uptime</span>
          <span className="text-sm font-medium">{integration.uptime ?? 0}%</span>
        </div>
        <Progress value={integration.uptime ?? 0} className="h-2" />
        <div className="flex gap-2">
          <Button size="sm" onClick={syncNow} disabled={syncing}>
            {syncing ? 'Syncing...' : 'Sync Now'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
