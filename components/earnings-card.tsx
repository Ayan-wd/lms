"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DollarSign, TrendingUp } from "lucide-react"

interface EarningsCardProps {
  payments: any[]
}

export function EarningsCard({ payments }: EarningsCardProps) {
  const monthlyEarnings = payments
    .filter((p) => {
      const paymentDate = new Date(p.created_at)
      const now = new Date()
      return paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear()
    })
    .reduce((sum, p) => sum + (p.amount || 0), 0)

  const lastMonthEarnings = payments
    .filter((p) => {
      const paymentDate = new Date(p.created_at)
      const now = new Date()
      const lastMonth = new Date(now.setMonth(now.getMonth() - 1))
      return paymentDate.getMonth() === lastMonth.getMonth() && paymentDate.getFullYear() === lastMonth.getFullYear()
    })
    .reduce((sum, p) => sum + (p.amount || 0), 0)

  const percentChangeValue =
    lastMonthEarnings > 0 ? ((monthlyEarnings - lastMonthEarnings) / lastMonthEarnings) * 100 : 0
  const percentChange = typeof percentChangeValue === 'number' ? percentChangeValue.toFixed(1) : '0'

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="w-5 h-5" />
          Earnings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">This Month</p>
          <p className="text-3xl font-bold">${monthlyEarnings.toFixed(2)}</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-green-600">
          <TrendingUp className="w-4 h-4" />
          <span>
            {percentChangeValue > 0 ? "+" : ""}
            {percentChange}% from last month
          </span>
        </div>
        <Button className="w-full">Withdraw Earnings</Button>
      </CardContent>
    </Card>
  )
}
