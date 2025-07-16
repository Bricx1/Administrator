"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export interface MyTableRow {
  id: string
  name: string
  email: string
  created_at: string
}

export function MyTableList() {
  const [rows, setRows] = useState<MyTableRow[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchRows = async () => {
      const { data, error } = await supabase
        .from<MyTableRow>("my_table")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        setError(error.message)
      } else {
        setRows(data ?? [])
      }
    }

    fetchRows()
  }, [])

  if (error) return <div>Error: {error}</div>

  return (
    <ul>
      {rows.map((row) => (
        <li key={row.id}>
          <strong>{row.name}</strong> ({row.email}) - {new Date(row.created_at).toLocaleString()}
        </li>
      ))}
    </ul>
  )
}
