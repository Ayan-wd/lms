"use client"

import Link from "next/link"
import { Bell, Settings, LogOut } from "lucide-react"
import { createClient } from "@/lib/client"
import { useRouter } from "next/navigation"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface TeacherHeaderProps {
  user: any
}

export function TeacherHeader({ user }: TeacherHeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  const notifications = [
    { id: 1, title: "New Demo Request", description: "From John Doe", time: "5 min ago" },
    { id: 2, title: "Payment Received", description: "$50 from Alice Johnson", time: "1 hour ago" },
  ]

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/teacher/dashboard" className="text-2xl font-bold text-primary">
          House of Mathematics
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/teacher/dashboard" className="text-sm hover:text-primary transition">
            Dashboard
          </Link>
          <Link href="/teacher/students" className="text-sm hover:text-primary transition">
            My Students
          </Link>
          <Link href="/teacher/schedule" className="text-sm hover:text-primary transition">
            Schedule
          </Link>
          <Link href="/teacher/earnings" className="text-sm hover:text-primary transition">
            Earnings
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <button className="p-2 hover:bg-muted rounded-lg transition relative">
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <h4 className="font-semibold">Notifications ({notifications.length})</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="p-3 rounded-lg border border-border hover:bg-muted transition">
                      <p className="font-semibold text-sm">{notif.title}</p>
                      <p className="text-sm text-muted-foreground">{notif.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{notif.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Link href="/teacher/settings">
            <button className="p-2 hover:bg-muted rounded-lg transition">
              <Settings className="w-5 h-5" />
            </button>
          </Link>
          <button onClick={handleLogout} className="p-2 hover:bg-muted rounded-lg transition">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
