"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen, DollarSign, TrendingUp } from "lucide-react"

interface AdminStatsProps {
  users: any[]
  lessons: any[]
  payments: any[]
}

export function AdminStats({ users, lessons, payments }: AdminStatsProps) {
  const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0)
  const lastMonthRevenue = payments
    .filter((p) => {
      const paymentDate = new Date(p.created_at)
      const now = new Date()
      const lastMonth = new Date(now.setMonth(now.getMonth() - 1))
      return paymentDate.getMonth() === lastMonth.getMonth() && paymentDate.getFullYear() === lastMonth.getFullYear()
    })
    .reduce((sum, p) => sum + (p.amount || 0), 0)

  const growthValue = lastMonthRevenue > 0 ? (((totalRevenue - lastMonthRevenue) / lastMonthRevenue) * 100) : 0
  const growth = typeof growthValue === 'number' ? growthValue.toFixed(1) : '0'

  const stats = [
    {
      title: "Total Users",
      value: users.length.toString(),
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Active Lessons",
      value: lessons.length.toString(),
      icon: BookOpen,
      color: "text-green-500",
    },
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: "text-purple-500",
    },
    {
      title: "Growth",
      value: `${growthValue > 0 ? "+" : ""}${growth}%`,
      icon: TrendingUp,
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
