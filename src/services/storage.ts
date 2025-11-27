// LocalStorage helpers para manejar tokens y datos de sesión

const TOKEN_KEY = 'ticketify_access_token'
const REFRESH_TOKEN_KEY = 'ticketify_refresh_token'
const USER_KEY = 'ticketify_user'

// Helper para verificar si localStorage está disponible
const isLocalStorageAvailable = (): boolean => {
  try {
    if (typeof window === 'undefined') return false
    const test = '__test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch (error) {
    console.error('⚠️ localStorage not available:', error)
    return false
  }
}

export class StorageService {
  // ACCESS TOKEN ------------------------------
  static setAccessToken(token: string): void {
    try {
      if (isLocalStorageAvailable()) {
        localStorage.setItem(TOKEN_KEY, token)
        console.log('✅ StorageService - Access token saved')
      }
    } catch (error) {
      console.error('❌ Error setting access token:', error)
    }
  }

  static getAccessToken(): string | null {
    try {
      if (isLocalStorageAvailable()) {
        return localStorage.getItem(TOKEN_KEY)
      }
    } catch (error) {
      console.error('❌ Error getting access token:', error)
    }
    return null
  }

  // REFRESH TOKEN ------------------------------
  static setRefreshToken(token: string): void {
    try {
      if (isLocalStorageAvailable()) {
        localStorage.setItem(REFRESH_TOKEN_KEY, token)
        console.log('✅ StorageService - Refresh token saved')
      }
    } catch (error) {
      console.error('❌ Error setting refresh token:', error)
    }
  }

  static getRefreshToken(): string | null {
    try {
      if (isLocalStorageAvailable()) {
        return localStorage.getItem(REFRESH_TOKEN_KEY)
      }
    } catch (error) {
      console.error('❌ Error getting refresh token:', error)
    }
    return null
  }

  // TOKENS ------------------------------
  static clearTokens(): void {
    try {
      if (isLocalStorageAvailable()) {
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(REFRESH_TOKEN_KEY)
        console.log('🗑️ StorageService - Tokens removed')
      }
    } catch (error) {
      console.error('❌ Error removing tokens:', error)
    }
  }

  // USER ------------------------------
  static setUser(user: any): void {
    try {
      console.log('👤 StorageService - Setting user:', user)
      if (isLocalStorageAvailable()) {
        const userString = JSON.stringify(user)
        localStorage.setItem(USER_KEY, userString)
        console.log('✅ StorageService - User saved:', userString)
      }
    } catch (error) {
      console.error('❌ Error setting user:', error)
    }
  }

  static getUser<T>(): T | null {
    try {
      if (!isLocalStorageAvailable()) return null

      const stored = localStorage.getItem(USER_KEY)
      if (!stored) {
        console.log('⚠️ StorageService - No user data in localStorage')
        return null
      }

      const parsed = JSON.parse(stored)
      // soporta estructura `{ user: {...} }`
      return (parsed.user || parsed) as T
    } catch (error) {
      console.error('❌ Error getting user:', error)
      return null
    }
  }

  static removeUser(): void {
    try {
      if (isLocalStorageAvailable()) {
        localStorage.removeItem(USER_KEY)
        console.log('🗑️ StorageService - User removed')
      }
    } catch (error) {
      console.error('❌ Error removing user:', error)
    }
  }

  // CLEAR ALL ------------------------------
  static clearAll(): void {
    console.log('🗑️ StorageService - Clearing ALL data')
    this.clearTokens()
    this.removeUser()
  }
}
