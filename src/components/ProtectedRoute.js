'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ProtectedRoute({ children }) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return // Still loading

    if (!session) {
      router.push('/auth/signin')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect in useEffect
  }

  return (
    <div>
      {/* Header with user info and sign out */}
      <div className="bg-white shadow-sm border-b px-6 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img
              src={session.user.image}
              alt={session.user.name}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">{session.user.name}</p>
              <p className="text-xs text-gray-500">{session.user.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
      
      {/* Main content */}
      {children}
    </div>
  )
}
