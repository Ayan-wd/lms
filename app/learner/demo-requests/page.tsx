"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default function DemoRequestsPage() {
  const [demoRequests, setDemoRequests] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDemoRequests = async () => {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data: learner } = await supabase.from("learners").select("id").eq("id", user.id).single()

      if (learner) {
        const { data } = await supabase
          .from("demo_requests")
          .select("*")
          .eq("learner_id", learner.id)
          .order("created_at", { ascending: false })

        setDemoRequests(data || [])
      }

      setIsLoading(false)
    }

    fetchDemoRequests()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "accepted":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) return <div className="text-center py-8">Loading...</div>

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Demo Requests</h1>
          <Link href="/learner/demo-request">
            <Button>Request New Demo</Button>
          </Link>
        </div>

        {demoRequests.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No demo requests yet</p>
              <Link href="/learner/demo-request">
                <Button>Request Your First Demo</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {demoRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold mb-2">Demo Lesson Request</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Scheduled: {new Date(request.scheduled_date).toLocaleString()}
                      </p>
                      {request.notes && <p className="text-sm mb-2">{request.notes}</p>}
                    </div>
                    <Badge className={getStatusColor(request.status)}>{request.status}</Badge>
                  </div>
                  {request.status === "accepted" && (
                    <Button className="mt-4" size="sm">
                      Join Demo
                    </Button>
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
