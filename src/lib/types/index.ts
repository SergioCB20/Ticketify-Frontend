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
  roles?: string[]
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
  category_id?: string
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
  status?: EventStatus
}

export interface PaginatedEvents {
  events: Event[]
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

// Tipos de filtros y búsqueda de eventos
export interface EventFilters {
  category_id?: string
  status?: EventStatus
  search?: string
  start_date?: string
  end_date?: string
}
