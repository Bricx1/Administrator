"use client"

import { useCallback, useEffect, useState } from 'react'
import type { Integration } from '@/types/integration'

export default function useIntegrations() {
  const [data, setData] = useState<Integration[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async (isMounted: () => boolean) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/integrations')
      const json = await res.json().catch(() => null)
      if (!res.ok || !json) throw new Error('Failed to load integrations')
      if (isMounted()) setData(json)
    } catch (err: any) {
      if (isMounted()) setError(err.message)
    } finally {
      if (isMounted()) setLoading(false)
    }
  }, [])

  useEffect(() => {
    let mounted = true
    fetchData(() => mounted)
    return () => {
      mounted = false
    }
  }, [fetchData])

  return { data, loading, error, refresh: fetchData }
}
