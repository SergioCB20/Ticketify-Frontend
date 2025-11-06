import api, { handleApiError } from '../../lib/api'
import { StorageService } from '../storage'
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
      console.log('Logging in with credentials:', credentials)
      const response = await api.post<AuthResponse>('/auth/login', credentials)
      const { user, accessToken, refreshToken } = response.data
      
      // Guardar tokens y usuario en localStorage
      StorageService.setAccessToken(accessToken)
      StorageService.setRefreshToken(refreshToken)
      StorageService.setUser(user)
      
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // Registro
  static async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      console.log('Registering user with data:', userData)
      const response = await api.post<AuthResponse>('/auth/register', userData)
      const { user, accessToken, refreshToken } = response.data
      
      // Guardar tokens y usuario en localStorage
      StorageService.setAccessToken(accessToken)
      StorageService.setRefreshToken(refreshToken)
      StorageService.setUser(user)
      
      console.log('Register response:', response.data)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // Obtener perfil del usuario
  static async getProfile(): Promise<User> {
    try {
      const response = await api.get<User>('/auth/profile')
      // Actualizar usuario en localStorage
      StorageService.setUser(response.data)
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
      
      // Actualizar tokens
      StorageService.setAccessToken(response.data.accessToken)
      if (response.data.refreshToken) {
        StorageService.setRefreshToken(response.data.refreshToken)
      }
      
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
    } finally {
      // Siempre limpiar el storage local
      StorageService.clearAll()
    }
  }

  // Verificar si el usuario está autenticado
  static isAuthenticated(): boolean {
    return !!StorageService.getAccessToken()
  }

  // Obtener usuario actual del storage
  static getCurrentUser(): User | null {
    return StorageService.getUser<User>()
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
  static async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      await api.post('/auth/reset-password', { token, newPassword })
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
      await api.post('/auth/change-password', {
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
      // Actualizar usuario en localStorage
      StorageService.setUser(response.data)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // Subir foto de perfil (opción 1: archivo)
  static async uploadPhoto(file: File): Promise<{ photoUrl: string; message: string }> {
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await api.post<{ photoUrl: string; message: string }>(
        '/auth/upload-photo',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      
      // Actualizar usuario en localStorage con la nueva foto
      const currentUser = StorageService.getUser<User>()
      if (currentUser) {
        currentUser.profilePhoto = response.data.photoUrl
        StorageService.setUser(currentUser)
      }
      
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // Actualizar foto en perfil (opción 2: base64 en PUT)
  static async updateProfileWithPhoto(userData: Partial<User> & { profilePhoto?: string | null }): Promise<User> {
    try {
      const response = await api.put<User>('/auth/profile', userData)
      // Actualizar usuario en localStorage
      StorageService.setUser(response.data)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // Eliminar cuenta
  static async deleteAccount(): Promise<void> {
    try {
      await api.delete('/auth/account')
      // Limpiar storage
      StorageService.clearAll()
    } catch (error) {
      throw handleApiError(error)
    }
  }
}
