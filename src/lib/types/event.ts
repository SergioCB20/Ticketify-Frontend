import type { OrganizerInfo } from './user'

// Tipos de eventos
export type EventStatus = 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED'

export interface Category {
  id: string
  name: string
  description: string | null
  slug: string
  icon: string | null
  color: string | null
  imageUrl: string | null
  metaTitle: string | null
  metaDescription: string | null
  parentId: string | null
  sortOrder: number
  level: number
  isActive: boolean
  isFeatured: boolean
  eventCount: number
  createdAt: string
  updatedAt: string
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
  photoUrl: string
  organizerId: string
  category?: {          // ← ESTA ES LA QUE TU UI NECESITA
    id: string
    name: string
  }
  availableTickets: number
  isSoldOut: boolean
  createdAt: string
  updatedAt: string
  minPrice?: number
  maxPrice?: number
  categoryId?: string | null
}

// EventDetail incluye la info completa del organizador y categoría
export interface EventDetail extends Event {
  organizer?: OrganizerInfo
  category?: Category
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
  ticketTypes?: any[]
}

// Representa la respuesta de lista del backend
export interface PaginatedEvents {
  events: Event[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Filtros de búsqueda de eventos
export interface EventSearchFilters {
  query?: string           // Búsqueda por texto (título, descripción)
  categories?: string      // Slugs de categorías separadas por comas
  min_price?: number
  max_price?: number
  start_date?: string | Date
  end_date?: string | Date
  location?: string        // Búsqueda por ciudad/región
  venue?: string           // Búsqueda por nombre del local
  status?: EventStatus
  organizer_id?: string    // Filtrar por un organizador específico
}
