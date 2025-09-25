import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { signIn, signOut } from 'next-auth/react'
import toast from 'react-hot-toast'
import { AuthService } from '../services/api/auth'
import type { LoginCredentials, RegisterData } from '../lib/types'

export const useAuth = () => {
  const router = useRouter()
  const queryClient = useQueryClient()

  // Mutación para login
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const result = await signIn('credentials', {
        email: credentials.email,
        password: credentials.password,
        redirect: false,
      })

      if (result?.error) {
        throw new Error('Credenciales inválidas')
      }

      return result
    },
    onSuccess: () => {
      toast.success('¡Bienvenido de vuelta!')
      router.push('/')
      router.refresh()
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Error al iniciar sesión')
    },
  })

  // Mutación para registro
  const registerMutation = useMutation({
    mutationFn: async (userData: RegisterData) => {
      return await AuthService.register(userData)
    },
    onSuccess: async (data, variables) => {
      toast.success('¡Cuenta creada exitosamente!')
      
      // Iniciar sesión automáticamente después del registro
      await signIn('credentials', {
        email: variables.email,
        password: variables.password,
        redirect: false,
      })
      
      router.push('/')
      router.refresh()
    },
    onError: (error: any) => {
      const message = error.message || 'Error al crear la cuenta'
      toast.error(message)
    },
  })

  // Mutación para logout
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await signOut({ redirect: false })
    },
    onSuccess: () => {
      queryClient.clear()
      toast.success('Sesión cerrada correctamente')
      router.push('/login')
      router.refresh()
    },
    onError: () => {
      toast.error('Error al cerrar sesión')
    },
  })

  // Mutación para cambio de contraseña
  const changePasswordMutation = useMutation({
    mutationFn: async ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string
      newPassword: string
    }) => {
      return await AuthService.changePassword(currentPassword, newPassword)
    },
    onSuccess: () => {
      toast.success('Contraseña actualizada correctamente')
    },
    onError: (error: any) => {
      const message = error.message || 'Error al cambiar la contraseña'
      toast.error(message)
    },
  })

  // Mutación para solicitar reset de contraseña
  const requestPasswordResetMutation = useMutation({
    mutationFn: async (email: string) => {
      return await AuthService.requestPasswordReset(email)
    },
    onSuccess: () => {
      toast.success('Revisa tu email para las instrucciones de reseteo')
    },
    onError: (error: any) => {
      const message = error.message || 'Error al solicitar reseteo de contraseña'
      toast.error(message)
    },
  })

  return {
    // Mutaciones
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    changePassword: changePasswordMutation.mutate,
    requestPasswordReset: requestPasswordResetMutation.mutate,
    
    // Estados de carga
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    isChangingPassword: changePasswordMutation.isPending,
    isRequestingReset: requestPasswordResetMutation.isPending,
  }
}
