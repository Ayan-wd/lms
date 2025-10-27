"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface MyStudentsProps {
  teacherId: string
  hiredRecords: any[]
}

export function MyStudents({ teacherId, hiredRecords }: MyStudentsProps) {
  if (!hiredRecords || hiredRecords.length === 0) {
    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle>My Students</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">No students yet. Start by accepting demo requests!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>My Students</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {hiredRecords.map((record) => (
            <div key={record.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarFallback>{record.learner_name?.charAt(0) || "S"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{record.learner_name || "Student"}</p>
                  <p className="text-sm text-muted-foreground">{record.learner_email || "N/A"}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold">{record.lessons_completed || 0} lessons</p>
                <p className="text-sm text-muted-foreground">Rating: {record.rating || 0}/5</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
