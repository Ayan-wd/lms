import { redirect } from "next/navigation"
import { createClient } from "@/lib/server"
import { TeacherHeader } from "@/components/teacher-header"
import { TeacherOverview } from "@/components/teacher-overview"
import { MyStudents } from "@/components/my-students"
import { UpcomingClasses } from "@/components/upcoming-classes"
import { EarningsCard } from "@/components/earnings-card"

export default async function TeacherDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: userProfile } = await supabase.from("users").select("*").eq("id", user.id).single()

  const { data: teacherData } = await supabase.from("teachers").select("*").eq("id", user.id).single()

  const { data: hiredRecords } = await supabase.from("hired").select("*").eq("teacher_id", user.id)

  const { data: upcomingSessions } = await supabase
    .from("classroom_sessions")
    .select("*, hired(learner_id, learners(first_name, last_name))")
    .eq("teacher_id", user.id)
    .gte("scheduled_time", new Date().toISOString())
    .order("scheduled_time", { ascending: true })
    .limit(5)

  const { data: payments } = await supabase
    .from("payments")
    .select("*")
    .eq("teacher_id", user.id)
    .gte("created_at", new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString())

  return (
    <div className="min-h-screen bg-background">
      <TeacherHeader user={userProfile} />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <TeacherOverview teacher={teacherData} hiredCount={hiredRecords?.length || 0} payments={payments || []} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <UpcomingClasses sessions={upcomingSessions || []} />
          </div>
          <div>
            <EarningsCard payments={payments || []} />
          </div>
        </div>
        <MyStudents teacherId={user.id} hiredRecords={hiredRecords || []} />
      </main>
    </div>
  )
}
