// ============================================
// TICKETIFY TYPES - Punto de entrada principal
// ============================================
// Este archivo re-exporta todos los tipos desde archivos separados
// Uso: import { User, Event, AdminStats } from '@/lib/types'

// Tipos de usuarios
export * from './user'

// Tipos de autenticación
export * from './auth'

// Tipos de administración
export * from './admin'

// Tipos de eventos
export * from './event'

// Tipos de tickets
export * from './ticket'

// Tipos de marketplace
export * from './marketplace'
// Tipos de tipos de entrada (ticket types)
export * from './ticketType'

// Tipos de respuesta de la API
export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  errors?: Record<string, string[]>
}
// Tipos de promociones
export * from './promotion'

// Tipos de API y respuestas comunes
export * from './api'