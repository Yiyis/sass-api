import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { supabaseAdmin } from '@/lib/supabase'

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          // Check if user already exists
          const { data: existingUser, error: checkError } = await supabaseAdmin
            .from('users')
            .select('id, last_sign_in')
            .eq('email', user.email)
            .single()

          if (checkError && checkError.code !== 'PGRST116') {
            console.error('Error checking existing user:', checkError)
            return false
          }

          if (existingUser) {
            // Update last sign in for existing user
            const { error: updateError } = await supabaseAdmin
              .from('users')
              .update({ 
                last_sign_in: new Date().toISOString(),
                name: user.name,
                image_url: user.image
              })
              .eq('id', existingUser.id)

            if (updateError) {
              console.error('Error updating user:', updateError)
            }
          } else {
            // Create new user
            const { error: insertError } = await supabaseAdmin
              .from('users')
              .insert({
                email: user.email,
                name: user.name,
                image_url: user.image,
                provider: 'google',
                provider_id: profile.sub,
                last_sign_in: new Date().toISOString()
              })

            if (insertError) {
              console.error('Error creating user:', insertError)
              return false
            }

            console.log('New user created:', user.email)
          }

          return true
        } catch (error) {
          console.error('Error in signIn callback:', error)
          return false
        }
      }
      return true
    },
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
