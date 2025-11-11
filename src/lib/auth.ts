import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { AuthService } from '../services/api/auth'
import type { User } from './types'
import axios from 'axios'

// Variable temporal para almacenar los tokens del login con Google
let googleAuthData: { accessToken: string; refreshToken: string; user: User } | null = null

// Extendemos los tipos de NextAuth para incluir nuestros campos personalizados
declare module 'next-auth' {
  interface Session {
    user: User// ✅ todo el usuario menos la foto
    accessToken: string
    refreshToken: string
    error?: string
  }

  interface JWT {
    user: Omit<User, 'profilePhoto'>
    accessToken: string
    refreshToken: string
    accessTokenExpires: number
    error?: string
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    // 🔹 Login con credenciales (email + password)
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) return null

          const authResponse = await AuthService.login({
            email: credentials.email,
            password: credentials.password,
          })

          if (authResponse.user) {
            return {
              ...authResponse.user,
              accessToken: authResponse.accessToken,
              refreshToken: authResponse.refreshToken,
            }
          }

          return null
        } catch (error) {
          console.error('Login error:', error)
          return null
        }
      },
    }),

    // 🔹 Login con Google
     GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],

  pages: {
    signIn: '/login',
    error: '/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 horas
  },

  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },

  callbacks: {
    // 🔹 Sign-in con Google
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const googleUser = {
          email: user.email!,
          firstName: user.name?.split(' ')[0] || '',
          lastName: user.name?.split(' ').slice(1).join(' ') || '',
        }

        try {
          const data = await AuthService.loginWithGoogle(googleUser)
          googleAuthData = {
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            user: data.user,
          }

          console.log('🔹 Respuesta del backend en loginWithGoogle:', data)

          return true
        } catch (error: any) {
          console.error('Error en signIn con Google:', error)

          if (axios.isAxiosError(error) && error.response?.status === 401) {
            const email = encodeURIComponent(user.email || '')
            const firstName = encodeURIComponent(user.name?.split(' ')[0] || '')
            const lastName = encodeURIComponent(user.name?.split(' ').slice(1).join(' ') || '')
            return `/register?error=not-registered&email=${email}&firstName=${firstName}&lastName=${lastName}`
          }

          return false
        }
      }

      return true
    },

    async jwt({ token, user, account }) {
  // ✅ Si tenemos datos de GoogleAuth listos, los usamos directamente
  if (googleAuthData) {
    token.accessToken = googleAuthData.accessToken
    token.refreshToken = googleAuthData.refreshToken
    token.user = googleAuthData.user
    googleAuthData = null // limpiamos
    return token
  }

  // 🔹 Login con credenciales
  if (account && account.provider === 'credentials' && user) {
    const { accessToken, refreshToken, ...safeUser } = user as any
    return {
      user: safeUser,
      accessToken,
      refreshToken,
      accessTokenExpires: Date.now() + 24 * 60 * 60 * 1000,
    }
  }

  // 🔹 Si ya existe un token válido, lo mantenemos
  if (Date.now() < (token as any).accessTokenExpires) return token

  // 🔹 Token expirado → renovar
  try {
    const refreshedTokens = await AuthService.refreshToken((token as any).refreshToken)

    let safeUser = token.user
    if (refreshedTokens.user) {
      const { profilePhoto, ...rest } = refreshedTokens.user
      safeUser = rest
    }

    return {
      ...token,
      user: safeUser,
      accessToken: refreshedTokens.accessToken,
      refreshToken: refreshedTokens.refreshToken,
      accessTokenExpires: Date.now() + 24 * 60 * 60 * 1000,
    }

  } catch (error) {
    console.error('Token refresh failed:', error)
    return { ...token, error: 'RefreshAccessTokenError' }
  }
},

    // 🔹 Lo que llega al frontend
    async session({ session, token }) {
      session.accessToken = token.accessToken as string
      session.refreshToken = token.refreshToken as string
      session.user = token.user as User
      return session
    },
  },

  events: {
    async signOut() {
      try {
        await AuthService.logout()
      } catch (error) {
        console.error('Logout error:', error)
      }
    },
  },

  debug: false,
}
