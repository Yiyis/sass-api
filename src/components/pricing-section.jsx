import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check } from "lucide-react"

export function PricingSection() {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for getting started with GitHub analysis",
      features: [
        "5 API key creations per month",
        "Basic usage analytics",
        "Read permissions",
        "Community support",
      ],
      popular: false,
    },
    {
      name: "Pro",
      price: "$19",
      period: "per month",
      description: "For developers who need advanced GitHub analysis",
      features: [
        "Unlimited API keys",
        "Advanced analytics",
        "Write permissions",
        "API playground access",
        "Export reports",
        "Priority support",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "per month",
      description: "For teams and organizations",
      features: [
        "Everything in Pro",
        "Team collaboration",
        "Custom integrations",
        "Advanced security",
        "Dedicated support",
        "SLA guarantee",
      ],
      popular: false,
    },
  ]

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Choose Your Plan</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free and scale as you grow. All plans include our core GitHub analysis features.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={plan.name}
              className={`relative ${
                plan.popular ? "ring-2 ring-primary shadow-lg" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl font-bold text-foreground mb-2">{plan.name}</CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">/{plan.period}</span>
                </div>
                <CardDescription className="text-muted-foreground">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-foreground">
                      <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-primary hover:bg-primary/90"
                      : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                  }`}
                  size="lg"
                >
                  {plan.name === "Free" ? "Get Started Free" : `Choose ${plan.name}`}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            All plans include a 14-day free trial. No credit card required for Free tier.
          </p>
        </div>
      </div>
    </section>
  )
}
