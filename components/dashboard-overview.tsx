"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Clock, TrendingUp, Users } from "lucide-react"

interface DashboardOverviewProps {
  learner: any
  hiredCount: number
}

export function DashboardOverview({ learner, hiredCount }: DashboardOverviewProps) {
  const stats = [
    {
      title: "Active Courses",
      value: hiredCount.toString(),
      icon: BookOpen,
      color: "text-blue-500",
    },
    {
      title: "Hours Learned",
      value: "0",
      icon: Clock,
      color: "text-green-500",
    },
    {
      title: "Progress",
      value: "0%",
      icon: TrendingUp,
      color: "text-purple-500",
    },
    {
      title: "Tutors",
      value: hiredCount.toString(),
      icon: Users,
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
