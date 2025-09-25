import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { AuthService } from '../services/api/auth'
import type { User } from './types'

// Extendemos los tipos de NextAuth para incluir nuestros campos personalizados
declare module 'next-auth' {
  interface Session {
    user: User & {
      id: string
    }
    accessToken: string
    refreshToken: string
  }

  interface JWT {
    user: User
    accessToken: string
    refreshToken: string
    accessTokenExpires: number
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    // Proveedor de credenciales (email/password)
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null
          }

          const authResponse = await AuthService.login({
            email: credentials.email,
            password: credentials.password
          })

          if (authResponse.user) {
            return {
              id: authResponse.user.id,
              name: `${authResponse.user.firstName} ${authResponse.user.lastName}`,
              email: authResponse.user.email,
              image: authResponse.user.avatar,
              ...authResponse.user,
              accessToken: authResponse.accessToken,
              refreshToken: authResponse.refreshToken
            }
          }

          return null
        } catch (error) {
          console.error('Login error:', error)
          return null
        }
      }
    }),

    // Proveedor de Google (opcional)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    })
  ],

  pages: {
    signIn: '/login',
    signUp: '/register',
    error: '/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 horas
  },

  callbacks: {
    async jwt({ token, user, account }) {
      // Inicial login
      if (account && user) {
        return {
          ...token,
          user: user,
          accessToken: (user as any).accessToken,
          refreshToken: (user as any).refreshToken,
          accessTokenExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 horas
        }
      }

      // Token aún válido
      if (Date.now() < (token as any).accessTokenExpires) {
        return token
      }

      // Token expirado, intentamos renovarlo
      try {
        const refreshedTokens = await AuthService.refreshToken((token as any).refreshToken)
        
        return {
          ...token,
          user: refreshedTokens.user,
          accessToken: refreshedTokens.accessToken,
          refreshToken: refreshedTokens.refreshToken,
          accessTokenExpires: Date.now() + 24 * 60 * 60 * 1000,
        }
      } catch (error) {
        console.error('Token refresh failed:', error)
        return {
          ...token,
          error: 'RefreshAccessTokenError',
        }
      }
    },

    async session({ session, token }) {
      if (token) {
        session.user = (token as any).user
        session.accessToken = (token as any).accessToken
        session.refreshToken = (token as any).refreshToken
        
        if ((token as any).error) {
          session.error = (token as any).error
        }
      }

      return session
    },
  },

  events: {
    async signOut() {
      // Limpiar tokens del servidor al cerrar sesión
      try {
        await AuthService.logout()
      } catch (error) {
        console.error('Logout error:', error)
      }
    },
  },

  debug: process.env.NODE_ENV === 'development',
}
