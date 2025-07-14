"use client"

import { useCallback, useEffect, useState } from 'react'
import type { Integration } from '@/types/integration'

export default function useIntegrations() {
  const [data, setData] = useState<Integration[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/integrations')
      if (!res.ok) throw new Error('Failed to load integrations')
      const json = await res.json()
      setData(json)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refresh: fetchData }
}
