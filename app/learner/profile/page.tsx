"use client"

import { useEffect, useState, useRef } from "react"
import { redirect } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"

export default function LearnerProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [learner, setLearner] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    grade_level: "",
    learning_goals: "",
    preferred_learning_style: "",
  })

  const supabaseRef = useRef<any | null>(null)

  useEffect(() => {
    supabaseRef.current = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    )

    const fetchProfile = async () => {
      try {
        const supabase = supabaseRef.current
        if (!supabase) return

        const {
          data: { user: authUser },
        } = await supabase.auth.getUser()
        if (!authUser) redirect("/auth/login")

        const { data: userData } = await supabase.from("users").select("*").eq("id", authUser.id).single()

        const { data: learnerData } = await supabase.from("learners").select("*").eq("id", authUser.id).single()

        setUser(userData)
        setLearner(learnerData)
        setFormData({
          first_name: userData?.first_name || "",
          last_name: userData?.last_name || "",
          grade_level: learnerData?.grade_level || "",
          learning_goals: learnerData?.learning_goals || "",
          preferred_learning_style: learnerData?.preferred_learning_style || "",
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSave = async () => {
    try {
      setSaving(true)
      const supabase = supabaseRef.current
      if (!supabase) throw new Error('Supabase client not initialized')

      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      await supabase
        .from("users")
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
        })
        .eq("id", authUser?.id)

      await supabase
        .from("learners")
        .update({
          grade_level: formData.grade_level,
          learning_goals: formData.learning_goals,
          preferred_learning_style: formData.preferred_learning_style,
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
            <label className="block text-sm font-medium mb-2">Grade Level</label>
            <Input
              value={formData.grade_level}
              onChange={(e) => setFormData({ ...formData, grade_level: e.target.value })}
              placeholder="e.g., 9th Grade, College"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Learning Goals</label>
            <textarea
              className="w-full px-3 py-2 border border-input rounded-md"
              rows={4}
              value={formData.learning_goals}
              onChange={(e) => setFormData({ ...formData, learning_goals: e.target.value })}
              placeholder="What do you want to achieve?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Preferred Learning Style</label>
            <Input
              value={formData.preferred_learning_style}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  preferred_learning_style: e.target.value,
                })
              }
              placeholder="e.g., Visual, Hands-on, Discussion-based"
            />
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
