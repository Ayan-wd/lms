import { redirect } from "next/navigation"
import { createClient } from "@/lib/server"
import { TeacherHeader } from "@/components/teacher-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock } from "lucide-react"

export default async function SchedulePage() {
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
    .select("*, hired(learners(first_name, last_name))")
    .eq("teacher_id", user.id)
    .order("scheduled_time", { ascending: true })

  return (
    <div className="min-h-screen bg-background">
      <TeacherHeader user={userProfile} />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Schedule</h1>
            <p className="text-muted-foreground">View and manage your teaching schedule</p>
          </div>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Upcoming Classes</CardTitle>
              <CardDescription>Total: {sessions?.length || 0}</CardDescription>
            </CardHeader>
            <CardContent>
              {!sessions || sessions.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No scheduled classes</p>
              ) : (
                <div className="space-y-4">
                  {sessions.map((session) => (
                    <div key={session.id} className="p-4 border border-border rounded-lg space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold">
                            {session.hired?.learners?.first_name} {session.hired?.learners?.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">{session.topic || "Math Lesson"}</p>
                        </div>
                        <span className="text-sm font-medium capitalize px-3 py-1 rounded-full bg-primary/10 text-primary">
                          {session.status}
                        </span>
                      </div>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(session.scheduled_time).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {new Date(session.scheduled_time).toLocaleTimeString()}
                        </div>
                      </div>
                      <Button size="sm">Join Class</Button>
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
