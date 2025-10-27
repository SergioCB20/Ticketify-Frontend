import { useState, useEffect } from 'react'
import { AuthService } from '../services/api/auth'
import type { User, LoginCredentials, RegisterData } from '../lib/types'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  // Verificar autenticación al montar el componente
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = () => {
    const authenticated = AuthService.isAuthenticated()
    const currentUser = AuthService.getCurrentUser()
    
    setIsAuthenticated(authenticated)
    setUser(currentUser)
    setLoading(false)
  }

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await AuthService.login(credentials)
      console.log('Login successful:', response)
      setUser(response.user)
      setIsAuthenticated(true)
      return response
    } catch (error) {
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
      await AuthService.logout()
      setUser(null)
      setIsAuthenticated(false)
      router.push('/login')
    } catch (error) {
      console.error('Error during logout:', error)
      // Aún así limpiar el estado local
      setUser(null)
      setIsAuthenticated(false)
      router.push('/login')
    }
  }

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser)
  }

  return {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    checkAuth,
  }
}
