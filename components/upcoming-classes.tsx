"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock } from "lucide-react"

interface UpcomingClassesProps {
  sessions: any[]
}

export function UpcomingClasses({ sessions }: UpcomingClassesProps) {
  if (!sessions || sessions.length === 0) {
    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle>Upcoming Classes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">No upcoming classes scheduled</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Upcoming Classes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sessions.map((session) => (
            <div key={session.id} className="p-4 border border-border rounded-lg space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">
                    {session.hired?.learners?.first_name} {session.hired?.learners?.last_name}
                  </p>
                  <p className="text-sm text-muted-foreground">{session.topic || "Math Lesson"}</p>
                </div>
                <Button size="sm">Join Class</Button>
              </div>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(session.scheduled_time).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {new Date(session.scheduled_time).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
