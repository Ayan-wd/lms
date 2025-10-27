"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, Award } from "lucide-react"

interface BrowseTutorsProps {
  teachers: any[]
}

export function BrowseTutors({ teachers }: BrowseTutorsProps) {
  if (!teachers || teachers.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Featured Tutors</h2>
            <p className="text-muted-foreground">Find your perfect math tutor</p>
          </div>
          <Button variant="outline">View All Tutors</Button>
        </div>
        <Card className="border-border">
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center py-8">No verified tutors available yet</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Featured Tutors</h2>
          <p className="text-muted-foreground">Find your perfect math tutor</p>
        </div>
        <Button variant="outline">View All Tutors</Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teachers.map((tutor) => (
          <Card key={tutor.id} className="border-border flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>
                    {tutor.users?.first_name} {tutor.users?.last_name}
                  </CardTitle>
                  <CardDescription>{tutor.bio_extended || "Math Tutor"}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{tutor.rating || 0}</span>
                </div>
                <span className="text-sm text-muted-foreground">({tutor.total_reviews || 0} reviews)</span>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  {tutor.years_experience || 0} years experience
                </div>
              </div>

              <div className="pt-2 border-t border-border">
                <p className="text-lg font-bold">${tutor.hourly_rate || 0}/hour</p>
              </div>

              <Button className="w-full">Book Demo Lesson</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
