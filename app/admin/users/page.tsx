import { redirect } from "next/navigation"
import { createClient } from "@/lib/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default async function AdminUsers() {
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">User Management</h1>
            <p className="text-muted-foreground">Manage all platform users</p>
          </div>

          {/* Search */}
          <div className="flex gap-2">
            <Input placeholder="Search users..." className="flex-1" />
            <Button>Search</Button>
          </div>

          {/* Users Table */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>All Users</CardTitle>
              <CardDescription>Total users: {allUsers?.length || 0}</CardDescription>
            </CardHeader>
            <CardContent>
              {!allUsers || allUsers.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No users found</p>
              ) : (
                <div className="space-y-4">
                  {allUsers.map((u) => (
                    <div key={u.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-4">
                        <Avatar>
                          <AvatarFallback>{u.first_name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">
                            {u.first_name} {u.last_name}
                          </p>
                          <p className="text-sm text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium capitalize">{u.user_type}</span>
                        <Button size="sm" variant="outline">
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
