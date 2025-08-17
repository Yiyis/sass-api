import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Play, Code, BarChart3 } from "lucide-react"

export function DemoSection() {
  return (
    <section id="demo" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            See It in Action
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our interactive demo to see how easy it is to manage your APIs 
            and get AI-powered insights from your GitHub repositories.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-foreground">
              Experience the Power of AI-Driven GitHub Analysis
            </h3>
            <p className="text-muted-foreground">
              Our platform combines the intelligence of AI-powered GitHub analysis with the simplicity 
              of API key management. See how you can streamline your development workflow.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                  <Play className="w-3 h-3 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Interactive Dashboard</h4>
                  <p className="text-sm text-muted-foreground">
                    Navigate through our intuitive dashboard with real-time data and analytics
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                  <Code className="w-3 h-3 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">API Playground</h4>
                  <p className="text-sm text-muted-foreground">
                    Test your API keys and explore the GitHub summarizer functionality
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mt-0.5">
                  <BarChart3 className="w-3 h-3 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">Usage Analytics</h4>
                  <p className="text-sm text-muted-foreground">
                    Monitor your API consumption and performance metrics in real-time
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/dashboards" className="gap-2">
                  Try Demo Now
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/auth/signin">Sign Up Free</Link>
              </Button>
            </div>
          </div>
          
          <div className="space-y-6">
            <Card className="glass-strong border-2 border-primary/30">
              <CardHeader>
                <CardTitle className="text-primary">API Key Management</CardTitle>
                <CardDescription>
                  Create and manage your API keys with full CRUD operations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 glass-subtle rounded-lg">
                    <span className="text-sm font-mono text-foreground">api_live_123456...</span>
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded border border-green-500/30">Active</span>
                  </div>
                  <div className="flex justify-between items-center p-3 glass-subtle rounded-lg">
                    <span className="text-sm font-mono text-foreground">api_dev_abcdef...</span>
                    <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded border border-blue-500/30">Dev</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-strong border-2 border-primary/30">
              <CardHeader>
                <CardTitle className="text-primary">GitHub Analysis</CardTitle>
                <CardDescription>
                  AI-powered insights from your repository README files
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 glass-subtle rounded-lg">
                    <div className="text-sm font-semibold text-foreground mb-1">Repository Summary</div>
                    <div className="text-xs text-muted-foreground">
                      Intelligent analysis of your project structure, features, and architecture...
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
