'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { StorageService } from '@/services/storage'
import { AuthService } from '@/services/api/auth'

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
      const syncSession = async () => {
        try {
          console.log('AuthSync - NextAuth session detected, syncing to localStorage')

          if (session.accessToken) {
            StorageService.setAccessToken(session.accessToken)
          }
          
          if (session.refreshToken) {
            StorageService.setRefreshToken(session.refreshToken)
          }
          
          // Verificar si ya existe un usuario completo en localStorage
          const existingUser = StorageService.getUser() as { firstName?: string; lastName?: string } | null
          
          // Si no hay usuario O el usuario está incompleto, obtener del backend
          if (!existingUser || !existingUser.firstName || !existingUser.lastName) {
            console.log('AuthSync - User incomplete or missing, fetching from backend')
            
            try {
              // Obtener el perfil completo del backend usando el token
              const fullUser = await AuthService.getProfile()
              StorageService.setUser(fullUser)
              console.log('AuthSync - Full user profile loaded from backend')
            } catch (error) {
              console.error('AuthSync - Error fetching profile from backend:', error)
              // Si falla, al menos guardar lo básico de la sesión
              // pero solo si NO hay usuario existente
              if (!existingUser && session.user) {
                const userAny = session.user as any
                StorageService.setUser({
                  id: session.user.id,
                  email: session.user.email,
                  firstName: session.user.firstName || userAny.name?.split(' ')[0] || '',
                  lastName: session.user.lastName || userAny.name?.split(' ').slice(1).join(' ') || '',
                  profilePhoto: userAny.image,
                })
              }
            }
          } else {
            console.log('AuthSync - Complete user already in localStorage')
          }

          console.log('AuthSync - NextAuth data synced to localStorage')
        } catch (error) {
          console.error('AuthSync - Error syncing NextAuth to localStorage:', error)
        }
      }

      syncSession()
    }

    // IMPORTANTE: NO limpiar localStorage cuando status === 'unauthenticated'
    // porque puede haber un login tradicional activo
    // Solo NextAuth no tiene sesión, pero localStorage puede tener datos válidos
    
  }, [session, status])

  return <>{children}</>
}
