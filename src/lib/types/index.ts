// Tipos de usuario
export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  country: string
  city: string
  documentType: 'DNI' | 'CE' | 'Pasaporte'
  documentId: string
  profilePhoto?: string
  isActive: boolean
  createdAt: string
  lastLogin?: string
  roles: string[]
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

// Tipos de Admin
export interface AdminUser {
  id: string
  email: string
  firstName: string
  lastName: string
  phoneNumber?: string
  isActive: boolean
  roles: string[]
  createdAt: string
  lastLogin?: string
}

export interface PaginatedUsers {
  users: User[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface AdminStats {
  totalUsers: number
  activeUsers: number
  bannedUsers: number
  totalAdmins: number
  activeAdmins: number
  totalEvents: number
  totalTickets: number
  recentRegistrations: number
}

export interface BanUserRequest {
  isActive: boolean
  reason?: string
}

export interface UpdateAdminRoleRequest {
  role: 'SUPER_ADMIN' | 'SUPPORT_ADMIN' | 'SECURITY_ADMIN' | 'CONTENT_ADMIN'
}

// ============= TIPOS DE EVENTOS =============

export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED'

export interface OrganizerInfo {
  id: string
  firstName: string
  lastName: string
  email: string
}

export interface CategoryInfo {
  id: string
  name: string
  slug: string // Añadido para consistencia
}

export interface Event {
  id: string
  title: string
  description?: string
  startDate: string
  endDate: string
  venue: string
  totalCapacity: number
  status: EventStatus
  multimedia: string[]
  organizerId: string
  categoryId?: string
  availableTickets: number
  isSoldOut: boolean
  createdAt: string
  updatedAt: string
}

// EventDetail incluye la info completa del organizador y categoría
export interface EventDetail extends Event {
  organizer?: OrganizerInfo
  category?: CategoryInfo
}

export interface EventCreate {
  title: string
  description?: string
  startDate: string
  endDate: string
  venue: string
  totalCapacity: number
  multimedia?: string[]
  category_id?: string // El backend espera category_id
}

export interface EventUpdate {
  title?: string
  description?: string
  startDate?: string
  endDate?: string
  venue?: string
  totalCapacity?: number
  multimedia?: string[]
  category_id?: string
  status?: EventStatus // Aunque usamos /publish y /cancel, el update genérico podría permitirlo
}

// Representa la respuesta de lista del backend
export interface PaginatedEvents {
  events: Event[] // El backend devuelve una lista de Event/EventResponse
  total: number
  page: number
  pageSize: number
  totalPages: number
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

// ============= FILTROS DE BÚSQUEDA DE EVENTOS =============
// Reemplaza al antiguo 'EventFilters' para coincidir con el backend unificado

export interface EventSearchFilters {
  query?: string           // Búsqueda por texto (título, descripción)
  categories?: string      // Slugs de categorías separadas por comas
  min_price?: number
  max_price?: number
  start_date?: string | Date // Permite enviar Date desde el frontend
  end_date?: string | Date   // Permite enviar Date desde el frontend
  location?: string        // Búsqueda por ciudad/región
  venue?: string           // Búsqueda por nombre del local
  status?: EventStatus
  organizer_id?: string    // Filtrar por un organizador específico
}

export interface Promotion {
  id: string
  name: string
  description?: string
  code: string
  promotion_type: 'PERCENTAGE' | 'FIXED_AMOUNT'
  discountValue: number
  startDate: string
  endDate: string
}