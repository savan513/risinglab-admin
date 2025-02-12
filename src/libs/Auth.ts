// Third-party Imports
import CredentialProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import type { NextAuthOptions } from 'next-auth'
import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

export const authOptions: NextAuthOptions = {
  // ** Providers configuration
  providers: [
    CredentialProvider({
      name: 'Credentials',
      type: 'credentials',
      credentials: {},
      async authorize(credentials) {
        const { email, password } = credentials as { email: string; password: string }

        try {
          const res = await fetch(`${process.env.API_URL}/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
          })

          const data = await res.json()

          console.log('res :==> ', data)

          if (res.status === 401) {
            throw new Error(data.message || 'Unauthorized')
          }

          if (res.status === 200) {
            /*
             * Remove sensitive information like passwords from the user object
             * before returning it to NextAuth.
             */
            const { password, ...userWithoutPassword } = data

            return userWithoutPassword
          }

          return null
        } catch (error: any) {
          throw new Error(error.message)
        }
      }
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    })
  ],

  // ** Session configuration
  session: {
    strategy: 'jwt', // Use JSON Web Tokens for session management
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },

  // ** Custom pages
  pages: {
    signIn: '/login' // Custom login page
  },

  // ** Callbacks
  callbacks: {
    async jwt({ token, user }) {
      // Add user information to the JWT token
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email // Add custom fields as needed
      }

      return token
    },

    async session({ session, token }) {
      // Make the token fields available in the session
      if (session.user) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.email = token.email as string // Add custom fields as needed
      }

      return session
    }
  }
}
