import { createClient } from "@/lib/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const forwardedHost = request.headers.get("x-forwarded-host")
      const proto = request.headers.get("x-forwarded-proto")
      const host = forwardedHost || request.headers.get("host") || ""
      const redirectUrl = proto ? `${proto}://${host}${next}` : next
      return NextResponse.redirect(redirectUrl)
    }
  }

  return NextResponse.redirect(new URL("/auth/error", request.url))
}
