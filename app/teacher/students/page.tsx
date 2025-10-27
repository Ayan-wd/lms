import { redirect } from "next/navigation"
import { createClient } from "@/lib/server"
import { TeacherHeader } from "@/components/teacher-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

export default async function MyStudentsPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: userProfile } = await supabase.from("users").select("*").eq("id", user.id).single()
  const { data: hiredRecords } = await supabase
    .from("hired")
    .select("*, learners(first_name, last_name, email)")
    .eq("teacher_id", user.id)

  return (
    <div className="min-h-screen bg-background">
      <TeacherHeader user={userProfile} />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">My Students</h1>
            <p className="text-muted-foreground">Manage your students and track their progress</p>
          </div>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Active Students</CardTitle>
              <CardDescription>Total: {hiredRecords?.length || 0}</CardDescription>
            </CardHeader>
            <CardContent>
              {!hiredRecords || hiredRecords.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No students yet</p>
              ) : (
                <div className="space-y-4">
                  {hiredRecords.map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>{record.learners?.first_name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">
                            {record.learners?.first_name} {record.learners?.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">{record.learners?.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-semibold capitalize">{record.status}</p>
                          <p className="text-xs text-muted-foreground">
                            Since {new Date(record.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Button size="sm">View Progress</Button>
                      </div>
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
