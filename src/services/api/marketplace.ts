import api, { handleApiError } from '@/lib/api';
import type { PaginatedListings } from '@/lib/types';

// Asumimos que el backend tendrá un endpoint en /api/marketplace
const BASE_URL = '/marketplace'; 

export class MarketplaceService {
  
  /**
   * Obtener una lista paginada de todos los listados ACTIVOS
   */
  static async getListings(
    page: number = 1,
    pageSize: number = 12,
    search?: string
  ): Promise<PaginatedListings> {
    try {
      const params: any = { page, page_size: pageSize, status: 'ACTIVE' };
      if (search) params.search = search;
      
      // NOTA: Tendrás que crear este endpoint en tu backend
      const response = await api.get<PaginatedListings>(`${BASE_URL}/listings`, { params });
      
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  /**
   * Obtener el detalle de un listado específico
   */
  static async getListingById(listingId: string) {
    try {
      // NOTA: Tendrás que crear este endpoint en tu backend
      const response = await api.get(`${BASE_URL}/listings/${listingId}`);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}