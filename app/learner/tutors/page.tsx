import { redirect } from "next/navigation"
import { createClient } from "@/lib/server"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Award } from "lucide-react"
import { Input } from "@/components/ui/input"

export default async function BrowseTutorsPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: userProfile } = await supabase.from("users").select("*").eq("id", user.id).single()
  const { data: teachers } = await supabase
    .from("teachers")
    .select("*, users(first_name, last_name, email)")
    .eq("is_verified", true)

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={userProfile} />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Browse Tutors</h1>
            <p className="text-muted-foreground">Find and book lessons with verified math tutors</p>
          </div>

          {/* Search */}
          <div className="flex gap-2">
            <Input placeholder="Search tutors by name or specialty..." className="flex-1" />
            <Button>Search</Button>
          </div>

          {/* Tutors Grid */}
          {!teachers || teachers.length === 0 ? (
            <Card className="border-border">
              <CardContent className="pt-6">
                <p className="text-muted-foreground text-center py-8">No verified tutors available yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teachers.map((tutor) => (
                <Card key={tutor.id} className="border-border flex flex-col">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>
                          {tutor.users?.first_name} {tutor.users?.last_name}
                        </CardTitle>
                        <CardDescription>{tutor.bio_extended || "Math Tutor"}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{tutor.rating || 0}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">({tutor.total_reviews || 0} reviews)</span>
                    </div>

                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        {tutor.years_experience || 0} years experience
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border">
                      <p className="text-lg font-bold">${tutor.hourly_rate || 0}/hour</p>
                    </div>

                    <Button className="w-full">Book Demo Lesson</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
