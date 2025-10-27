import Link from "next/link"

export function Footer() {
  return (
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
                <Link href="/#features" className="hover:text-foreground">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-foreground">
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
  )
}
