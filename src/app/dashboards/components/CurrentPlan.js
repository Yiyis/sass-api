import { CreditCard, Info } from 'lucide-react'

export default function CurrentPlan({ totalUsage }) {
  const totalCredits = 10000 // Mock total credits

  return (
    <div className="bg-gradient-to-r from-pink-500 via-red-500 to-blue-600 rounded-xl p-6 text-white">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="text-sm font-medium text-pink-100 mb-1">CURRENT PLAN</div>
          <h2 className="text-3xl font-bold">Professional</h2>
        </div>
        <button className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <CreditCard size={16} />
          Manage Plan
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="text-sm">API Usage</span>
          <Info size={16} className="text-pink-200" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Plan</span>
            <span>{totalUsage.toLocaleString()}/{totalCredits.toLocaleString()} Credits</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min((totalUsage / totalCredits) * 100, 100)}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="relative">
            <input type="checkbox" id="payAsYouGo" className="sr-only" />
            <label htmlFor="payAsYouGo" className="flex items-center cursor-pointer">
              <div className="w-11 h-6 bg-white/20 rounded-full p-1 transition-colors">
                <div className="w-4 h-4 bg-white rounded-full transition-transform transform translate-x-0"></div>
              </div>
              <span className="ml-3 text-sm">Pay as you go</span>
            </label>
          </div>
          <Info size={16} className="text-pink-200" />
        </div>
      </div>
    </div>
  )
}
