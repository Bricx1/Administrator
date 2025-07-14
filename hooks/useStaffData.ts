import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export interface Staff {
  id: string
  name: string
  email: string
  role: string
  created_at: string
}

export function useStaffData() {
  const [staff, setStaff] = useState<Staff[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true)
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Fetch staff error:', error)
        setError('Failed to fetch staff')
      } else {
        setStaff(data || [])
      }
      setLoading(false)
    }

    fetchStaff()
  }, [])

  return { staff, loading, error }
}
