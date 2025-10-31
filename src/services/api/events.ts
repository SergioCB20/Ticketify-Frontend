import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export interface Event {
  id: string
  title: string
  description?: string
  startDate: string
  endDate: string
  venue: string
  totalCapacity: number
  status: string
  multimedia: string[]
  availableTickets: number
  isSoldOut: boolean
  organizerId: string
  categoryId?: string
  createdAt: string
  updatedAt: string
}

export interface EventCategory {
  id: string
  name: string
  description?: string
  slug: string
  icon?: string
  color?: string
  imageUrl?: string
  metaTitle?: string
  metaDescription?: string
  parentId?: string
  sortOrder: number
  level: number
  isActive: boolean
  isFeatured: boolean
  eventCount: number
  createdAt: string
  updatedAt: string
}

export interface SearchFilters {
  query?: string
  categories?: string[]
  min_price?: number
  max_price?: number
  start_date?: string
  end_date?: string
  location?: string
  status?: string
}

export interface PaginationParams {
  skip?: number
  limit?: number
}

class EventService {
  /**
   * Buscar eventos con filtros
   */
  async searchEvents(filters: SearchFilters, pagination?: PaginationParams): Promise<Event[]> {
    try {
      const params = new URLSearchParams()
      
      if (filters.query) params.append('query', filters.query)
      if (filters.categories && filters.categories.length > 0) {
        params.append('categories', filters.categories.join(','))
      }
      if (filters.min_price !== undefined) params.append('min_price', filters.min_price.toString())
      if (filters.max_price !== undefined) params.append('max_price', filters.max_price.toString())
      if (filters.start_date) params.append('start_date', filters.start_date)
      if (filters.end_date) params.append('end_date', filters.end_date)
      if (filters.location) params.append('location', filters.location)
      if (filters.status) params.append('status', filters.status)
      
      if (pagination?.skip !== undefined) params.append('skip', pagination.skip.toString())
      if (pagination?.limit !== undefined) params.append('limit', pagination.limit.toString())
      
      const response = await axios.get(`${API_URL}/events/search?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error('Error searching events:', error)
      throw error
    }
  }

  /**
   * Obtener todos los eventos
   */
  async getEvents(pagination?: PaginationParams): Promise<Event[]> {
    try {
      const params = new URLSearchParams()
      
      if (pagination?.skip !== undefined) params.append('skip', pagination.skip.toString())
      if (pagination?.limit !== undefined) params.append('limit', pagination.limit.toString())
      
      const response = await axios.get(`${API_URL}/events?${params.toString()}`)
      return response.data
    } catch (error) {
      console.error('Error getting events:', error)
      throw error
    }
  }

  /**
   * Obtener un evento por ID
   */
  async getEventById(eventId: string): Promise<Event> {
    try {
      const response = await axios.get(`${API_URL}/events/${eventId}`)
      return response.data
    } catch (error) {
      console.error('Error getting event:', error)
      throw error
    }
  }

  /**
   * Obtener todas las categorías
   */
  async getCategories(params?: {
    isActive?: boolean
    isFeatured?: boolean
    skip?: number
    limit?: number
  }): Promise<EventCategory[]> {
    try {
      const queryParams = new URLSearchParams()
      
      if (params?.isActive !== undefined) queryParams.append('is_active', params.isActive.toString())
      if (params?.isFeatured !== undefined) queryParams.append('is_featured', params.isFeatured.toString())
      if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString())
      if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString())
      
      const response = await axios.get(`${API_URL}/categories?${queryParams.toString()}`)
      return response.data
    } catch (error) {
      console.error('Error getting categories:', error)
      throw error
    }
  }

  /**
   * Obtener una categoría por slug
   */
  async getCategoryBySlug(slug: string): Promise<EventCategory> {
    try {
      const response = await axios.get(`${API_URL}/categories/slug/${slug}`)
      return response.data
    } catch (error) {
      console.error('Error getting category:', error)
      throw error
    }
  }
}

export const eventService = new EventService()
