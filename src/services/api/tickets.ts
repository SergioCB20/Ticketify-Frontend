import api, { handleApiError } from '@/lib/api';
import type { Ticket } from '@/lib/types';

// El endpoint que acabamos de crear en el backend
const BASE_URL = '/tickets'; 

export class TicketsService {
  // 🟢 Obtener tickets del usuario autenticado
  static async getMyTickets(): Promise<any[]> {
    try {
      const response = await api.get('/tickets/my-tickets')
      return response.data.items
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // 🆕 Crear ticket real (POST /tickets)
  static async createTicket(ticketData: {
    event_id: string
    ticket_type_id: string
    price: number
    promo_code?: string   // ← opcional, si se usa promoción
  }): Promise<any> {
    try {
      const response = await api.post('/tickets', ticketData)
      return response.data
    } catch (error: any) {
      console.error('❌ Error al crear ticket:', error)
      throw handleApiError(error)
    }
  }
}