// LocalStorage helpers para manejar tokens y datos de sesión

const TOKEN_KEY = 'ticketify_access_token'
const REFRESH_TOKEN_KEY = 'ticketify_refresh_token'
const USER_KEY = 'ticketify_user'

export class StorageService {
  // Tokens
  static setAccessToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOKEN_KEY, token)
    }
  }

  static getAccessToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY)
    }
    return null
  }

  static setRefreshToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(REFRESH_TOKEN_KEY, token)
    }
  }

  static getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(REFRESH_TOKEN_KEY)
    }
    return null
  }

  static clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(TOKEN_KEY)
      localStorage.removeItem(REFRESH_TOKEN_KEY)
    }
  }

  // User data
  static setUser(user: any): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(USER_KEY, JSON.stringify(user))
    }
  }

  static getUser<T>(): T | null {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem(USER_KEY)
      return user ? JSON.parse(user) : null
    }
    return null
  }

  static removeUser(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(USER_KEY)
    }
  }

  // Clear all
  static clearAll(): void {
    this.clearTokens()
    this.removeUser()
  }
}
