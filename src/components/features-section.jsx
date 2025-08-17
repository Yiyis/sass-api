import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Key, BarChart3, Shield, Zap, Users, GitBranch, Lock, Activity } from "lucide-react"

export function FeaturesSection() {
  const features = [
    {
      icon: Key,
      title: "API Key Management",
      description: "Create, manage, and monitor API keys with granular permission controls and usage tracking."
    },
    {
      icon: Zap,
      title: "AI-Powered Analysis",
      description: "Get intelligent insights into your GitHub repositories with our advanced AI summarization."
    },
    {
      icon: Shield,
      title: "Security First",
      description: "Enterprise-grade security with Row Level Security (RLS) and encrypted data storage."
    },
    {
      icon: BarChart3,
      title: "Usage Analytics",
      description: "Track API usage patterns, monitor performance, and optimize your API consumption."
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Manage team access, share API keys securely, and collaborate on API development."
    },
    {
      icon: GitBranch,
      title: "GitHub Integration",
      description: "Connect your GitHub repositories for automated analysis and insights generation."
    },
    {
      icon: Lock,
      title: "Permission Control",
      description: "Fine-grained access control with read, write, and delete permissions for each API key."
    },
    {
      icon: Activity,
      title: "Real-time Monitoring",
      description: "Monitor API performance, track errors, and get alerts for critical issues."
    }
  ]

  return (
    <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Everything You Need to Analyze GitHub Repositories
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From AI-powered repository analysis to advanced API key management, 
            we've got you covered with a comprehensive set of features.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-2">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-lg text-foreground">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
