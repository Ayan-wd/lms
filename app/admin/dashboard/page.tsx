import { redirect } from "next/navigation"
import { createClient } from "@/lib/server"
import { AdminHeader } from "@/components/admin-header"
import { AdminStats } from "@/components/admin-stats"
import { PendingApprovals } from "@/components/pending-approvals"
import { UserManagement } from "@/components/user-management"

export default async function AdminDashboard() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: userProfile } = await supabase.from("users").select("*").eq("id", user.id).single()

  if (userProfile?.user_type !== "admin") {
    redirect("/")
  }

  const { data: allUsers } = await supabase.from("users").select("*")
  const { data: allLessons } = await supabase.from("classroom_sessions").select("*")
  const { data: allPayments } = await supabase.from("payments").select("*")
  const { data: pendingTeachers } = await supabase
    .from("teachers")
    .select("*, users(first_name, last_name, email)")
    .eq("is_verified", false)

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader user={userProfile} />

      <main className="container mx-auto px-4 py-8 space-y-8">
        <AdminStats users={allUsers || []} lessons={allLessons || []} payments={allPayments || []} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <PendingApprovals teachers={pendingTeachers || []} />
          </div>
          <div>
            <UserManagement />
          </div>
        </div>
      </main>
    </div>
  )
}
