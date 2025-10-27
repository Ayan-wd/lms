"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function UserManagement() {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button className="w-full bg-transparent" variant="outline">
          Export User Data
        </Button>
        <Button className="w-full bg-transparent" variant="outline">
          View Reports
        </Button>
        <Button className="w-full bg-transparent" variant="outline">
          System Settings
        </Button>
        <Button className="w-full bg-transparent" variant="outline">
          Backup Database
        </Button>
      </CardContent>
    </Card>
  )
}
