"use client"

import { useEffect, useState } from "react"
import { Switch } from "@/components/ui/switch"
import { supabase } from "@/lib/supabase"

interface IntegrationStatusToggleProps {
  id: string
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

  useEffect(() => {
    setChecked(enabled)
  }, [enabled])

  useEffect(() => {
    const channel = supabase
      .channel(`integration-status-${id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "integrations", filter: `id=eq.${id}` },
        (payload) => {
          const next =
            typeof payload.new.enabled === "boolean"
              ? payload.new.enabled
              : payload.new.status
          setChecked(next)
          onChange?.(next)
        },
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
      if (!res.ok) throw new Error("Failed to update")
      const data = await res.json().catch(() => null)
      if (data && data.success === false) throw new Error(data.error)
    } catch (err) {
      console.error("Toggle error:", err)
      setChecked((prev) => !prev)
    } finally {
      setLoading(false)
    }
  }

  return <Switch checked={checked} onCheckedChange={toggle} disabled={loading} />
}
