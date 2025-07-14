import { useState, useEffect } from "react"

export interface Assignment {
  id: string
  staff_id: string
  shift_id: string
  status: string
  created_at: string
}

export function useAssignments() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await fetch("/api/assignments")
        if (!res.ok) throw new Error("Failed to fetch assignments")
        const data = await res.json()
        setAssignments(data)
      } catch (err) {
        console.error("Fetch assignments error:", err)
        setError("Failed to load assignments")
      } finally {
        setLoading(false)
      }
    }

    fetchAssignments()
  }, [])

  return { assignments, loading, error }
}
