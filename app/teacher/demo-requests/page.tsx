"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function TeacherDemoRequestsPage() {
  const [demoRequests, setDemoRequests] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDemoRequests = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data: teacher } = await supabase.from("teachers").select("id").eq("id", user.id).single()

      if (teacher) {
        const { data } = await supabase
          .from("demo_requests")
          .select("*")
          .eq("teacher_id", teacher.id)
          .order("created_at", { ascending: false })

        setDemoRequests(data || [])
      }

      setIsLoading(false)
    }

    fetchDemoRequests()
  }, [])

  const handleAccept = async (requestId: string) => {
    const supabase = createClient()
    await supabase.from("demo_requests").update({ status: "accepted" }).eq("id", requestId)

    setDemoRequests(demoRequests.map((r) => (r.id === requestId ? { ...r, status: "accepted" } : r)))
  }

  const handleReject = async (requestId: string) => {
    const supabase = createClient()
    await supabase.from("demo_requests").update({ status: "rejected" }).eq("id", requestId)

    setDemoRequests(demoRequests.map((r) => (r.id === requestId ? { ...r, status: "rejected" } : r)))
  }

  if (isLoading) return <div className="text-center py-8">Loading...</div>

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Demo Lesson Requests</h1>

        {demoRequests.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No demo requests yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {demoRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold mb-2">Demo Request</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Requested: {new Date(request.requested_date).toLocaleString()}
                      </p>
                      <p className="text-sm text-muted-foreground mb-2">
                        Preferred: {new Date(request.scheduled_date).toLocaleString()}
                      </p>
                      {request.notes && <p className="text-sm mb-2">{request.notes}</p>}
                    </div>
                    <Badge>{request.status}</Badge>
                  </div>

                  {request.status === "pending" && (
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleAccept(request.id)}>
                        Accept
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleReject(request.id)}>
                        Reject
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
