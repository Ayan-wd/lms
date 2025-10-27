"use client"

import { useEffect, useState, useRef } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

export default function TeacherPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({
    totalEarnings: 0,
    pendingPayments: 0,
    completedPayments: 0,
  })

  const supabaseRef = useRef<any | null>(null)

  useEffect(() => {
    supabaseRef.current = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    )

    const fetchPayments = async () => {
      try {
        const supabase = supabaseRef.current
        if (!supabase) throw new Error("Not initialized")

        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) throw new Error("Not authenticated")

        // Fetch payments for this teacher
        const { data, error } = await supabase
          .from("payments")
          .select(
            `
            *,
            hired:hired_id(learner_id, kid_id),
            learner:learner_id(users(first_name, last_name))
          `,
          )
          .eq("teacher_id", user.id)
          .order("created_at", { ascending: false })

        if (error) throw error

        setPayments(data || [])

        // Calculate stats
  const totalEarnings = data?.reduce((sum: number, p: any) => (p.status === "completed" ? sum + p.amount : sum), 0) || 0
  const pendingPayments = data?.filter((p: any) => p.status === "pending").length || 0
  const completedPayments = data?.filter((p: any) => p.status === "completed").length || 0

        setStats({
          totalEarnings,
          pendingPayments,
          completedPayments,
        })
      } catch (err) {
        setError("Failed to load payments")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchPayments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Payment History</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-6">
            <p className="text-muted-foreground text-sm">Total Earnings</p>
            <p className="text-3xl font-bold">${stats.totalEarnings.toFixed(2)}</p>
          </Card>
          <Card className="p-6">
            <p className="text-muted-foreground text-sm">Pending Payments</p>
            <p className="text-3xl font-bold">{stats.pendingPayments}</p>
          </Card>
          <Card className="p-6">
            <p className="text-muted-foreground text-sm">Completed Payments</p>
            <p className="text-3xl font-bold">{stats.completedPayments}</p>
          </Card>
        </div>

        {/* Payments Table */}
        {error ? (
          <Card className="p-6">
            <p className="text-red-600">{error}</p>
          </Card>
        ) : payments.length === 0 ? (
          <Card className="p-6">
            <p className="text-muted-foreground">No payments yet</p>
          </Card>
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Learner</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Amount</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Hours</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id} className="border-t">
                      <td className="px-6 py-4">
                        {payment.learner?.users?.first_name} {payment.learner?.users?.last_name}
                      </td>
                      <td className="px-6 py-4 font-semibold">${payment.amount.toFixed(2)}</td>
                      <td className="px-6 py-4">{payment.hours_worked || "-"}</td>
                      <td className="px-6 py-4">
                        <Badge
                          variant={
                            payment.status === "completed"
                              ? "default"
                              : payment.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {payment.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {new Date(payment.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
