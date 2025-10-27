import { redirect } from "next/navigation"
import { createClient } from "@/lib/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default async function LearnerSettings() {
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold mb-8">Settings</h1>

          <div className="space-y-6">
            {/* Profile Settings */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your profile details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue={userProfile?.first_name || ""} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue={userProfile?.last_name || ""} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={userProfile?.email || ""} disabled />
                </div>
                <Button>Save Changes</Button>
              </CardContent>
            </Card>

            {/* Learning Preferences */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Learning Preferences</CardTitle>
                <CardDescription>Customize your learning experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="gradeLevel">Grade Level</Label>
                  <Select defaultValue={learnerData?.grade_level || ""}>
                    <SelectTrigger id="gradeLevel">
                      <SelectValue placeholder="Select grade level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="elementary">Elementary</SelectItem>
                      <SelectItem value="middle">Middle School</SelectItem>
                      <SelectItem value="high">High School</SelectItem>
                      <SelectItem value="college">College</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="learningStyle">Preferred Learning Style</Label>
                  <Select defaultValue={learnerData?.preferred_learning_style || ""}>
                    <SelectTrigger id="learningStyle">
                      <SelectValue placeholder="Select learning style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="visual">Visual</SelectItem>
                      <SelectItem value="auditory">Auditory</SelectItem>
                      <SelectItem value="kinesthetic">Kinesthetic</SelectItem>
                      <SelectItem value="reading">Reading/Writing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button>Save Preferences</Button>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Manage your notification preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Email Notifications</Label>
                  <input type="checkbox" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Lesson Reminders</Label>
                  <input type="checkbox" defaultChecked />
                </div>
                <Button>Save Preferences</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
