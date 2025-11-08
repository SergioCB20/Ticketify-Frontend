'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { StorageService } from '@/services/storage'

/**
 * Componente que sincroniza automáticamente NextAuth con localStorage
 * Debe estar dentro del SessionProvider
 */
export default function AuthSyncProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'loading') {
      return
    }

    // Si hay sesión activa de NextAuth, sincronizar con localStorage
    if (status === 'authenticated' && session) {
      try {
        console.log('AuthSync - Syncing session to localStorage')

        if (session.accessToken) {
          StorageService.setAccessToken(session.accessToken)
        }
        
        if (session.refreshToken) {
          StorageService.setRefreshToken(session.refreshToken)
        }
        
        // Verificar si ya existe un usuario completo en localStorage
        const existingUser = StorageService.getUser()
        if (!existingUser && session.user) {
          // Si no hay usuario, guardar info básica de la sesión
          StorageService.setUser({
            id: session.user.id,
            email: session.user.email,
            firstName: session.user.name?.split(' ')[0] || '',
            lastName: session.user.name?.split(' ').slice(1).join(' ') || '',
            profilePhoto: session.user.image,
          })
        }

        console.log('AuthSync - Data synced successfully')
      } catch (error) {
        console.error('AuthSync - Error accessing localStorage:', error)
        // Si hay error con localStorage, la app puede seguir funcionando
        // usando solo la sesión de NextAuth
      }
    }

    // Si no hay sesión, limpiar localStorage si es posible
    if (status === 'unauthenticated') {
      try {
        const hasLocalToken = StorageService.getAccessToken()
        if (!hasLocalToken) {
          StorageService.clearAll()
        }
      } catch (error) {
        console.error('AuthSync - Error clearing localStorage:', error)
      }
    }
  }, [session, status])

  return <>{children}</>
}
