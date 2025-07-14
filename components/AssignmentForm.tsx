"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function AssignmentForm() {
  const { toast } = useToast()
  const [form, setForm] = useState({ staff_id: "", shift_id: "", status: "" })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setForm((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Request failed")
      setForm({ staff_id: "", shift_id: "", status: "" })
      toast({ title: "Assignment created" })
    } catch (error) {
      console.error("Add assignment error:", error)
      toast({ title: "Error", description: "Failed to create assignment" })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="staff_id">Staff ID</Label>
        <Input id="staff_id" value={form.staff_id} onChange={handleChange} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="shift_id">Shift ID</Label>
        <Input id="shift_id" value={form.shift_id} onChange={handleChange} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="status">Status</Label>
        <Input id="status" value={form.status} onChange={handleChange} />
      </div>
      <Button type="submit">Add Assignment</Button>
    </form>
  )
}
