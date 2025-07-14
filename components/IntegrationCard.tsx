"use client"

import { useState } from 'react'

export interface IntegrationCardProps {
  name: string
  shortLabel?: string
  status: 'connected' | 'disconnected' | 'error' | boolean
  lastSync?: string | null
  apiCalls?: number
  uptime?: number
  iconColor?: string
  onConfigure?: () => void
  onTest?: () => void
}

export default function IntegrationCard({
  name,
  shortLabel,
  status,
  lastSync,
  apiCalls,
  uptime,
  iconColor = 'bg-gray-300',
  onConfigure,
  onTest,
}: IntegrationCardProps) {
  const [enabled, setEnabled] = useState(
    status === 'connected' || status === true,
  )

  const toggle = () => setEnabled(!enabled)

  const statusLabel = (() => {
    if (typeof status === 'string') return status
    return enabled ? 'connected' : 'disconnected'
  })()

  const statusColor =
    statusLabel === 'connected'
      ? 'bg-green-500'
      : statusLabel === 'error'
      ? 'bg-red-500'
      : 'bg-gray-400'

  return (
    <div className="flex flex-col justify-between rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className={`h-4 w-4 rounded-sm ${iconColor}`} />
          <div>
            <h3 className="font-medium leading-none">{name}</h3>
            {shortLabel && <p className="text-xs text-gray-500">{shortLabel}</p>}
          </div>
        </div>
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <span className="flex items-center gap-1">
            <span className={`h-2 w-2 rounded-full ${statusColor}`} />
            {statusLabel.charAt(0).toUpperCase() + statusLabel.slice(1)}
          </span>
          <input
            type="checkbox"
            checked={enabled}
            onChange={toggle}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
          />
        </label>
      </div>
      <div className="mt-2 space-y-1 text-sm text-gray-600">
        <div>Last sync: {lastSync ?? 'N/A'}</div>
        {apiCalls !== undefined && <div>API Calls: {apiCalls}</div>}
        {uptime !== undefined && <div>Uptime: {uptime}%</div>}
      </div>
      <div className="mt-4 flex gap-2">
        <button
          onClick={onConfigure}
          className="rounded bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600"
        >
          Configure
        </button>
        <button
          onClick={onTest}
          className="rounded bg-gray-200 px-3 py-1 text-sm hover:bg-gray-300"
        >
          Test
        </button>
      </div>
    </div>
  )
}
