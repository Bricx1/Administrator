import { useCallback, useEffect, useState } from 'react'

export interface Integration {
  id: string
  name: string
  type: string
  category: string
  status: boolean
  last_sync: string | null
  sync_rate: string | null
  api_calls_today: number
  uptime: number | null
  created_at: string
}

export function useIntegrations() {
  const [data, setData] = useState<Integration[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshIdx, setRefreshIdx] = useState(0)

  const refresh = useCallback(() => setRefreshIdx((i) => i + 1), [])

  useEffect(() => {
    let isMounted = true
    async function fetchData() {
      setLoading(true)
      try {
        const res = await fetch('/api/integrations')
        if (!res.ok) throw new Error('request failed')
        const json = await res.json()
        if (isMounted) setData(json)
      } catch (err) {
        console.error('Fetch integrations error:', err)
        if (isMounted) setError('Failed to load integrations')
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchData()
    return () => {
      isMounted = false
    }
  }, [refreshIdx])

  return { data, loading, error, refresh }
}
