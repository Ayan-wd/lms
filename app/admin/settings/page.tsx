import { redirect } from "next/navigation"
import { createClient } from "@/lib/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default async function AdminSettings() {
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-bold mb-8">System Settings</h1>

          <div className="space-y-6">
            {/* Platform Settings */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Platform Configuration</CardTitle>
                <CardDescription>Configure platform-wide settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="platformName">Platform Name</Label>
                  <Input id="platformName" defaultValue="House of Mathematics" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commissionRate">Commission Rate (%)</Label>
                  <Input id="commissionRate" type="number" defaultValue="10" />
                </div>
                <Button>Save Settings</Button>
              </CardContent>
            </Card>

            {/* Email Settings */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Email Configuration</CardTitle>
                <CardDescription>Configure email notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="senderEmail">Sender Email</Label>
                  <Input id="senderEmail" type="email" defaultValue="noreply@houseofmath.com" />
                </div>
                <Button>Test Email</Button>
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="border-border">
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Manage security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Two-Factor Authentication</Label>
                  <input type="checkbox" />
                </div>
                <div className="flex items-center justify-between">
                  <Label>IP Whitelist</Label>
                  <input type="checkbox" />
                </div>
                <Button>Save Settings</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
