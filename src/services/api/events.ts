import api, { handleApiError } from '../../lib/api'
import type {
  Event,
  EventDetail,
  EventCreate,
  EventUpdate,
  PaginatedEvents,
  EventFilters,
  EventStatus
} from '../../lib/types'

export class EventService {
  // ============= CREAR EVENTO =============
  
  static async createEvent(data: EventCreate): Promise<Event> {
    try {
      const response = await api.post<Event>('/events/', data)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // ============= OBTENER EVENTOS =============
  
  static async getEvents(
    page: number = 1,
    pageSize: number = 10,
    filters?: EventFilters
  ): Promise<PaginatedEvents> {
    try {
      const params: any = { page, page_size: pageSize }
      
      if (filters?.search) params.search = filters.search
      if (filters?.status) params.status_filter = filters.status
      if (filters?.category_id) params.category_id = filters.category_id
      if (filters?.start_date) params.start_date = filters.start_date
      if (filters?.end_date) params.end_date = filters.end_date
      
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
  
  static async getEventsByOrganizer(
    organizerId: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedEvents> {
    try {
      const params = { page, page_size: pageSize }
      const response = await api.get<PaginatedEvents>(
        `/events/organizer/${organizerId}`,
        { params }
      )
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

  // ============= ACTUALIZAR ESTADO DEL EVENTO =============
  
  static async updateEventStatus(
    eventId: string,
    status: EventStatus
  ): Promise<Event> {
    try {
      const response = await api.patch<Event>(
        `/events/${eventId}/status`,
        null,
        { params: { new_status: status } }
      )
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

  // ============= PUBLICAR EVENTO =============
  
  static async publishEvent(eventId: string): Promise<Event> {
    return this.updateEventStatus(eventId, 'PUBLISHED')
  }

  // ============= CANCELAR EVENTO =============
  
  static async cancelEvent(eventId: string): Promise<Event> {
    return this.updateEventStatus(eventId, 'CANCELLED')
  }

  // ============= COMPLETAR EVENTO =============
  
  static async completeEvent(eventId: string): Promise<Event> {
    return this.updateEventStatus(eventId, 'COMPLETED')
  }

  // ============= BUSCAR EVENTOS =============
  
  static async searchEvents(
    searchTerm: string,
    page: number = 1,
    pageSize: number = 10
  ): Promise<PaginatedEvents> {
    return this.getEvents(page, pageSize, { search: searchTerm })
  }
}
