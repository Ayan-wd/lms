import { redirect } from "next/navigation"
import { createClient } from "@/lib/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardOverview } from "@/components/dashboard-overview"
import { EnrolledCourses } from "@/components/enrolled-courses"
import { UpcomingLessons } from "@/components/upcoming-lessons"
import { BrowseTutors } from "@/components/browse-tutors"

export default async function LearnerDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: userProfile } = await supabase.from("users").select("*").eq("id", user.id).single()

  const { data: learnerData } = await supabase.from("learners").select("*").eq("id", user.id).single()

  const { data: hiredRecords } = await supabase
    .from("hired")
    .select("*, teachers(first_name, last_name, hourly_rate, rating)")
    .eq("learner_id", user.id)

  const { data: upcomingSessions } = await supabase
    .from("classroom_sessions")
    .select("*, hired(teachers(first_name, last_name))")
    .eq("learner_id", user.id)
    .gte("scheduled_time", new Date().toISOString())
    .order("scheduled_time", { ascending: true })
    .limit(5)

  const { data: allTeachers } = await supabase
    .from("teachers")
    .select("*, users(first_name, last_name, email)")
    .eq("is_verified", true)
    .limit(6)

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={userProfile} />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <DashboardOverview learner={learnerData} hiredCount={hiredRecords?.length || 0} />
        <UpcomingLessons sessions={upcomingSessions || []} />
        <EnrolledCourses hiredRecords={hiredRecords || []} />
        <BrowseTutors teachers={allTeachers || []} />
      </main>
    </div>
  )
}
