import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Shield, Zap, Users } from "lucide-react"

export function HeroSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto text-center max-w-4xl">
        <div className="mb-6 sm:mb-8">
          <div className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 glass-subtle text-primary-foreground hover:bg-primary/30 mb-4 sm:mb-6">
            🚀 Now with AI-powered GitHub analysis
          </div>
        </div>
        
        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-foreground mb-4 sm:mb-6">
          Analyze Your GitHub Repositories with
          <span className="text-primary"> AI Intelligence</span>
        </h1>
        
        <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
          A comprehensive platform for analyzing GitHub repositories with AI, managing API keys, 
          and gaining insights into your development workflow. Built for modern teams.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 sm:mb-12">
          <Button size="lg" asChild className="w-full sm:w-auto">
            <Link href="/auth/signin" className="gap-2">
              Get Started Free
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-12 sm:mt-16">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Secure & Reliable</h3>
            <p className="text-sm text-muted-foreground">Enterprise-grade security with granular permission controls</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">AI-Powered Insights</h3>
            <p className="text-sm text-muted-foreground">Get intelligent analysis of your GitHub repositories</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Team Ready</h3>
            <p className="text-sm text-muted-foreground">Built for collaboration and team management</p>
          </div>
        </div>
      </div>
    </section>
  )
}
