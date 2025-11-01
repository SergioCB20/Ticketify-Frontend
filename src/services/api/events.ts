import api, { handleApiError } from '../../lib/api'
import type {
  Event,
  EventDetail,
  EventCreate,
  EventUpdate,
  PaginatedEvents,
  EventStatus,
} from '../../lib/types'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

/**
 * Define los filtros de búsqueda para el endpoint unificado GET /events/
 * Combina los filtros de v1 (search) y v2 (getEvents).
 */
export interface EventSearchFilters {
  query?: string
  categories?: string // Comma-separated slugs (como en v1)
  min_price?: number
  max_price?: number
  start_date?: string | Date
  end_date?: string | Date
  location?: string
  venue?: string
  status?: EventStatus
  organizer_id?: string
}


// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('ticketify_access_token')
  console.log(token)
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  }
}

// API Functions

/**
 * Create a new event
 */
export const createEvent = async (eventData: EventCreate): Promise<Event> => {
  const response = await fetch(`${API_URL}/events/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(eventData)
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'Error al crear el evento')
  }

  return response.json()
}

export class EventService {
    
  static async getAllByUser(userId: string) {
    const res = await api.get(`/events/${userId}`)
    return res.data
  }

   static async getPromotions(eventId: string) {
    const res = await api.get(`/events/${eventId}/promotions`)
    return res.data
  }
   static async createPromotion(data: any) {
    const res = await api.post('/promotions', data)
    return res.data
  } 
  static async updatePromotion(id: string, data: any) {
    const res = await api.put(`/promotions/${id}`, data)
    return res.data
  }
  static async deletePromotion(id: string) {
    const res = await api.delete(`/promotions/${id}`)
    return res.data
  }

  // ============= OBTENER / BUSCAR EVENTOS (MÉTODO UNIFICADO) =============

  /**
   * Busca y filtra eventos con paginación.
   * Este método unificado reemplaza a getEvents y searchEvents de ambas versiones.
   * Coincide con el endpoint unificado GET /events/ del backend.
   */
  static async searchEvents(
    filters: EventSearchFilters = {},
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedEvents> {
    try {
      // Construye los parámetros de consulta dinámicamente
      const params: any = {
        page: page,
        page_size: pageSize,
        ...filters,
      }

      // Limpia claves con valores nulos o indefinidos
      Object.keys(params).forEach(
        (key) => (params[key] == null || params[key] === '') && delete params[key]
      )

      // Convierte fechas a string ISO si es necesario
      if (params.start_date instanceof Date) {
        params.start_date = params.start_date.toISOString()
      }
      if (params.end_date instanceof Date) {
        params.end_date = params.end_date.toISOString()
      }

      const response = await api.get<PaginatedEvents>('/events/', { params })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // ============= OBTENER EVENTO POR ID =============

  static async getEventById(eventId: string): Promise<EventDetail> {
    try {
      const response = await api.get<EventDetail>(`/events/${eventId}`)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // ============= OBTENER EVENTOS POR ORGANIZADOR =============

  /**
   * Wrapper conveniente que usa searchEvents para filtrar por organizador.
   */
  static async getEventsByOrganizer(
    organizerId: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedEvents> {
    return this.searchEvents(
      { organizer_id: organizerId, status: undefined }, // Incluir borradores, etc.
      page,
      pageSize
    )
  }

  // ============= CREAR EVENTO =============

  static async createEvent(data: EventCreate): Promise<Event> {
    try {
      const response = await api.post<Event>('/events/', data)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // ============= ACTUALIZAR EVENTO =============

  static async updateEvent(
    eventId: string,
    data: EventUpdate
  ): Promise<Event> {
    try {
      const response = await api.put<Event>(`/events/${eventId}`, data)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }



  // ============= ELIMINAR EVENTO =============

  static async deleteEvent(eventId: string): Promise<void> {
    try {
      await api.delete(`/events/${eventId}`)
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // ============= MÉTODOS DE CAMBIO DE ESTADO (v2) =============

  /**
   * Método base para cambiar el estado, ahora usa los endpoints
   * de acción explícitos del backend (ej. /publish, /cancel).
   */
  private static async postEventAction(
    eventId: string,
    action: 'publish' | 'cancel' | 'draft' | 'complete'
  ): Promise<Event> {
    try {
      const response = await api.post<Event>(`/events/${eventId}/${action}`)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  /**
   * Publicar un evento (DRAFT -> PUBLISHED)
   */
  static async publishEvent(eventId: string): Promise<Event> {
    return this.postEventAction(eventId, 'publish')
  }

  /**
   * Cancelar un evento
   */
  static async cancelEvent(eventId: string): Promise<Event> {
    return this.postEventAction(eventId, 'cancel')
  }

    /**
     * Marcar un evento como borrador (PUBLISHED -> DRAFT)
     * Nota: Usar con precaución, ya que puede afectar a los tickets vendidos.
     * El backend puede tener restricciones adicionales.
     * */
    static async markEventAsDraft(eventId: string): Promise<Event> {
        return this.postEventAction(eventId, 'draft')
    }
    /**
     * Marcar un evento como completado (PUBLISHED -> COMPLETED)
     * */
    static async completeEvent(eventId: string): Promise<Event> {
        return this.postEventAction(eventId, 'complete')
    }
}