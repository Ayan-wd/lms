"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

export default function ApprovalsPage() {
  const [pendingTeachers, setPendingTeachers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [approving, setApproving] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    const fetchPendingTeachers = async () => {
      try {
        const { data, error } = await supabase
          .from("teachers")
          .select("*, users(first_name, last_name, email, bio)")
          .eq("is_verified", false)
          .order("created_at", { ascending: true })

        if (error) throw error
        setPendingTeachers(data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchPendingTeachers()
  }, [supabase])

  const handleApprove = async (teacherId: string) => {
    try {
      setApproving(teacherId)
      await supabase
        .from("teachers")
        .update({
          is_verified: true,
          verification_date: new Date().toISOString(),
        })
        .eq("id", teacherId)

      setPendingTeachers(pendingTeachers.filter((t) => t.id !== teacherId))
    } catch (err) {
      console.error(err)
      alert("Failed to approve teacher")
    } finally {
      setApproving(null)
    }
  }

  const handleReject = async (teacherId: string) => {
    try {
      setApproving(teacherId)
      // Delete teacher record
      await supabase.from("teachers").delete().eq("id", teacherId)

      setPendingTeachers(pendingTeachers.filter((t) => t.id !== teacherId))
    } catch (err) {
      console.error(err)
      alert("Failed to reject teacher")
    } finally {
      setApproving(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Teacher Approvals</h1>

        {pendingTeachers.length === 0 ? (
          <Card className="p-6">
            <p className="text-muted-foreground">No pending approvals</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {pendingTeachers.map((teacher) => (
              <Card key={teacher.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">
                      {teacher.users.first_name} {teacher.users.last_name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{teacher.users.email}</p>
                    <p className="text-sm mt-2">{teacher.users.bio}</p>
                    <div className="mt-4 flex gap-2">
                      <Badge variant="secondary">${teacher.hourly_rate}/hour</Badge>
                      <Badge variant="secondary">{teacher.years_experience} years experience</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApprove(teacher.id)}
                      disabled={approving === teacher.id}
                      variant="default"
                      size="sm"
                    >
                      {approving === teacher.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => handleReject(teacher.id)}
                      disabled={approving === teacher.id}
                      variant="destructive"
                      size="sm"
                    >
                      {approving === teacher.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
