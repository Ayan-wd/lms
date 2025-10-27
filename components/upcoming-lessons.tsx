"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User } from "lucide-react"

interface UpcomingLessonsProps {
  sessions: any[]
}

export function UpcomingLessons({ sessions }: UpcomingLessonsProps) {
  if (!sessions || sessions.length === 0) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">Upcoming Lessons</h2>
          <p className="text-muted-foreground">Your scheduled lessons for the next 7 days</p>
        </div>
        <Card className="border-border">
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center py-8">
              No upcoming lessons. Book a demo with a tutor to get started!
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Upcoming Lessons</h2>
        <p className="text-muted-foreground">Your scheduled lessons for the next 7 days</p>
      </div>

      <div className="grid gap-4">
        {sessions.map((lesson) => (
          <Card key={lesson.id} className="border-border">
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <div>
                    <h3 className="font-semibold text-lg">{lesson.topic || "Math Lesson"}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                      <User className="w-4 h-4" />
                      {lesson.hired?.teachers?.first_name} {lesson.hired?.teachers?.last_name}
                    </p>
                  </div>
                  <div className="flex gap-6 text-sm text-muted-foreground">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(lesson.scheduled_time).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {new Date(lesson.scheduled_time).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                <Button>Join Lesson</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
