"use client"

import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface Notification {
  id: string
  title: string
  description: string
  timestamp: Date
  read: boolean
}

export function Notifications() {
  const notifications: Notification[] = [
    {
      id: "1",
      title: "New Demo Request",
      description: "You have a new demo request from John Doe",
      timestamp: new Date(Date.now() - 3600000),
      read: false,
    },
    {
      id: "2",
      title: "Payment Received",
      description: "You received a payment of $50 from Alice Johnson",
      timestamp: new Date(Date.now() - 7200000),
      read: false,
    },
    {
      id: "3",
      title: "Lesson Reminder",
      description: "Your lesson with Bob Smith starts in 30 minutes",
      timestamp: new Date(Date.now() - 1800000),
      read: true,
    },
  ]

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold">Notifications</h4>
            <p className="text-sm text-muted-foreground">{unreadCount} unread</p>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg border ${
                  notification.read ? "border-border bg-background" : "border-primary bg-primary/5"
                }`}
              >
                <p className="font-semibold text-sm">{notification.title}</p>
                <p className="text-sm text-muted-foreground">{notification.description}</p>
                <p className="text-xs text-muted-foreground mt-1">{notification.timestamp.toLocaleTimeString()}</p>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
