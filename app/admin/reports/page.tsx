import { redirect } from "next/navigation"
import { createClient } from "@/lib/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

export default async function AdminReports() {
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

  const { data: payments } = await supabase.from("payments").select("*")

  // Generate monthly revenue data
  const monthlyData = [
    { month: "Jan", revenue: 4000, lessons: 24 },
    { month: "Feb", revenue: 3000, lessons: 13 },
    { month: "Mar", revenue: 2000, lessons: 9 },
    { month: "Apr", revenue: 2780, lessons: 39 },
    { month: "May", revenue: 1890, lessons: 23 },
    { month: "Jun", revenue: 2390, lessons: 34 },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Reports</h1>
            <p className="text-muted-foreground">View platform analytics and reports</p>
          </div>

          {/* Revenue Chart */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
              <CardDescription>Platform revenue over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="revenue" fill="#3b82f6" />
                  <Bar dataKey="lessons" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Export Options */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Export Data</CardTitle>
              <CardDescription>Download reports in various formats</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full">Export User Data (CSV)</Button>
              <Button className="w-full bg-transparent" variant="outline">
                Export Payment Data (CSV)
              </Button>
              <Button className="w-full bg-transparent" variant="outline">
                Export Lesson Data (CSV)
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
