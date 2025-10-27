"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { startCheckoutSession } from "@/app/actions/stripe"
import { createBrowserClient } from "@supabase/ssr"
import { Loader2 } from "lucide-react"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function PaymentPage({
  params,
}: {
  params: { hiredId: string }
}) {
  const searchParams = useSearchParams()
  const packageId = searchParams.get("package") || "starter-5h"
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [teacherId, setTeacherId] = useState<string | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    const initializeCheckout = async () => {
      try {
        // Get hired record to find teacher
        const { data: hired, error: hiredError } = await supabase
          .from("hired")
          .select("teacher_id")
          .eq("id", params.hiredId)
          .single()

        if (hiredError) throw hiredError
        setTeacherId(hired.teacher_id)

        // Start checkout session
        const secret = await startCheckoutSession(hired.teacher_id, packageId, params.hiredId)
        setClientSecret(secret)
      } catch (err) {
        setError("Failed to initialize payment")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    initializeCheckout()
  }, [params.hiredId, packageId, supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Complete Payment</h1>
        {clientSecret && (
          <EmbeddedCheckoutProvider stripe={stripePromise} options={{ clientSecret }}>
            <EmbeddedCheckout />
          </EmbeddedCheckoutProvider>
        )}
      </div>
    </div>
  )
}
