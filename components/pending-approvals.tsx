"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"

interface PendingApprovalsProps {
  teachers: any[]
}

export function PendingApprovals({ teachers }: PendingApprovalsProps) {
  const [approving, setApproving] = useState<string | null>(null)
  const [rejecting, setRejecting] = useState<string | null>(null)
  const router = useRouter()

  const handleApprove = async (teacherId: string) => {
    setApproving(teacherId)
    try {
      const response = await fetch("/api/admin/approve-teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacherId }),
      })

      if (!response.ok) throw new Error("Failed to approve")
      router.refresh()
    } catch (error) {
      console.error("[v0] Error approving teacher:", error)
      alert("Failed to approve teacher")
    } finally {
      setApproving(null)
    }
  }

  const handleReject = async (teacherId: string) => {
    setRejecting(teacherId)
    try {
      const response = await fetch("/api/admin/reject-teacher", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teacherId }),
      })

      if (!response.ok) throw new Error("Failed to reject")
      router.refresh()
    } catch (error) {
      console.error("[v0] Error rejecting teacher:", error)
      alert("Failed to reject teacher")
    } finally {
      setRejecting(null)
    }
  }

  if (!teachers || teachers.length === 0) {
    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Pending Teacher Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">No pending approvals</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Pending Teacher Approvals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {teachers.map((teacher) => (
            <div key={teacher.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>{teacher.users?.first_name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">
                    {teacher.users?.first_name} {teacher.users?.last_name}
                  </p>
                  <p className="text-sm text-muted-foreground">{teacher.users?.email}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleReject(teacher.id)}
                  disabled={rejecting === teacher.id || approving === teacher.id}
                >
                  {rejecting === teacher.id ? "Rejecting..." : "Reject"}
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleApprove(teacher.id)}
                  disabled={approving === teacher.id || rejecting === teacher.id}
                >
                  {approving === teacher.id ? "Approving..." : "Approve"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
