import { createClient } from "@/lib/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { teacherId } = await request.json()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { error } = await supabase.from("hired").insert({
      learner_id: user.id,
      teacher_id: teacherId,
      status: "active",
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error creating hire record:", error)
    return NextResponse.json({ error: "Failed to hire tutor" }, { status: 500 })
  }
}
