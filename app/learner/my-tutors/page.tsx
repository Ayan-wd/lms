"use client"

import { useEffect, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, MessageSquare } from "lucide-react"

export default function MyTutorsPage() {
  const [hiredTeachers, setHiredTeachers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    const fetchHiredTeachers = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
          .from("hired")
          .select(
            `
            *,
            teacher:teacher_id(*, users(first_name, last_name, profile_image_url, bio))
          `,
          )
          .eq("learner_id", user.id)
          .eq("status", "active")

        if (error) throw error
        setHiredTeachers(data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchHiredTeachers()
  }, [supabase])

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
        <h1 className="text-3xl font-bold mb-6">My Tutors</h1>

        {hiredTeachers.length === 0 ? (
          <Card className="p-6">
            <p className="text-muted-foreground">
              You haven't hired any tutors yet.{" "}
              <a href="/learner/dashboard" className="text-primary hover:underline">
                Browse tutors
              </a>
            </p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hiredTeachers.map((hire) => (
              <Card key={hire.id} className="p-6">
                <div className="flex gap-4 mb-4">
                  {hire.teacher.users.profile_image_url && (
                    <img
                      src={hire.teacher.users.profile_image_url || "/placeholder.svg"}
                      alt={hire.teacher.users.first_name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold">
                      {hire.teacher.users.first_name} {hire.teacher.users.last_name}
                    </h3>
                    <Badge variant="secondary">${hire.hourly_rate}/hour</Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{hire.teacher.users.bio}</p>
                <div className="space-y-2 mb-4">
                  <p className="text-sm">
                    <span className="font-medium">Hours Completed:</span> {hire.total_hours_completed}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Total Paid:</span> ${hire.total_amount_paid.toFixed(2)}
                  </p>
                </div>
                <Button className="w-full bg-transparent" variant="outline">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Message
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
