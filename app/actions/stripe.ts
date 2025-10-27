"use server"

import { stripe } from "@/lib/stripe"
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export async function startCheckoutSession(teacherId: string, packageId: string, hiredId: string) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        },
      },
    },
  )

  // Get teacher's hourly rate
  const { data: teacher, error: teacherError } = await supabase
    .from("teachers")
    .select("hourly_rate")
    .eq("id", teacherId)
    .single()

  if (teacherError || !teacher) {
    throw new Error("Teacher not found")
  }

  // Calculate price based on package hours and teacher's rate
  const packageHours = packageId === "starter-5h" ? 5 : packageId === "standard-10h" ? 10 : 20
  const totalPriceInCents = Math.round(teacher.hourly_rate * packageHours * 100)

  // Create Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    redirect_on_completion: "never",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: `${packageHours} Hours of Tutoring`,
            description: `Tutoring sessions with your selected teacher`,
          },
          unit_amount: totalPriceInCents,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    metadata: {
      hired_id: hiredId,
      package_id: packageId,
      hours: packageHours.toString(),
    },
  })

  return session.client_secret
}

export async function verifyPaymentStatus(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  return session.payment_status === "paid"
}
