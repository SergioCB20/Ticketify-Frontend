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
  
  // Integración con NextAuth
  const { data: session, status } = useSession()

  // Sincronizar estado con NextAuth y localStorage
  useEffect(() => {
    syncAuthState()
  }, [session, status])

  const syncAuthState = async () => {
    console.log('useAuth - Syncing state, NextAuth status:', status)
    
    // Primero revisar localStorage (login tradicional)
    const localToken = StorageService.getAccessToken()
    const localUser = StorageService.getUser<User>()
    
    console.log('useAuth - localStorage check:', {
      hasToken: !!localToken,
      hasUser: !!localUser,
      userComplete: localUser ? !!(localUser.firstName && localUser.lastName) : false
    })

    // Si hay datos en localStorage (login tradicional), usarlos
    if (localToken && localUser) {
      // Verificar si el usuario está completo
      if (localUser.firstName && localUser.lastName) {
        console.log('useAuth - Using complete user from localStorage')
        setUser(localUser)
        setIsAuthenticated(true)
        setLoading(false)
        return
      } else {
        // Si el usuario está incompleto, intentar obtener del backend
        console.log('useAuth - User incomplete, fetching from backend')
        try {
          const fullUser = await AuthService.getProfile()
          StorageService.setUser(fullUser)
          setUser(fullUser)
          setIsAuthenticated(true)
          setLoading(false)
          return
        } catch (error) {
          console.error('useAuth - Error fetching profile:', error)
          // Si falla, usar el usuario incompleto de todos modos
          setUser(localUser)
          setIsAuthenticated(true)
          setLoading(false)
          return
        }
      }
    }
    
    // Si NextAuth tiene una sesión activa (OAuth)
    if (status === 'authenticated' && session) {
      console.log('useAuth - Using NextAuth session')
      
      // Obtener el usuario completo del localStorage (ya debería estar por AuthSyncProvider)
      const fullUser = StorageService.getUser<User>()
      
      if (fullUser && fullUser.firstName && fullUser.lastName) {
        console.log('useAuth - Complete user loaded from localStorage')
        setUser(fullUser)
        setIsAuthenticated(true)
        setLoading(false)
        return
      } else {
        // Si no hay usuario completo, el AuthSyncProvider debería estar obteniéndolo
        // Esperar un momento y revisar de nuevo
        console.log('useAuth - Waiting for AuthSyncProvider to load complete user...')
        setTimeout(() => {
          const retryUser = StorageService.getUser<User>()
          if (retryUser && retryUser.firstName) {
            setUser(retryUser)
            setIsAuthenticated(true)
          }
          setLoading(false)
        }, 500)
        return
      }
    }

    // Si no hay sesión de NextAuth ni localStorage
    if (status === 'unauthenticated') {
      console.log('useAuth - No authentication found')
      setIsAuthenticated(false)
      setUser(null)
      setLoading(false)
      return
    }

    // Si NextAuth está cargando, esperar
    if (status === 'loading') {
      console.log('useAuth - NextAuth loading...')
      setLoading(true)
    }
  }

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await AuthService.login(credentials)
      console.log('useAuth - Login successful:', response.user.email)
      setUser(response.user)
      setIsAuthenticated(true)
      return response
    } catch (error) {
      console.error('useAuth - Login error:', error)
      throw error
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      const response = await AuthService.register(userData)
      setUser(response.user)
      setIsAuthenticated(true)
      return response
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      console.log('useAuth - Logging out...')
      
      // Cerrar sesión en el backend
      await AuthService.logout()
      
      // Si hay sesión de NextAuth, cerrarla también
      if (session) {
        console.log('useAuth - Closing NextAuth session')
        await nextAuthSignOut({ redirect: false })
      }
    } catch (error) {
      console.error('Error during logout:', error)
    } finally {
      // Limpiar estado local
      setUser(null)
      setIsAuthenticated(false)
      StorageService.clearAll()
      console.log('useAuth - Logout complete')
    }
  }

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser)
    StorageService.setUser(updatedUser)
  }

  const checkAuth = () => {
    syncAuthState()
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
    session, // Exponer sesión de NextAuth si es necesaria
  }
}
