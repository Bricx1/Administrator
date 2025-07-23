"use client"

import { useEffect, useState, useRef } from "react"
import { Switch } from "@/components/ui/switch"
import { supabase } from "@/lib/supabase"

interface IntegrationStatusToggleProps {
  id: string // this is the slug (e.g. "axxess")
  enabled: boolean
  onChange?: (value: boolean) => void
}

export default function IntegrationStatusToggle({
  id,
  enabled,
  onChange,
}: IntegrationStatusToggleProps) {
  const [checked, setChecked] = useState(enabled)
  const [loading, setLoading] = useState(false)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    setChecked(enabled)
    return () => {
      mountedRef.current = false
    }
  }, [enabled])

  // 🔄 Realtime listener
  useEffect(() => {
    const channel = supabase
      .channel(`integration-status-${id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "integrations",
          filter: `slug=eq.${id}`, // use slug not id (since your toggle uses slugs)
        },
        (payload) => {
          const newValue =
            typeof payload.new.enabled === "boolean"
              ? payload.new.enabled
              : payload.new.status === "connected"

          if (mountedRef.current) {
            setChecked(newValue)
            onChange?.(newValue)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [id, onChange])

  const toggle = async (value: boolean) => {
    setChecked(value)
    setLoading(true)

    try {
      const res = await fetch(`/api/integrations/${id}/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: value }),
      })

      if (!res.ok) throw new Error("Failed to update toggle")

      const json = await res.json()
      if (json.success === false) throw new Error(json.error || "Unknown server error")
    } catch (err) {
      console.error("Toggle error:", err)
      if (mountedRef.current) {
        setChecked((prev) => !prev) // revert toggle
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false)
      }
    }
  }

  return <Switch checked={checked} onCheckedChange={toggle} disabled={loading} />
}
