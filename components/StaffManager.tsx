"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface Staff {
  id: string
  name: string
  email: string
  role: string
  created_at: string
}

export default function StaffManager() {
  const { toast } = useToast()
  const [staff, setStaff] = useState<Staff[]>([])
  const [form, setForm] = useState({ name: "", email: "", role: "" })
  const [loading, setLoading] = useState(false)

  const fetchStaff = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/staff")
      if (!res.ok) throw new Error("Failed to fetch staff")
      const data = await res.json()
      setStaff(data)
    } catch (error) {
      console.error("Fetch staff error:", error)
      toast({ title: "Error", description: "Failed to load staff" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStaff()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setForm((prev) => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Request failed")
      const newStaff: Staff = await res.json()
      setStaff((prev) => [...prev, newStaff])
      setForm({ name: "", email: "", role: "" })
      toast({ title: "Staff added" })
    } catch (error) {
      console.error("Add staff error:", error)
      toast({ title: "Error", description: "Failed to add staff" })
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="role">Role</Label>
          <Input id="role" value={form.role} onChange={handleChange} />
        </div>
        <div className="flex items-end">
          <Button type="submit">Add Staff</Button>
        </div>
      </form>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {staff.map((member) => (
            <TableRow key={member.id}>
              <TableCell>{member.name}</TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>{member.role}</TableCell>
              <TableCell>
                {new Date(member.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
          {staff.length === 0 && !loading && (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No staff found
              </TableCell>
            </TableRow>
          )}
          {loading && (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

