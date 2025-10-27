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

    const { data: admin } = await supabase.from("users").select("*").eq("id", user.id).single()
    if (admin?.user_type !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { error } = await supabase
      .from("teachers")
      .update({ is_verified: true, verification_date: new Date().toISOString() })
      .eq("id", teacherId)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error approving teacher:", error)
    return NextResponse.json({ error: "Failed to approve teacher" }, { status: 500 })
  }
}
