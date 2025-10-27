import { redirect } from "next/navigation"
import { createClient } from "@/lib/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User } from "lucide-react"

export default async function MyLessonsPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: userProfile } = await supabase.from("users").select("*").eq("id", user.id).single()
  const { data: sessions } = await supabase
    .from("classroom_sessions")
    .select("*, hired(teachers(first_name, last_name))")
    .eq("learner_id", user.id)
    .order("scheduled_time", { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={userProfile} />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">My Lessons</h1>
            <p className="text-muted-foreground">View all your lessons and session history</p>
          </div>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>All Lessons</CardTitle>
              <CardDescription>Total: {sessions?.length || 0}</CardDescription>
            </CardHeader>
            <CardContent>
              {!sessions || sessions.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No lessons yet. Book a demo to get started!</p>
              ) : (
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div key={session.id} className="p-4 border border-border rounded-lg space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">{session.topic || "Math Lesson"}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                            <User className="w-4 h-4" />
                            {session.hired?.teachers?.first_name} {session.hired?.teachers?.last_name}
                          </p>
                        </div>
                        <span className="text-sm font-medium capitalize px-3 py-1 rounded-full bg-primary/10 text-primary">
                          {session.status}
                        </span>
                      </div>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(session.scheduled_time).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {new Date(session.scheduled_time).toLocaleTimeString()}
                        </span>
                      </div>
                      {session.status === "scheduled" && <Button size="sm">Join Lesson</Button>}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
