import api, { handleApiError } from '../../lib/api'
import type { 
  AuthResponse, 
  LoginCredentials, 
  RegisterData, 
  User 
} from '../../lib/types'

export class AuthService {
  // Login
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', credentials)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // Registro
  static async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', userData)
      console.log('Register response:', response.data) // Log para depuración
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // Obtener perfil del usuario
  static async getProfile(): Promise<User> {
    try {
      const response = await api.get<User>('/auth/profile')
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // Refresh token
  static async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/refresh', {
        refreshToken
      })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // Logout
  static async logout(): Promise<void> {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      // El logout puede fallar, pero no debería detener el proceso
      console.error('Error during logout:', error)
    }
  }

  // Verificar email
  static async verifyEmail(token: string): Promise<void> {
    try {
      await api.post('/auth/verify-email', { token })
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // Solicitar reset de contraseña
  static async requestPasswordReset(email: string): Promise<void> {
    try {
      await api.post('/auth/forgot-password', { email })
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // Reset de contraseña
  static async resetPassword(token: string, password: string): Promise<void> {
    try {
      await api.post('/auth/reset-password', { token, password })
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // Cambiar contraseña
  static async changePassword(
    currentPassword: string, 
    newPassword: string
  ): Promise<void> {
    try {
      await api.put('/auth/change-password', {
        currentPassword,
        newPassword
      })
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // Actualizar perfil
  static async updateProfile(userData: Partial<User>): Promise<User> {
    try {
      const response = await api.put<User>('/auth/profile', userData)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // Eliminar cuenta
  static async deleteAccount(): Promise<void> {
    try {
      await api.delete('/auth/account')
    } catch (error) {
      throw handleApiError(error)
    }
  }
}
