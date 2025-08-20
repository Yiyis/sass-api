'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Code, Star, CreditCard, Settings, FileText, Menu, X, LogOut, User } from 'lucide-react'
import { useSession, signOut } from 'next-auth/react'
import ProtectedRoute from '@/components/ProtectedRoute'

// UserAvatar component for consistent avatar display
function UserAvatar({ user, size = 'default' }) {
  const [imageError, setImageError] = useState(false)
  
  const getInitials = (name, email) => {
    if (name) {
      const names = name.split(' ')
      if (names.length >= 2) {
        return `${names[0].charAt(0)}${names[1].charAt(0)}`.toUpperCase()
      }
      return name.charAt(0).toUpperCase()
    }
    return email ? email.charAt(0).toUpperCase() : 'U'
  }

  const sizeClasses = {
    small: 'w-6 h-6 text-xs',
    default: 'w-8 h-8 text-xs',
    large: 'w-10 h-10 text-sm'
  }

  return (
    <div className={`${sizeClasses[size] || sizeClasses.default} rounded-full ring-2 ring-primary/20 flex-shrink-0 bg-primary/20 flex items-center justify-center overflow-hidden`}>
      {user?.image && !imageError ? (
        <img
          src={user.image}
          alt={user.name || user.email || 'User avatar'}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
          onLoad={() => setImageError(false)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-primary font-semibold">
            {getInitials(user?.name, user?.email)}
          </span>
        </div>
      )}
    </div>
  )
}

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const pathname = usePathname()
  const { data: session } = useSession()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const isActive = (path) => {
    return pathname === path
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-80 sm:w-64 glass-strong border-r border-border flex flex-col transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo Section */}
        <div className="p-4 sm:p-6 border-b border-border/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center glow-purple">
                <span className="text-primary-foreground font-bold text-lg">G</span>
              </div>
              <span className="text-lg sm:text-xl font-bold text-foreground">GitHub Analyzer</span>
            </div>
            {/* Close button for mobile */}
            <button 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Account Selection */}
        <div className="p-4 border-b border-border/30">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
              <svg className="w-4 h-4 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-foreground">Personal</span>
            <svg className="w-4 h-4 text-muted-foreground ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-3 sm:p-4">
          <ul className="space-y-1 sm:space-y-2">
            <li>
              <Link 
                href="/dashboards" 
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isActive('/dashboards') 
                    ? 'bg-primary/20 text-primary font-medium' 
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
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
                    ? 'bg-primary/20 text-primary font-medium' 
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                }`}
              >
                <Code size={20} />
                API Playground
              </Link>
            </li>
            <li>
              <Link 
                href="/dashboards/billing" 
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isActive('/dashboards/billing') 
                    ? 'bg-primary/20 text-primary font-medium' 
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                }`}
              >
                <CreditCard size={20} />
                Billing
              </Link>
            </li>
            <li>
              <Link 
                href="/dashboards/docs" 
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isActive('/dashboards/docs') 
                    ? 'bg-primary/20 text-primary font-medium' 
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                }`}
              >
                <FileText size={20} />
                Documentation
                <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            </li>
          </ul>
        </nav>

        {/* User Section */}
        {session && (
          <div className="p-3 sm:p-4 border-t border-border/30 mt-auto">
            <div className="flex items-center gap-3 p-3 rounded-lg glass-subtle">
              <UserAvatar user={session.user} size="default" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {session.user.name || 'User'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {session.user.email || 'No email'}
                </p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-md transition-colors flex-shrink-0"
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="glass border-b border-border/30 px-3 sm:px-4 lg:px-6 xl:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Mobile menu button */}
              <button 
                onClick={toggleSidebar}
                className="lg:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Menu size={20} />
              </button>
              
              <div className="min-w-0 flex-1">
                <nav className="text-xs sm:text-sm text-muted-foreground mb-1">
                  <span className="truncate">Pages / {pathname === '/dashboards' ? 'Overview' : pathname.split('/').pop().replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                </nav>
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground truncate">
                  {pathname === '/dashboards' ? 'GitHub Analyzer Dashboard' : 
                   pathname === '/dashboards/api-playground' ? 'API Playground' :
                   pathname === '/dashboards/use-cases' ? 'Use Cases' :
                   pathname === '/dashboards/billing' ? 'Billing' :
                   pathname === '/dashboards/settings' ? 'Settings' :
                   pathname === '/dashboards/docs' ? 'Documentation' : 'Dashboard'}
                </h1>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 p-3 sm:p-4 lg:p-6 xl:p-8 bg-background">
          <ProtectedRoute>
            {children}
          </ProtectedRoute>
        </main>
      </div>
    </div>
  )
}
