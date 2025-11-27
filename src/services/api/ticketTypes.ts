import api, { handleApiError } from '@/lib/api'
import type { TicketType, TicketTypeCreate, TicketTypeUpdate } from '@/lib/types'

const BASE_URL = '/ticket-types'

export class TicketTypeService {
  /**
   * Crear múltiples tipos de entrada para un evento
   */
  static async createTicketTypes(
    eventId: string,
    ticketTypes: TicketTypeCreate[]
  ): Promise<TicketType[]> {
    try {
      const response = await api.post<TicketType[]>(
        `${BASE_URL}/batch`,
        {
          eventId,
          ticketTypes
        }
      )
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  /**
   * Obtener todos los tipos de entrada de un evento
   */
  static async getTicketTypesByEvent(eventId: string): Promise<TicketType[]> {
    try {
      const response = await api.get<TicketType[]>(
        `${BASE_URL}/event/${eventId}`
      )
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  /**
   * Obtener un tipo de entrada específico
   */
  static async getTicketTypeById(ticketTypeId: string): Promise<TicketType> {
    try {
      const response = await api.get<TicketType>(`${BASE_URL}/${ticketTypeId}`)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  /**
   * Actualizar un tipo de entrada
   */
  static async updateTicketType(
    ticketTypeId: string,
    data: TicketTypeUpdate
  ): Promise<TicketType> {
    try {
      const response = await api.put<TicketType>(
        `${BASE_URL}/${ticketTypeId}`,
        data
      )
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  /**
   * Actualizar en bloque los tipos de entrada de un evento (crear / actualizar / eliminar)
   */
  static async updateTicketTypesBatch(
    eventId: string,
    ticketTypes: {
      id?: string
      name: string
      description?: string
      price: number
      quantity: number
      maxPerPurchase?: number | null
    }[]
  ): Promise<TicketType[]> {
    try {
      const response = await api.put<TicketType[]>(
        `${BASE_URL}/event/${eventId}/batch`,
        {
          eventId,
          ticketTypes
        }
      )
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  /**
   * Eliminar un tipo de entrada
   */
  static async deleteTicketType(ticketTypeId: string): Promise<void> {
    try {
      await api.delete(`${BASE_URL}/${ticketTypeId}`)
    } catch (error) {
      throw handleApiError(error)
    }
  }

  /**
   * Activar/desactivar un tipo de entrada
   */
  static async toggleTicketTypeStatus(
    ticketTypeId: string,
    isActive: boolean
  ): Promise<TicketType> {
    try {
      const response = await api.patch<TicketType>(
        `${BASE_URL}/${ticketTypeId}/status`,
        { isActive }
      )
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }
}
