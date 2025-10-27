"use client"

import { useEffect, useState } from "react"
import { redirect } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

export default function TeacherProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [teacher, setTeacher] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    bio: "",
    hourly_rate: "",
    years_experience: "",
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser()
        if (!authUser) redirect("/auth/login")

        const { data: userData } = await supabase.from("users").select("*").eq("id", authUser.id).single()

        const { data: teacherData } = await supabase.from("teachers").select("*").eq("id", authUser.id).single()

        setUser(userData)
        setTeacher(teacherData)
        setFormData({
          first_name: userData?.first_name || "",
          last_name: userData?.last_name || "",
          bio: userData?.bio || "",
          hourly_rate: teacherData?.hourly_rate || "",
          years_experience: teacherData?.years_experience || "",
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [supabase])

  const handleSave = async () => {
    try {
      setSaving(true)
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      await supabase
        .from("users")
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          bio: formData.bio,
        })
        .eq("id", authUser?.id)

      await supabase
        .from("teachers")
        .update({
          hourly_rate: Number.parseFloat(formData.hourly_rate),
          years_experience: Number.parseInt(formData.years_experience),
        })
        .eq("id", authUser?.id)

      alert("Profile updated successfully!")
    } catch (err) {
      console.error(err)
      alert("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>

        <Card className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">First Name</label>
              <Input
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Last Name</label>
              <Input
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Bio</label>
            <textarea
              className="w-full px-3 py-2 border border-input rounded-md"
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell students about yourself"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Hourly Rate ($)</label>
              <Input
                type="number"
                step="0.01"
                value={formData.hourly_rate}
                onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Years of Experience</label>
              <Input
                type="number"
                value={formData.years_experience}
                onChange={(e) => setFormData({ ...formData, years_experience: e.target.value })}
              />
            </div>
          </div>

          <Button onClick={handleSave} disabled={saving} className="w-full">
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </Card>
      </div>
    </div>
  )
}
