import api, { handleApiError } from '../../lib/api'

// 🔹 Tipos base
export interface EventCreateData {
  title: string
  description?: string
  startDate: string
  endDate: string
  venue: string
  totalCapacity: number
  multimedia?: string[]
  category_id?: string
}

export interface EventUpdateData {
  title?: string
  description?: string
  startDate?: string
  endDate?: string
  venue?: string
  totalCapacity?: number
  multimedia?: string[]
  category_id?: string
}

export interface EventResponse {
  id: string
  title: string
  description?: string
  startDate: string
  endDate: string
  venue: string
  totalCapacity: number
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED'
  multimedia: string[]
  availableTickets: number
  isSoldOut: boolean
  organizerId: string
  categoryId?: string
  createdAt: string
  updatedAt: string
  // ✅ campos adicionales
  minPrice?: number
  maxPrice?: number
  ticket_types?: any[]
}

export interface EventListResponse {
  events: EventResponse[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface EventFilters {
  page?: number
  page_size?: number
  status?: string
  category_id?: string
  organizer_id?: string
  search?: string
  start_date_from?: string
  start_date_to?: string
}

/* ============================================================
 🧩 Implementación estilo "Service" con funciones agrupadas
============================================================ */


export const EventService = {
  // ✅ Crear un evento
  async create(eventData: any) {
    try {
      const response = await api.post('/events/', eventData)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // ✅ Crear evento con tipos de ticket
  async createWithTicketTypes(data: any) {
    try {
      const event = await this.create(data.event)
      const response = await api.post('/ticket-types/batch', {
        eventId: event.id,
        ticketTypes: data.ticketTypes
      })
      return { event, ticketTypes: response.data }
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // ✅ Obtener todos los eventos activos (publicados)
  async getActiveEvents(page = 1, pageSize = 10) {
    try {
      const response = await api.get('/events/', {
        params: { status: 'PUBLISHED', page, page_size: pageSize }
      })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // ✅ Obtener eventos próximos
  async getUpcoming(page = 1, pageSize = 10) {
    try {
      const response = await api.get('/events/upcoming', {
        params: { page, page_size: pageSize }
      })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // ✅ Obtener eventos destacados
  async getFeatured(limit = 6) {
    try {
      const response = await api.get('/events/featured', {
        params: { limit }
      })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // ✅ Buscar eventos
  async search(searchTerm: string, page = 1, pageSize = 10) {
    try {
      const response = await api.get('/events/search', {
        params: { q: searchTerm, page, page_size: pageSize }
      })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // ✅ Obtener evento por ID
  async getEventById(eventId: string) {
    try {
      const response = await api.get(`/events/${eventId}`)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // ✅ Obtener eventos del usuario autenticado
  async getMyEvents(page = 1, pageSize = 10) {
    try {
      const response = await api.get('/events/my-events', {
        params: { page, page_size: pageSize }
      })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // ✅ Actualizar un evento
  async update(eventId: string, eventData: any) {
    try {
      const response = await api.put(`/events/${eventId}`, eventData)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // ✅ Cambiar estado del evento
  async updateStatus(eventId: string, status: string) {
    try {
      const response = await api.patch(`/events/${eventId}/status`, { status })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // ✅ Publicar evento
  async publish(eventId: string) {
    return this.updateStatus(eventId, 'PUBLISHED')
  },

  // ✅ Cancelar evento
  async cancel(eventId: string) {
    return this.updateStatus(eventId, 'CANCELLED')
  },

  // ✅ Eliminar evento
  async delete(eventId: string) {
    try {
      await api.delete(`/events/${eventId}`)
    } catch (error) {
      throw handleApiError(error)
    }
  }
}
