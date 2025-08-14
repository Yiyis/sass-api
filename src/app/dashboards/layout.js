import Link from 'next/link'
import { ArrowLeft, Home, Code, Star, CreditCard, Settings, FileText, Globe, LogOut, User } from 'lucide-react'

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900">SaaS API</span>
          </div>
        </div>

        {/* Account Selection */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="w-6 h-6 bg-blue-500 rounded-md flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">Personal</span>
            <svg className="w-4 h-4 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            <li>
              <Link href="/dashboards" className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 text-blue-700 font-medium">
                <Home size={20} />
                Overview
              </Link>
            </li>
            <li>
              <Link href="/dashboards/playground" className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                <Code size={20} />
                API Playground
              </Link>
            </li>
            <li>
              <Link href="/dashboards/use-cases" className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                <Star size={20} />
                Use Cases
              </Link>
            </li>
            <li>
              <Link href="/dashboards/billing" className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                <CreditCard size={20} />
                Billing
              </Link>
            </li>
            <li>
              <Link href="/dashboards/settings" className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                <Settings size={20} />
                Settings
              </Link>
            </li>
            <li>
              <Link href="/dashboards/docs" className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                <FileText size={20} />
                Documentation
                <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            </li>
          </ul>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">YO</span>
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-700">Your Name</div>
              <div className="text-xs text-gray-500">your@email.com</div>
            </div>
            <LogOut size={16} className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <nav className="text-sm text-gray-500 mb-1">
                <span>Pages / Overview</span>
              </nav>
              <h1 className="text-2xl font-bold text-gray-900">SaaS API Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Operational</span>
              </div>
              <div className="w-px h-6 bg-gray-300"></div>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
