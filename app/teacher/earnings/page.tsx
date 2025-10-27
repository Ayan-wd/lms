import { redirect } from "next/navigation"
import { createClient } from "@/lib/server"
import { TeacherHeader } from "@/components/teacher-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, TrendingUp } from "lucide-react"

export default async function EarningsPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: userProfile } = await supabase.from("users").select("*").eq("id", user.id).single()
  const { data: payments } = await supabase.from("payments").select("*").eq("teacher_id", user.id)

  const totalEarnings = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0
  const monthlyEarnings =
    payments
      ?.filter((p) => {
        const paymentDate = new Date(p.created_at)
        const now = new Date()
        return paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear()
      })
      .reduce((sum, p) => sum + (p.amount || 0), 0) || 0

  return (
    <div className="min-h-screen bg-background">
      <TeacherHeader user={userProfile} />

      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold">Earnings</h1>
            <p className="text-muted-foreground">Track your income and payments</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Earnings</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="text-3xl font-bold">${totalEarnings.toFixed(2)}</div>
                <DollarSign className="w-8 h-8 text-green-500 opacity-20" />
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="text-3xl font-bold">${monthlyEarnings.toFixed(2)}</div>
                <TrendingUp className="w-8 h-8 text-blue-500 opacity-20" />
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Transactions</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div className="text-3xl font-bold">{payments?.length || 0}</div>
                <DollarSign className="w-8 h-8 text-purple-500 opacity-20" />
              </CardContent>
            </Card>
          </div>

          {/* Payment History */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>All your payments and transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {!payments || payments.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No payments yet</p>
              ) : (
                <div className="space-y-4">
                  {payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div>
                        <p className="font-semibold">{payment.status}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(payment.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${payment.amount?.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground capitalize">{payment.payment_method}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Button size="lg">Withdraw Earnings</Button>
        </div>
      </main>
    </div>
  )
}
