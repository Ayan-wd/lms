import { createClient } from "@/lib/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { teacherId, preferredDate, preferredTime, topic } = await request.json()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { error } = await supabase.from("demo_requests").insert({
      learner_id: user.id,
      teacher_id: teacherId,
      preferred_date: preferredDate,
      preferred_time: preferredTime,
      topic: topic,
      status: "pending",
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error creating demo request:", error)
    return NextResponse.json({ error: "Failed to create demo request" }, { status: 500 })
  }
}
