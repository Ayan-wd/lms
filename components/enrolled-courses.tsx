"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"

interface EnrolledCoursesProps {
  hiredRecords: any[]
}

export function EnrolledCourses({ hiredRecords }: EnrolledCoursesProps) {
  if (!hiredRecords || hiredRecords.length === 0) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">Enrolled Courses</h2>
          <p className="text-muted-foreground">Continue learning with your current courses</p>
        </div>
        <Card className="border-border">
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center py-8">
              No enrolled courses yet. Browse tutors to get started!
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Enrolled Courses</h2>
        <p className="text-muted-foreground">Continue learning with your current courses</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hiredRecords.map((record) => (
          <Card key={record.id} className="border-border flex flex-col">
            <CardHeader>
              <CardTitle className="text-lg">Lessons with {record.teachers?.first_name}</CardTitle>
              <CardDescription>{record.teachers?.last_name}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-semibold capitalize">{record.status}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${record.status === "active" ? 50 : 0}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="w-4 h-4" />
                Rate: ${record.teachers?.hourly_rate}/hour
              </div>

              <Button className="w-full mt-4">Continue Learning</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
