import { useEffect, useState } from 'react'
import { fetchIntegrationSettings } from '@/lib/integrationSettings'

export function useIntegrationSettings(platform: string) {
  const [data, setData] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    async function load() {
      try {
        const settings = await fetchIntegrationSettings(platform)
        if (isMounted) setData(settings)
      } catch (err) {
        console.error('Fetch integration settings error:', err)
        if (isMounted) setError('Failed to load settings')
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    if (platform) {
      setLoading(true)
      load()
    }
    return () => {
      isMounted = false
    }
  }, [platform])

  return { data, loading, error }
}
