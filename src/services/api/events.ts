import api, { handleApiError } from '../../lib/api'

// ============================================================
// Tipos base
// ============================================================
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

// Respuesta del backend original
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
  minPrice?: number
  maxPrice?: number
  ticket_types?: any[]
}

// Respuesta optimizada para /my-events
export interface OrganizerEventResponse {
  id: string
  title: string
  date: string
  location: string
  totalTickets: number
  soldTickets: number
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED'
  imageUrl?: string
}

export interface EventWithTicketTypesData {
  event: EventCreateData
  ticketTypes: Array<{
    name: string
    description?: string
    price: number
    quantity: number
    maxPerPurchase?: number
    salesStartDate?: string
    salesEndDate?: string
  }>
}

// ============================================================
// EVENT SERVICE COMPLETO → 100% compatible con tu frontend actual
// ============================================================
export const EventService = {
  // Crear evento simple
  async createEvent(eventData: EventCreateData) {
    try {
      const { data } = await api.post('/events/', eventData)
      return data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Crear evento + ticket types
  async createEventWithTicketTypes(data: EventWithTicketTypesData) {
    try {
      // Crear el evento
      const event = await EventService.createEvent(data.event)
      
      // Crear los tipos de entrada en batch
      const response = await api.post<any[]>('/ticket-types/batch', {
        eventId: event.id,
        ticketTypes: data.ticketTypes
      })

      return { event, ticketTypes: response.data }
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // =======================
  // GETTERS
  // =======================

  // Obtener detalle por ID
  async getEventById(eventId: string) {
    try {
      const { data } = await api.get(`/events/${eventId}`)
      return data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Mis eventos (OrganizerEventResponse[])
  async getMyEvents() {
    try {
      const { data } = await api.get('/events/my-events')
      return data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // =======================
  // UPDATE EVENT
  // =======================
  async updateEvent(eventId: string, eventData: EventUpdateData) {
    try {
      const { data } = await api.put(`/events/${eventId}`, eventData)
      return data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  async updateEventStatus(eventId: string, status: string): Promise<EventResponse> {
    try {
      const response = await api.patch<EventResponse>(`/events/${eventId}/status`, { status })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  async uploadEventPhoto (eventId: string, photoFile: File): Promise<EventResponse> {
    try {
      const formData = new FormData()
      formData.append('photo', photoFile)
      
      const response = await api.post<EventResponse>(`/events/${eventId}/upload-photo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // =======================
  // STATUS MANAGEMENT
  // =======================
  async publishEvent(eventId: string) {
    try {
      const { data } = await api.patch(`/events/${eventId}/status`, {
        status: 'PUBLISHED'
      })
      return data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  async cancelEvent(eventId: string) {
    try {
      const { data } = await api.patch(`/events/${eventId}/status`, {
        status: 'CANCELLED'
      })
      return data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  async markEventAsDraft(eventId: string) {
    try {
      const { data } = await api.patch(`/events/${eventId}/status`, {
        status: 'DRAFT'
      })
      return data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  async completeEvent(eventId: string) {
    try {
      const { data } = await api.patch(`/events/${eventId}/status`, {
        status: 'COMPLETED'
      })
      return data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // =======================
  // DELETE EVENT
  // =======================
  async deleteEvent(eventId: string) {
    try {
      const { data } = await api.delete(`/events/${eventId}`)
      return data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // =======================
  // EXTRAS OPCIONALES DEL MAIN
  // =======================
  async getActiveEvents(page = 1, pageSize = 10) {
    try {
      const { data } = await api.get('/events/', {
        params: { status: 'PUBLISHED', page, page_size: pageSize }
      })
      return data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  async getFeatured(limit = 6) {
    try {
      const { data } = await api.get('/events/featured', {
        params: { limit }
      })
      return data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  async search(searchTerm: string, page = 1, pageSize = 10) {
    try {
      const { data } = await api.get('/events/search', {
        params: { q: searchTerm, page, page_size: pageSize }
      })
      return data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  async getAllByUser(userId: string) {
    try {
      const response = await api.get(`/events/by-organizer/${userId}`)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

}
