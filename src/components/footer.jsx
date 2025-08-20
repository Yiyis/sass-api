import { Brain } from "lucide-react"

const footerLinks = {
  product: [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "#pricing" },
    { name: "API", href: "#api" },
    { name: "Documentation", href: "#docs" },
  ],
  company: [
    { name: "About", href: "#about" },
    { name: "Blog", href: "#blog" },
    { name: "Careers", href: "#careers" },
    { name: "Contact", href: "#contact" },
  ],
  support: [
    { name: "Help Center", href: "#help" },
    { name: "Community", href: "#community" },
    { name: "Status", href: "#status" },
    { name: "Privacy", href: "#privacy" },
  ],
}

export function Footer() {
  return (
    <footer className="glass-strong border-t border-border py-8 sm:py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
              <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                <Brain className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-foreground">Git Repo Scope</span>
            </div>
            <p className="text-sm text-muted-foreground">AI-powered GitHub analysis for the modern developer</p>
          </div>

          <div className="text-center sm:text-left">
            <h4 className="font-semibold text-foreground mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="hover:text-foreground transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center sm:text-left">
            <h4 className="font-semibold text-foreground mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="hover:text-foreground transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center sm:text-left">
            <h4 className="font-semibold text-foreground mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="hover:text-foreground transition-colors">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-sm text-muted-foreground">
          © 2024 Git Repo Scope. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
