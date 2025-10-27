import { stripe } from "@/lib/stripe"
import { createClient } from "@/lib/server"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY

// For development/build time checks
if (!STRIPE_WEBHOOK_SECRET || !STRIPE_SECRET_KEY) {
  console.warn('⚠️ Stripe configuration missing. Webhook endpoints will return 503 in production.')
}

export async function POST(request: Request) {
  // Return 503 Service Unavailable if Stripe is not configured
  if (process.env.NODE_ENV === 'production' && (!STRIPE_WEBHOOK_SECRET || !STRIPE_SECRET_KEY)) {
    return NextResponse.json(
      { error: 'Stripe configuration missing' },
      { status: 503 }
    )
  }
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 })
  }

  let event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error("Webhook signature verification failed:", err)
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
  }

  const supabase = await createClient()

  // Handle checkout session completed
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any

    if (session.payment_status === "paid") {
      const hiredId = session.metadata?.hired_id
      const packageId = session.metadata?.package_id
      const hours = Number.parseInt(session.metadata?.hours || "0")

      if (hiredId) {
        // Create payment record
        const { data: hired } = await supabase
          .from("hired")
          .select("learner_id, teacher_id, hourly_rate")
          .eq("id", hiredId)
          .single()

        if (hired) {
          const amount = Number.parseFloat(session.amount_total) / 100

          await supabase.from("payments").insert({
            hired_id: hiredId,
            learner_id: hired.learner_id,
            teacher_id: hired.teacher_id,
            amount,
            hours_worked: hours,
            status: "completed",
            stripe_payment_id: session.payment_intent,
            payment_date: new Date().toISOString(),
          })

          // Update hired record with total amount paid
          await supabase
            .from("hired")
            .update({
              total_amount_paid: hired.hourly_rate * hours,
              total_hours_completed: hours,
            })
            .eq("id", hiredId)
        }
      }
    }
  }

  return NextResponse.json({ received: true })
}
