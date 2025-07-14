"use client"

import { useState } from 'react'

export interface IntegrationCardProps {
  name: string
  status: boolean
  lastSync: string
  category: string
  iconColor: string
  onConfigure?: () => void
  onTest?: () => void
}

export default function IntegrationCard({
  name,
  status,
  lastSync,
  iconColor,
  onConfigure,
  onTest,
}: IntegrationCardProps) {
  const [enabled, setEnabled] = useState(status)

  const toggle = () => setEnabled(!enabled)

  return (
    <div
      className="rounded-lg border bg-white p-4 shadow-sm flex flex-col justify-between"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className={`h-4 w-4 rounded-sm ${iconColor}`} />
          <h3 className="font-medium">{name}</h3>
        </div>
        <label className="flex items-center cursor-pointer gap-2 text-sm">
          <span>{enabled ? 'Connected' : 'Disconnected'}</span>
          <input
            type="checkbox"
            checked={enabled}
            onChange={toggle}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
          />
        </label>
      </div>
      <div className="mt-2 text-sm text-gray-600">
        Last sync: {lastSync}
      </div>
      <div className="mt-1 text-sm">
        API status:{' '}
        <span className={enabled ? 'text-green-600' : 'text-red-600'}>
          {enabled ? 'Success' : 'Error'}
        </span>
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
