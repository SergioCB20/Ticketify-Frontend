import type { User } from './user'

// Tipos de autenticación
export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  userType: 'ATTENDEE' | 'ORGANIZER'
  phoneNumber?: string
  documentType: 'DNI' | 'CE' | 'Pasaporte'
  documentId: string
  country: string
  city: string
  gender: 'masculino' | 'femenino' | 'otro' | 'prefiero-no-decir'
  acceptTerms: boolean
  acceptMarketing?: boolean
}

export interface ChangePasswordData {
  currentPassword: string
  newPassword: string
}

export interface ForgotPasswordData {
  email: string
}

export interface ResetPasswordData {
  token: string
  newPassword: string
}
