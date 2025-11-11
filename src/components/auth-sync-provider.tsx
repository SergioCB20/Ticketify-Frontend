'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { StorageService } from '@/services/storage'

/**
 * Componente que sincroniza automáticamente NextAuth con localStorage
 * Solo sincroniza cuando HAY sesión de NextAuth (OAuth)
 * NO interfiere con login tradicional
 */
export default function AuthSyncProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'loading') {
      return
    }

    // Solo sincronizar si hay sesión ACTIVA de NextAuth (OAuth login)
    if (status === 'authenticated' && session) {
      try {
        console.log('AuthSync - NextAuth session detected, syncing to localStorage')

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

        console.log('AuthSync - NextAuth data synced to localStorage')
      } catch (error) {
        console.error('AuthSync - Error syncing NextAuth to localStorage:', error)
      }
    }

    // IMPORTANTE: NO limpiar localStorage cuando status === 'unauthenticated'
    // porque puede haber un login tradicional activo
    // Solo NextAuth no tiene sesión, pero localStorage puede tener datos válidos
    
  }, [session, status])

  return <>{children}</>
}
