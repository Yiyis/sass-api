'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Code, Star, CreditCard, Settings, FileText, Menu, X } from 'lucide-react'
import ProtectedRoute from '@/components/ProtectedRoute'

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const isActive = (path) => {
    return pathname === path
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-bold text-gray-900">SaaS API</span>
            </div>
            {/* Close button for mobile */}
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Account Selection */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
            <div className="w-6 h-6 bg-blue-500 rounded-md flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
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
              <Link 
                href="/dashboards" 
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isActive('/dashboards') 
                    ? 'bg-blue-50 text-blue-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Home size={20} />
                Overview
              </Link>
            </li>
            <li>
              <Link 
                href="/dashboards/api-playground" 
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isActive('/dashboards/api-playground') 
                    ? 'bg-blue-50 text-blue-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Code size={20} />
                API Playground
              </Link>
            </li>
            <li>
              <Link 
                href="/dashboards/use-cases" 
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isActive('/dashboards/use-cases') 
                    ? 'bg-blue-50 text-blue-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Star size={20} />
                Use Cases
              </Link>
            </li>
            <li>
              <Link 
                href="/dashboards/billing" 
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isActive('/dashboards/billing') 
                    ? 'bg-blue-50 text-blue-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <CreditCard size={20} />
                Billing
              </Link>
            </li>
            <li>
              <Link 
                href="/dashboards/settings" 
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isActive('/dashboards/settings') 
                    ? 'bg-blue-50 text-blue-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Settings size={20} />
                Settings
              </Link>
            </li>
            <li>
              <Link 
                href="/dashboards/docs" 
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isActive('/dashboards/docs') 
                    ? 'bg-blue-50 text-blue-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <FileText size={20} />
                Documentation
                <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            </li>
          </ul>
        </nav>

        {/* User Section - Removed duplicate, user info shown in ProtectedRoute header */}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <button 
                onClick={toggleSidebar}
                className="lg:hidden p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Menu size={20} />
              </button>
              
              <div>
                <nav className="text-sm text-gray-500 mb-1">
                  <span>Pages / {pathname === '/dashboards' ? 'Overview' : pathname.split('/').pop().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                </nav>
                <h1 className="text-2xl font-bold text-gray-900">
                  {pathname === '/dashboards' ? 'SaaS API Dashboard' : 
                   pathname === '/dashboards/api-playground' ? 'API Playground' :
                   pathname === '/dashboards/use-cases' ? 'Use Cases' :
                   pathname === '/dashboards/billing' ? 'Billing' :
                   pathname === '/dashboards/settings' ? 'Settings' :
                   pathname === '/dashboards/docs' ? 'Documentation' : 'Dashboard'}
                </h1>
              </div>
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
        <main className="flex-1 p-4 lg:p-8">
          <ProtectedRoute>
            {children}
          </ProtectedRoute>
        </main>
      </div>
    </div>
  )
}
