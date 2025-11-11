'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { StorageService } from '@/services/storage'

/**
 * Hook para sincronizar la sesión de NextAuth con localStorage
 * Esto permite que el sistema tradicional de auth funcione con Google OAuth
 */
export function useAuthSync() {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'loading') return

    // Si hay sesión activa, sincronizar con localStorage
    if (status === 'authenticated' && session) {
      console.log('Syncing NextAuth session to localStorage:', session)
      
      // Guardar tokens en localStorage
      if (session.accessToken) {
        StorageService.setAccessToken(session.accessToken)
      }
      
      if (session.refreshToken) {
        StorageService.setRefreshToken(session.refreshToken)
      }
      
      // Guardar usuario en localStorage
      if (session.user) {
        StorageService.setUser(session.user)
      }
    }

    // Si no hay sesión, limpiar localStorage
    if (status === 'unauthenticated') {
      console.log('No session found, clearing localStorage')
      // Solo limpiar si no hay datos de login tradicional activos
      const hasLocalAuth = StorageService.getAccessToken()
      if (!hasLocalAuth) {
        StorageService.clearAll()
      }
    }
  }, [session, status])

  return {
    session,
    status,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated',
  }
}
