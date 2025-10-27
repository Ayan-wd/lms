"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { createClient } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { Video, Mic, Share2, LogOut, Settings } from "lucide-react"

export default function TeacherClassroomPage() {
  const params = useParams()
  const sessionId = params.sessionId as string
  const [session, setSession] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMicOn, setIsMicOn] = useState(true)
  const [isVideoOn, setIsVideoOn] = useState(true)

  useEffect(() => {
    const fetchSession = async () => {
      const supabase = createClient()
      const { data } = await supabase.from("classroom_sessions").select("*").eq("id", sessionId).single()

      if (data && data.status === "scheduled") {
        await supabase.from("classroom_sessions").update({ status: "in_progress" }).eq("id", sessionId)
      }

      setSession(data)
      setIsLoading(false)
    }

    fetchSession()
  }, [sessionId])

  const handleEndSession = async () => {
    const supabase = createClient()
    await supabase
      .from("classroom_sessions")
      .update({
        status: "completed",
        actual_end: new Date().toISOString(),
      })
      .eq("id", sessionId)

    window.location.href = "/teacher/dashboard"
  }

  if (isLoading) return <div className="text-center py-8">Loading classroom...</div>

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Video Area */}
      <div className="flex-1 flex items-center justify-center bg-gray-900">
        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <Video className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Teaching interface</p>
            <p className="text-sm text-gray-500 mt-2">Session Link: {session?.session_link}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-900 border-t border-gray-800 p-4">
        <div className="flex justify-center gap-4">
          <Button
            size="lg"
            variant={isVideoOn ? "default" : "destructive"}
            onClick={() => setIsVideoOn(!isVideoOn)}
            className="rounded-full w-14 h-14 p-0"
          >
            <Video className="w-6 h-6" />
          </Button>
          <Button
            size="lg"
            variant={isMicOn ? "default" : "destructive"}
            onClick={() => setIsMicOn(!isMicOn)}
            className="rounded-full w-14 h-14 p-0"
          >
            <Mic className="w-6 h-6" />
          </Button>
          <Button size="lg" variant="outline" className="rounded-full w-14 h-14 p-0 bg-transparent">
            <Share2 className="w-6 h-6" />
          </Button>
          <Button size="lg" variant="outline" className="rounded-full w-14 h-14 p-0 bg-transparent">
            <Settings className="w-6 h-6" />
          </Button>
          <Button size="lg" variant="destructive" onClick={handleEndSession} className="rounded-full w-14 h-14 p-0">
            <LogOut className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Session Info */}
      <div className="bg-gray-800 text-white p-4 text-center text-sm">
        <p>Session started at {new Date(session?.scheduled_start).toLocaleTimeString()}</p>
      </div>
    </div>
  )
}
