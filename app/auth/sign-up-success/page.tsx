import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Check Your Email</CardTitle>
            <CardDescription>We&apos;ve sent you a confirmation link</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Please check your email and click the confirmation link to verify your account. This helps us keep your
              account secure.
            </p>

            <p className="text-sm text-muted-foreground">
              Once confirmed, you&apos;ll be able to log in and start using House of Mathematics.
            </p>

            <div className="pt-4 space-y-2">
              <Link href="/auth/login" className="block">
                <Button variant="outline" className="w-full bg-transparent">
                  Back to Login
                </Button>
              </Link>
              <Link href="/" className="block">
                <Button variant="ghost" className="w-full">
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
