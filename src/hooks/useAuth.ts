'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut as nextAuthSignOut } from 'next-auth/react'
import { AuthService } from '../services/api/auth'
import { StorageService } from '../services/storage'
import type { User, LoginCredentials, RegisterData } from '../lib/types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
  const { data: session, status } = useSession()

  // 🔹 1. Sincroniza NextAuth con localStorage en el cliente
  useEffect(() => {
    if (typeof window === 'undefined') return // prevenir ejecución en SSR

    if (status === 'authenticated' && session?.user) {
      console.log('✅ useAuth - NextAuth session active:', session.user)

      // Guardar usuario y tokens en localStorage
      StorageService.setUser(session.user)
      StorageService.setAccessToken(session.accessToken)
      StorageService.setRefreshToken(session.refreshToken)

      setUser(session.user as User)
      setIsAuthenticated(true)
      setLoading(false)
    } 
    else if (status === 'unauthenticated') {
      console.log('⚠️ useAuth - No session, clearing localStorage')
      StorageService.clearAll()
      setUser(null)
      setIsAuthenticated(false)
      setLoading(false)
    }
  }, [session, status])

  // 🔹 2. Al montar, recuperar usuario si ya estaba logeado previamente (persistencia)
  useEffect(() => {
    if (typeof window === 'undefined') return

    const storedUser = StorageService.getUser<User>()
    const hasSession = !!storedUser
    console.log('useAuth - Initial localStorage user:', storedUser)

    if (hasSession) {
      setUser(storedUser)
      setIsAuthenticated(true)
    }

    setLoading(false)
  }, [])

  // 🔹 3. Login manual (credenciales normales)
  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await AuthService.login(credentials)
      console.log('Login successful:', response)

      StorageService.setUser(response.user)
      StorageService.setAccessToken(response.accessToken)
      StorageService.setRefreshToken(response.refreshToken)

      setUser(response.user)
      setIsAuthenticated(true)
      return response
    } catch (error) {
      throw error
    }
  }

  // 🔹 4. Registro normal
  const register = async (userData: RegisterData) => {
    try {
      const response = await AuthService.register(userData)
      StorageService.setUser(response.user)
      StorageService.setAccessToken(response.accessToken)
      StorageService.setRefreshToken(response.refreshToken)

      setUser(response.user)
      setIsAuthenticated(true)
      return response
    } catch (error) {
      throw error
    }
  }

  // 🔹 5. Logout
  const logout = async () => {
    try {
      await AuthService.logout()

      // Si hay sesión de NextAuth, cerrarla también
      if (session) {
        await nextAuthSignOut({ redirect: false })
      }
    } catch (error) {
      console.error('Error during logout:', error)
    } finally {
      StorageService.clearAll()
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  // 🔹 6. Actualización local del usuario
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser)
    StorageService.setUser(updatedUser)
  }

  // 🔹 7. Forzar re-sincronización
  const checkAuth = () => {
    const storedUser = StorageService.getUser<User>()
    setIsAuthenticated(!!storedUser)
    setUser(storedUser)
  }

  return {
    user,
    loading: loading || status === 'loading',
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    checkAuth,
    session, // opcional, por si quieres acceder a tokens directamente
  }
}
