"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function HireTeacherPage({
  params,
}: {
  params: { teacherId: string }
}) {
  const router = useRouter()
  const [teacher, setTeacher] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedPackage, setSelectedPackage] = useState<string>("starter-5h")

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const { data, error } = await supabase
          .from("teachers")
          .select("*, users(first_name, last_name, profile_image_url, bio)")
          .eq("id", params.teacherId)
          .single()

        if (error) throw error
        setTeacher(data)
      } catch (err) {
        setError("Failed to load teacher information")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchTeacher()
  }, [params.teacherId, supabase])

  const handleHireTeacher = async () => {
    try {
      setLoading(true)

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      // Create hired record
      const { data: hired, error: hiredError } = await supabase
        .from("hired")
        .insert({
          learner_id: user.id,
          teacher_id: params.teacherId,
          hourly_rate: teacher.hourly_rate,
          status: "active",
        })
        .select()
        .single()

      if (hiredError) throw hiredError

      // Redirect to payment page
      router.push(`/learner/payment/${hired.id}?package=${selectedPackage}`)
    } catch (err) {
      setError("Failed to hire teacher")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (error || !teacher) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6">
          <p className="text-red-600">{error || "Teacher not found"}</p>
        </Card>
      </div>
    )
  }

  const packages = [
    { id: "starter-5h", hours: 5, name: "Starter" },
    { id: "standard-10h", hours: 10, name: "Standard" },
    { id: "premium-20h", hours: 20, name: "Premium" },
  ]

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Hire {teacher.users.first_name}</h1>

        <Card className="p-6 mb-6">
          <div className="flex gap-4 mb-6">
            {teacher.users.profile_image_url && (
              <img
                src={teacher.users.profile_image_url || "/placeholder.svg"}
                alt={teacher.users.first_name}
                className="w-24 h-24 rounded-lg object-cover"
              />
            )}
            <div>
              <h2 className="text-xl font-semibold">
                {teacher.users.first_name} {teacher.users.last_name}
              </h2>
              <p className="text-muted-foreground">${teacher.hourly_rate}/hour</p>
              <p className="text-sm mt-2">{teacher.users.bio}</p>
              <p className="text-sm text-muted-foreground mt-2">
                {teacher.years_experience} years experience • Rating: {teacher.rating}/5
              </p>
            </div>
          </div>
        </Card>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Select Package</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {packages.map((pkg) => (
              <Card
                key={pkg.id}
                className={`p-4 cursor-pointer transition-all ${
                  selectedPackage === pkg.id ? "border-primary bg-primary/5" : "border-border"
                }`}
                onClick={() => setSelectedPackage(pkg.id)}
              >
                <h4 className="font-semibold">{pkg.name}</h4>
                <p className="text-2xl font-bold my-2">{pkg.hours}h</p>
                <p className="text-sm text-muted-foreground">${(teacher.hourly_rate * pkg.hours).toFixed(2)}</p>
              </Card>
            ))}
          </div>
        </div>

        <Button onClick={handleHireTeacher} disabled={loading} className="w-full" size="lg">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            "Continue to Payment"
          )}
        </Button>
      </div>
    </div>
  )
}
