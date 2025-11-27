import api, { handleApiError } from '../../lib/api'
import { StorageService } from '../storage'
import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  User,
  GoogleLoginData
} from '../../lib/types'

export class AuthService {
  // Login
  static async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log('🔐 AuthService.login - Starting login with:', credentials.email)
      const response = await api.post<AuthResponse>('/auth/login', credentials)
      
      console.log('📦 AuthService.login - Backend response:', response.data)
      console.log('👤 AuthService.login - User data:', response.data.user)
      console.log('🎫 AuthService.login - Access token:', response.data.accessToken ? 'Present' : 'Missing')
      console.log('🔄 AuthService.login - Refresh token:', response.data.refreshToken ? 'Present' : 'Missing')
      
      const { user, accessToken, refreshToken } = response.data

      if (!user) {
        console.error('❌ AuthService.login - No user in response!')
        throw new Error('No user data received from server')
      }

      if (!accessToken) {
        console.error('❌ AuthService.login - No access token in response!')
        throw new Error('No access token received from server')
      }

      // Guardar tokens y usuario en localStorage
      console.log('💾 AuthService.login - Saving to localStorage...')
      StorageService.setAccessToken(accessToken)
      StorageService.setRefreshToken(refreshToken)
      StorageService.setUser(user)

      // Verificar que se guardó
      const savedToken = StorageService.getAccessToken()
      const savedUser = StorageService.getUser<User>()
      console.log('✅ AuthService.login - Verification:')
      console.log('  - Token saved:', savedToken ? 'Yes' : 'No')
      console.log('  - User saved:', savedUser ? 'Yes' : 'No')
      if (savedUser) {
        console.log('  - User ID:', savedUser.id)
        console.log('  - User email:', savedUser.email)
        console.log('  - User roles:', savedUser.roles)
      }

      return response.data
    } catch (error) {
      console.error('❌ AuthService.login - Error:', error)
      throw handleApiError(error)
    }
  }

  // Login con Google
  static async loginWithGoogle(googleData: GoogleLoginData): Promise<AuthResponse> {
    try {
      console.log('🔐 AuthService.loginWithGoogle - Starting with:', googleData)
      const response = await api.post<AuthResponse>('/auth/google/login', googleData)
      console.log('📦 AuthService.loginWithGoogle - Backend response:', response.data)

      const { user, accessToken, refreshToken } = response.data
      console.log('👤 AuthService.loginWithGoogle - User data:', user)

      // Guardar tokens y usuario en localStorage
      StorageService.setAccessToken(accessToken)
      StorageService.setRefreshToken(refreshToken)
      StorageService.setUser(user)

      console.log('✅ AuthService.loginWithGoogle - Tokens saved to localStorage')
      return response.data
    } catch (error) {
      console.error('❌ AuthService.loginWithGoogle - Error:', error)
      throw handleApiError(error)
    }
  }

  // Registro
  static async register(userData: RegisterData): Promise<AuthResponse> {
    try {
      console.log('📝 AuthService.register - Registering user:', userData.email)
      const response = await api.post<AuthResponse>('/auth/register', userData)
      const { user, accessToken, refreshToken } = response.data

      // Guardar tokens y usuario en localStorage
      StorageService.setAccessToken(accessToken)
      StorageService.setRefreshToken(refreshToken)
      StorageService.setUser(user)

      console.log('✅ AuthService.register - User registered and saved')
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
    const hasToken = !!StorageService.getAccessToken()
    console.log('🔍 AuthService.isAuthenticated:', hasToken)
    return hasToken
  }

  // Obtener usuario actual del storage
  static getCurrentUser(): User | null {
    const user = StorageService.getUser<User>()
    console.log('👤 AuthService.getCurrentUser:', user ? `User ID: ${user.id}` : 'null')
    return user
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
