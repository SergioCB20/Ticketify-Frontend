// Tipos de usuario
export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string
  documentId?: string
  profilePhoto?: string
  isActive: boolean
  createdAt: string
  lastLogin?: string
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

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  status?: number
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
