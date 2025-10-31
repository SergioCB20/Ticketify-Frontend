// Event API calls
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

// Types
export interface EventCreateData {
  title: string
  description?: string
  startDate: string // ISO format
  endDate: string // ISO format
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
export const createEvent = async (eventData: EventCreateData): Promise<EventResponse> => {
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

/**
 * Get list of events with filters
 */
export const getEvents = async (filters?: EventFilters): Promise<EventListResponse> => {
  const queryParams = new URLSearchParams()
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, value.toString())
      }
    })
  }

  const url = `${API_URL}/events/?${queryParams.toString()}`
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })

  if (!response.ok) {
    throw new Error('Error al obtener eventos')
  }

  return response.json()
}

/**
 * Get event by ID
 */
export const getEventById = async (eventId: string): Promise<EventResponse> => {
  const response = await fetch(`${API_URL}/events/${eventId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })

  if (!response.ok) {
    throw new Error('Evento no encontrado')
  }

  return response.json()
}

/**
 * Get upcoming events
 */
export const getUpcomingEvents = async (page = 1, pageSize = 10): Promise<EventListResponse> => {
  const response = await fetch(`${API_URL}/events/upcoming?page=${page}&page_size=${pageSize}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })

  if (!response.ok) {
    throw new Error('Error al obtener eventos próximos')
  }

  return response.json()
}

/**
 * Get featured events
 */
export const getFeaturedEvents = async (limit = 6): Promise<EventResponse[]> => {
  const response = await fetch(`${API_URL}/events/featured?limit=${limit}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })

  if (!response.ok) {
    throw new Error('Error al obtener eventos destacados')
  }

  return response.json()
}

/**
 * Get my events (requires authentication)
 */
export const getMyEvents = async (page = 1, pageSize = 10): Promise<EventListResponse> => {
  const response = await fetch(`${API_URL}/events/my-events?page=${page}&page_size=${pageSize}`, {
    method: 'GET',
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    throw new Error('Error al obtener tus eventos')
  }

  return response.json()
}

/**
 * Search events
 */
export const searchEvents = async (searchTerm: string, page = 1, pageSize = 10): Promise<EventListResponse> => {
  const response = await fetch(`${API_URL}/events/search?q=${encodeURIComponent(searchTerm)}&page=${page}&page_size=${pageSize}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })

  if (!response.ok) {
    throw new Error('Error al buscar eventos')
  }

  return response.json()
}

/**
 * Update event (requires authentication)
 */
export const updateEvent = async (eventId: string, eventData: EventUpdateData): Promise<EventResponse> => {
  const response = await fetch(`${API_URL}/events/${eventId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(eventData)
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'Error al actualizar el evento')
  }

  return response.json()
}

/**
 * Update event status (requires authentication)
 */
export const updateEventStatus = async (eventId: string, status: string): Promise<EventResponse> => {
  const response = await fetch(`${API_URL}/events/${eventId}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ status })
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'Error al actualizar el estado del evento')
  }

  return response.json()
}

/**
 * Delete event (requires authentication)
 */
export const deleteEvent = async (eventId: string): Promise<void> => {
  const response = await fetch(`${API_URL}/events/${eventId}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || 'Error al eliminar el evento')
  }
}

/**
 * Publish event (change status to PUBLISHED)
 */
export const publishEvent = async (eventId: string): Promise<EventResponse> => {
  return updateEventStatus(eventId, 'PUBLISHED')
}

/**
 * Cancel event (change status to CANCELLED)
 */
export const cancelEvent = async (eventId: string): Promise<EventResponse> => {
  return updateEventStatus(eventId, 'CANCELLED')
}
