"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function DemoRequestPage() {
  const [teacherId, setTeacherId] = useState("")
  const [scheduledDate, setScheduledDate] = useState("")
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { data: learner } = await supabase.from("learners").select("id").eq("id", user.id).single()
      if (!learner) throw new Error("Learner profile not found")

      const { error: insertError } = await supabase.from("demo_requests").insert({
        learner_id: learner.id,
        teacher_id: teacherId,
        scheduled_date: scheduledDate,
        notes,
        status: "pending",
      })

      if (insertError) throw insertError

      router.push("/learner/demo-requests")
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to request demo")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Request a Demo Lesson</CardTitle>
            <CardDescription>Schedule a free demo lesson with a tutor to see if it's a good fit</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="teacher">Select a Tutor</Label>
                <Select value={teacherId} onValueChange={setTeacherId}>
                  <SelectTrigger id="teacher">
                    <SelectValue placeholder="Choose a tutor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="teacher-1">Dr. Sarah Chen - Algebra & Calculus</SelectItem>
                    <SelectItem value="teacher-2">Prof. James Wilson - Geometry & Physics</SelectItem>
                    <SelectItem value="teacher-3">Ms. Emily Brown - Statistics & Data</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Preferred Date & Time</Label>
                <Input
                  id="date"
                  type="datetime-local"
                  required
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Tell us about your learning goals</Label>
                <Textarea
                  id="notes"
                  placeholder="What topics would you like to focus on? Any specific challenges?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                />
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Requesting..." : "Request Demo Lesson"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
