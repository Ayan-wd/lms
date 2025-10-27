import { createClient } from "@/lib/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { sessionId } = await request.json()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Generate ephemeral link (expires in 24 hours)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    const sessionLink = `${process.env.NEXT_PUBLIC_APP_URL}/classroom/${sessionId}?token=${Buffer.from(user.id).toString("base64")}`

    // Update session with link
    const { error } = await supabase
      .from("classroom_sessions")
      .update({
        session_link: sessionLink,
        session_link_expires_at: expiresAt,
      })
      .eq("id", sessionId)

    if (error) throw error

    return NextResponse.json({ sessionLink, expiresAt })
  } catch (error) {
    console.error("Error generating classroom link:", error)
    return NextResponse.json({ error: "Failed to generate link" }, { status: 500 })
  }
}
