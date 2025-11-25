import api, { handleApiError } from '../../lib/api'
import type { EventStatus } from '@/lib/types'

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
//Payload para actualizar tipos de ticket (incluye id opcional)
export interface TicketTypeUpdatePayload {
  id?: string
  name: string
  description?: string
  price: number
  quantity: number
  maxPerPurchase?: number | null
}

// ============================================================
// Tipos para el PANEL del organizador
// ============================================================
export interface TicketStats {
  id: string
  name: string
  price: number
  total: number
  sold: number
  reserved: number
  remaining: number
  revenue: number
}

export interface BillingSummary {
  totalRevenue: number
  platformFees: number
  netRevenue: number
  totalTicketsSold: number
  totalOrders: number
}

export interface CommunicationSummary {
  totalAttendees: number
  emailsSent: number
  lastCampaignAt?: string | null
}

export interface OrganizerEventPanelResponse {
  event: EventResponse
  ticketStats: TicketStats[]
  billing: BillingSummary
  communications: CommunicationSummary
}

export interface OrganizerEventPanelTicketStat {
  id: string
  name: string
  price: number
  total: number
  sold: number
  remaining: number
  revenue: number
}

// ============================================================
// EVENT SERVICE COMPLETO 
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
      const event = await EventService.createEvent(data.event)

      const response = await api.post<any[]>('/ticket-types/batch', {
        eventId: event.id,
        ticketTypes: data.ticketTypes
      })

      return { event, ticketTypes: response.data }
    } catch (error) {
      throw handleApiError(error)
    }
  },

  async updateTicketTypes(eventId: string, ticketTypes: TicketTypeUpdatePayload[]) {
    try {
      const { data } = await api.put(`/ticket-types/event/${eventId}/batch`, {
        eventId,
        ticketTypes,
      })
      return data
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

  // Panel del evento (para "Ver Panel")
  async getEventPanel(eventId: string): Promise<OrganizerEventPanelResponse> {
    try {
      const { data } = await api.get(`/events/${eventId}/panel`)

      // Si el backend ya devuelve { event, ticketStats, ... }
      if ((data as any).event) {
        return data as OrganizerEventPanelResponse
      }

      // Si solo devuelve el evento plano, armamos un panel básico
      const event = data as EventResponse

      const rawTicketTypes: any[] = (event as any).ticket_types ?? []

      const ticketStats: TicketStats[] = rawTicketTypes.map((t: any) => {
        const sold = t.sold_quantity ?? t.sold ?? 0
        const total =
          t.quantity_available ?? t.quantity ?? 0
        const remaining =
          t.remaining_quantity ?? Math.max(total - sold, 0)
        const price = t.price ?? 0
        const revenue = t.total_revenue ?? sold * price

        return {
          id: t.id ?? String(t.name),
          name: t.name,
          price,
          total,
          sold,
          reserved: 0,
          remaining,
          revenue
        }
      })

      const totalRevenue = ticketStats.reduce((acc, t) => acc + (t.revenue ?? 0), 0)
      const totalTicketsSold = ticketStats.reduce((acc, t) => acc + (t.sold ?? 0), 0)

      return {
        event,
        ticketStats,
        billing: {
          totalRevenue,
          platformFees: 0,
          netRevenue: totalRevenue,
          totalTicketsSold,
          totalOrders: totalTicketsSold
        },
        communications: {
          totalAttendees: totalTicketsSold,
          emailsSent: 0,
          lastCampaignAt: null
        }
      }
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

  async uploadEventPhoto(eventId: string, photoFile: File): Promise<EventResponse> {
    try {
      const formData = new FormData()
      formData.append('photo', photoFile)

      const response = await api.post<EventResponse>(`/events/${eventId}/upload-photo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
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
    const response = await api.delete(`/events/${eventId}`)
    return response.data
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
