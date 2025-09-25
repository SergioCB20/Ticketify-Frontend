// Tipos de usuario
export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  role: 'ADMIN' | 'ORGANIZER' | 'CUSTOMER'
  isActive: boolean
  avatar?: string
  createdAt: string
  updatedAt: string
}

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
  firstName: string
  lastName: string
  email: string
  password: string
}

// Tipos de eventos (para referencia futura)
export interface Event {
  id: string
  title: string
  description: string
  date: string
  location: string
  price: number
  capacity: number
  availableTickets: number
  organizerId: string
  organizer: User
  imageUrl?: string
  category: string
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED'
  createdAt: string
  updatedAt: string
}

// Tipos de tickets
export interface Ticket {
  id: string
  eventId: string
  event: Event
  userId: string
  user: User
  quantity: number
  totalPrice: number
  status: 'RESERVED' | 'PURCHASED' | 'CANCELLED'
  purchaseDate: string
  qrCode?: string
}

// Tipos de respuesta de la API
export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  errors?: Record<string, string[]>
}

// Tipos de paginación
export interface PaginatedResponse<T> {
  data: T[]
  totalItems: number
  totalPages: number
  currentPage: number
  itemsPerPage: number
}

// Tipos de filtros y búsqueda
export interface EventFilters {
  category?: string
  location?: string
  priceMin?: number
  priceMax?: number
  dateFrom?: string
  dateTo?: string
  search?: string
}
