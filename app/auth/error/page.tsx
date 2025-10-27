"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error") || "An error occurred"

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Authentication Error</CardTitle>
            <CardDescription>Something went wrong</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{error}</p>

            <div className="pt-4 space-y-2">
              <Link href="/auth/login" className="block">
                <Button className="w-full">Try Again</Button>
              </Link>
              <Link href="/" className="block">
                <Button variant="outline" className="w-full bg-transparent">
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
