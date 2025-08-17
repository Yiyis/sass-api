import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="py-20 px-4 relative bg-gradient-to-br from-background via-primary/5 to-background">
      <div className="container mx-auto text-center max-w-3xl">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Ready to Analyze Your GitHub Repositories?
        </h2>
        <p className="text-xl text-muted-foreground mb-8">
          Join developers who trust our platform for comprehensive GitHub analysis and AI-powered insights
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="px-8">
            Get Started Free
          </Button>
          <Button size="lg" variant="outline" className="px-8">
            View Demo
          </Button>
        </div>
      </div>
    </section>
  )
}
