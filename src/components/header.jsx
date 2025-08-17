import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Brain } from "lucide-react"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <Brain className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground">GitHub Analyzer</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="#features" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Features
            </Link>
            <Link href="#pricing" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Pricing
            </Link>
            <Link href="#demo" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Demo
            </Link>
          </nav>
          <div className="flex items-center space-x-2">
            <Button variant="outline" asChild>
              <Link href="/dashboards">View Demo</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
