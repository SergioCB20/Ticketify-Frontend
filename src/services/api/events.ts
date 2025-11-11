import api, { handleApiError } from '../../lib/api'

// Types
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

/**
 * Create a new event
 */
export const createEvent = async (eventData: EventCreateData): Promise<EventResponse> => {
  try {
    const response = await api.post<EventResponse>('/events/', eventData)
    return response.data
  } catch (error) {
    throw handleApiError(error)
  }
}

/**
 * Create event with ticket types
 */
export const createEventWithTicketTypes = async (
  data: EventWithTicketTypesData
): Promise<{ event: EventResponse; ticketTypes: any[] }> => {
  try {
    // Crear el evento
    const event = await createEvent(data.event)
    
    // Crear los tipos de entrada en batch
    const response = await api.post<any[]>('/ticket-types/batch', {
      eventId: event.id,
      ticketTypes: data.ticketTypes
    })

    return { event, ticketTypes: response.data }
  } catch (error) {
    throw handleApiError(error)
  }
}

/**
 * Get list of events with filters
 */
export const getEvents = async (filters?: EventFilters): Promise<EventListResponse> => {
  try {
    const response = await api.get<EventListResponse>('/events/', { params: filters })
    return response.data
  } catch (error) {
    throw handleApiError(error)
  }
}

/**
 * Get event by ID
 */
export const getEventById = async (eventId: string): Promise<EventResponse> => {
  try {
    const response = await api.get<EventResponse>(`/events/${eventId}`)
    return response.data
  } catch (error) {
    throw handleApiError(error)
  }
}

/**
 * Get upcoming events
 */
export const getUpcomingEvents = async (page = 1, pageSize = 10): Promise<EventListResponse> => {
  try {
    const response = await api.get<EventListResponse>('/events/upcoming', {
      params: { page, page_size: pageSize }
    })
    return response.data
  } catch (error) {
    throw handleApiError(error)
  }
}

/**
 * Get featured events
 */
export const getFeaturedEvents = async (limit = 6): Promise<EventResponse[]> => {
  try {
    const response = await api.get<EventResponse[]>('/events/featured', {
      params: { limit }
    })
    return response.data
  } catch (error) {
    throw handleApiError(error)
  }
}

/**
 * Get my events (requires authentication)
 */
export const getMyEvents = async (page = 1, pageSize = 10): Promise<EventListResponse> => {
  try {
    const response = await api.get<EventListResponse>('/events/my-events', {
      params: { page, page_size: pageSize }
    })
    return response.data
  } catch (error) {
    throw handleApiError(error)
  }
}

/**
 * Search events
 */
export const searchEvents = async (searchTerm: string, page = 1, pageSize = 10): Promise<EventListResponse> => {
  try {
    const response = await api.get<EventListResponse>('/events/search', {
      params: { q: searchTerm, page, page_size: pageSize }
    })
    return response.data
  } catch (error) {
    throw handleApiError(error)
  }
}

/**
 * Update event (requires authentication)
 */
export const updateEvent = async (eventId: string, eventData: EventUpdateData): Promise<EventResponse> => {
  try {
    const response = await api.put<EventResponse>(`/events/${eventId}`, eventData)
    return response.data
  } catch (error) {
    throw handleApiError(error)
  }
}

/**
 * Update event status (requires authentication)
 */
export const updateEventStatus = async (eventId: string, status: string): Promise<EventResponse> => {
  try {
    const response = await api.patch<EventResponse>(`/events/${eventId}/status`, { status })
    return response.data
  } catch (error) {
    throw handleApiError(error)
  }
}

/**
 * Delete event (requires authentication)
 */
export const deleteEvent = async (eventId: string): Promise<void> => {
  try {
    await api.delete(`/events/${eventId}`)
  } catch (error) {
    throw handleApiError(error)
  }
}

/**
 * Publish event
 */
export const publishEvent = async (eventId: string): Promise<EventResponse> => {
  return updateEventStatus(eventId, 'PUBLISHED')
}

/**
 * Cancel event
 */
export const cancelEvent = async (eventId: string): Promise<EventResponse> => {
  return updateEventStatus(eventId, 'CANCELLED')
}
