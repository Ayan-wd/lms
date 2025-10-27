"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Clock, TrendingUp, DollarSign } from "lucide-react"

interface TeacherOverviewProps {
  teacher: any
  hiredCount: number
  payments: any[]
}

export function TeacherOverview({ teacher, hiredCount, payments }: TeacherOverviewProps) {
  const totalEarnings = payments.reduce((sum, p) => sum + (p.amount || 0), 0)
  const monthlyEarnings = payments
    .filter((p) => {
      const paymentDate = new Date(p.created_at)
      const now = new Date()
      return paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear()
    })
    .reduce((sum, p) => sum + (p.amount || 0), 0)

  const stats = [
    {
      title: "Active Students",
      value: hiredCount.toString(),
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Hours Taught",
      value: (teacher?.years_experience || 0).toString(),
      icon: Clock,
      color: "text-green-500",
    },
    {
      title: "Rating",
      value: `${teacher?.rating || 0}/5`,
      icon: TrendingUp,
      color: "text-purple-500",
    },
    {
      title: "Total Earnings",
      value: `$${totalEarnings.toFixed(2)}`,
      icon: DollarSign,
      color: "text-orange-500",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title} className="border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-3xl font-bold">{stat.value}</div>
              <Icon className={`w-8 h-8 ${stat.color} opacity-20`} />
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
