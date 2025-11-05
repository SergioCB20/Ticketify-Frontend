import api, { handleApiError } from '@/lib/api';
import type { MyTicket } from '@/lib/types';

// El endpoint que acabamos de crear en el backend
const BASE_URL = '/tickets'; 

export class TicketsService {
  
  /**
   * Obtener los tickets del usuario autenticado
   */
  static async getMyTickets(): Promise<MyTicket[]> {
    try {
      const response = await api.get<MyTicket[]>(`${BASE_URL}/my-tickets`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}