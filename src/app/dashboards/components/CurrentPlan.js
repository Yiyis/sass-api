import { CreditCard, Info } from 'lucide-react'

export default function CurrentPlan({ totalUsage }) {
  const totalCredits = 10000 // Mock total credits

  return (
    <div className="glass-strong rounded-xl p-6 border border-border/30">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="text-sm font-medium text-muted-foreground mb-1">CURRENT PLAN</div>
          <h2 className="text-3xl font-bold text-foreground">Professional</h2>
        </div>
        <button className="bg-primary/20 hover:bg-primary/30 text-primary px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <CreditCard size={16} />
          Manage Plan
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-foreground">API Usage</span>
          <Info size={16} className="text-muted-foreground" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-foreground">Plan</span>
            <span className="text-foreground">{totalUsage.toLocaleString()}/{totalCredits.toLocaleString()} Credits</span>
          </div>
          <div className="w-full bg-muted/30 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((totalUsage / totalCredits) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <input type="checkbox" id="payAsYouGo" className="sr-only" />
            <label htmlFor="payAsYouGo" className="flex items-center cursor-pointer">
              <div className="w-11 h-6 bg-muted/30 rounded-full p-1 transition-colors">
                <div className="w-4 h-4 bg-primary rounded-full transition-transform transform translate-x-0"></div>
              </div>
              <span className="ml-3 text-sm text-foreground">Pay as you go</span>
            </label>
          </div>
          <Info size={16} className="text-muted-foreground" />
        </div>
      </div>
    </div>
  )
}
