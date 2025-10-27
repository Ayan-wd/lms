import { createClient } from "@/lib/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { firstName, lastName, hourlyRate, bio, userType } = await request.json()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Update user profile
    const { error: userError } = await supabase
      .from("users")
      .update({ first_name: firstName, last_name: lastName })
      .eq("id", user.id)

    if (userError) throw userError

    // Update teacher profile if applicable
    if (userType === "teacher" && hourlyRate !== undefined) {
      const { error: teacherError } = await supabase
        .from("teachers")
        .update({ hourly_rate: hourlyRate, bio_extended: bio })
        .eq("id", user.id)

      if (teacherError) throw teacherError
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error updating profile:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}
