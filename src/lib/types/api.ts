// Tipos comunes de respuesta de API
export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  errors?: Record<string, string[]>
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  status?: number
}

export interface MessageResponse {
  message: string
  success: boolean
}

// Tipos de paginación
export interface PaginatedResponse<T> {
  data: T[]
  totalItems: number
  totalPages: number
  currentPage: number
  itemsPerPage: number
}

// Tipos auxiliares
export type ID = string
export type Timestamp = string
export type ImageUrl = string
