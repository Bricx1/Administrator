import { useEffect, useState } from 'react'

export function useIntegrations(category?: string) {
  const [data, setData] = useState([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true
    const fetchData = async () => {
      try {
        const res = await fetch(
          `/api/integrations${category ? `?category=${encodeURIComponent(category)}` : ''}`
        )
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || 'Request failed')
        }
        const json = await res.json()
        if (isMounted) setData(json)
      } catch (err: any) {
        console.error('Fetch error:', err.message)
        if (isMounted) setError(err.message)
      }
    }
    fetchData()
    return () => {
      isMounted = false
    }
  }, [category])

  return { data, error }
}
