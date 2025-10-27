"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"

export default function PaymentSuccessPage({
  params,
}: {
  params: { hiredId: string }
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleContinue = () => {
    setLoading(true)
    router.push("/learner/dashboard")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="max-w-md w-full p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-muted-foreground mb-6">
          Your tutoring sessions have been booked. You can now start learning!
        </p>
        <Button onClick={handleContinue} disabled={loading} className="w-full" size="lg">
          {loading ? "Redirecting..." : "Go to Dashboard"}
        </Button>
      </Card>
    </div>
  )
}
