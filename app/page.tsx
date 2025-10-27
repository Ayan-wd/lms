import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, Users, BookOpen, TrendingUp } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">House of Mathematics</div>
          <div className="hidden md:flex gap-8 items-center">
            <Link href="#features" className="text-sm hover:text-primary transition">
              Features
            </Link>
            <Link href="#how-it-works" className="text-sm hover:text-primary transition">
              How It Works
            </Link>
            <Link href="#pricing" className="text-sm hover:text-primary transition">
              Pricing
            </Link>
          </div>
          <div className="flex gap-3">
            <Link href="/auth/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/auth/sign-up">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground text-balance">
              Master Mathematics with Expert Tutors
            </h1>
            <p className="text-xl text-muted-foreground text-balance">
              Connect with verified math teachers, schedule personalized lessons, and transform your learning journey
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/auth/sign-up?type=learner">
              <Button size="lg" className="w-full sm:w-auto">
                Find a Tutor
              </Button>
            </Link>
            <Link href="/auth/sign-up?type=teacher">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                Become a Tutor
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-12 border-t border-border">
            <div>
              <div className="text-3xl font-bold text-primary">500+</div>
              <p className="text-sm text-muted-foreground">Expert Tutors</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">10K+</div>
              <p className="text-sm text-muted-foreground">Active Learners</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">50K+</div>
              <p className="text-sm text-muted-foreground">Lessons Completed</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Why Choose House of Mathematics?</h2>
              <p className="text-lg text-muted-foreground">Everything you need for effective learning</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-border">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <Users className="w-6 h-6 text-primary" />
                    <CardTitle>Verified Tutors</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    All tutors are verified with degrees and teaching experience. Read reviews from other learners.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <BookOpen className="w-6 h-6 text-primary" />
                    <CardTitle>Personalized Learning</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Schedule lessons at your convenience. Each session is tailored to your learning goals.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-6 h-6 text-primary" />
                    <CardTitle>Track Progress</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Monitor your improvement with detailed session notes and progress tracking.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                    <CardTitle>Secure & Safe</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Encrypted video sessions, secure payments, and verified identities for peace of mind.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-lg text-muted-foreground">Get started in 4 simple steps</p>
            </div>

            <div className="space-y-8">
              {[
                {
                  step: 1,
                  title: "Create Your Profile",
                  description: "Sign up and tell us about your learning goals or teaching experience.",
                },
                {
                  step: 2,
                  title: "Browse & Connect",
                  description: "Explore verified tutors or wait for learners to find you. Schedule a demo lesson.",
                },
                {
                  step: 3,
                  title: "Take a Demo",
                  description: "Meet your tutor in a free demo session to ensure it's a good fit.",
                },
                {
                  step: 4,
                  title: "Start Learning",
                  description: "Begin regular lessons and track your progress with detailed session notes.",
                },
              ].map((item) => (
                <div key={item.step} className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground font-bold">
                      {item.step}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
              <p className="text-lg text-muted-foreground">No hidden fees. Pay only for lessons you take.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle>For Learners</CardTitle>
                  <CardDescription>Pay per lesson</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Tutor rates vary based on experience</p>
                    <p className="text-3xl font-bold mt-2">$20-100/hr</p>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span className="text-sm">Browse verified tutors</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span className="text-sm">Free demo lessons</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span className="text-sm">Secure payments</span>
                    </li>
                  </ul>
                  <Link href="/auth/sign-up?type=learner" className="block">
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle>For Tutors</CardTitle>
                  <CardDescription>Earn on your schedule</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Set your own hourly rate</p>
                    <p className="text-3xl font-bold mt-2">You Decide</p>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span className="text-sm">Flexible scheduling</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span className="text-sm">Verified students</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      <span className="text-sm">Instant payouts</span>
                    </li>
                  </ul>
                  <Link href="/auth/sign-up?type=teacher" className="block">
                    <Button className="w-full">Join as Tutor</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Transform Your Math Learning?</h2>
          <p className="text-lg mb-8 opacity-90">Join thousands of students and tutors on House of Mathematics</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/sign-up?type=learner">
              <Button variant="secondary" size="lg">
                Find a Tutor
              </Button>
            </Link>
            <Link href="/auth/sign-up?type=teacher">
              <Button
                variant="outline"
                size="lg"
                className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary bg-transparent"
              >
                Become a Tutor
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">House of Mathematics</h3>
              <p className="text-sm text-muted-foreground">Connecting learners with expert math tutors worldwide.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-foreground">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-foreground">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 House of Mathematics. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
