import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { SupabaseAdapter } from '@auth/supabase-adapter'

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  // No Supabase adapter needed for basic Google SSO
  callbacks: {
    async session({ session, user, token }) {
      // Add user ID to session from JWT token
      if (token) {
        session.user.id = token.sub
      }
      return session
    },
    async jwt({ token, user, account }) {
      // Add user ID to JWT token
      if (user) {
        token.id = user.id
      }
      return token
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt', // Use JWT strategy - simple and effective
  },
  debug: false, // Disable debug mode for production
}

export default NextAuth(authOptions)
