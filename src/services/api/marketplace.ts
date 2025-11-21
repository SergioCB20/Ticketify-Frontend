import api, { handleApiError } from '@/lib/api'
import type { MarketplaceListing, CreateListingData } from '@/lib/types'

type PaginatedListings = {
  items: MarketplaceListing[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface MarketplacePurchaseRequest {
  // Puedes agregar campos adicionales si es necesario
}

export interface MarketplacePurchaseResponse {
  listingId: string
  initPoint: string
  preferenceId: string
}

const BASE_URL = '/marketplace'

export class MarketplaceService {
  
  /**
   * Obtener una lista paginada de todos los listados ACTIVOS
   */
  static async getListings(
    page: number = 1,
    pageSize: number = 12,
    search?: string,
    minPrice?: number,
    maxPrice?: number,
    orderBy?: string
  ): Promise<PaginatedListings> {
    try {
      const params: any = { page, page_size: pageSize }
      if (search) params.search = search
      if (minPrice !== undefined) params.min_price = minPrice
      if (maxPrice !== undefined) params.max_price = maxPrice
      if (orderBy) params.order_by = orderBy
      
      const response = await api.get<PaginatedListings>(`${BASE_URL}/listings`, { params })
      
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }
  /**
   * Obtener el detalle de un listado específico
   */
  static async getListingById(listingId: string) {
    try {
      if (!listingId || listingId === 'undefined') {
        throw new Error('ID de listado inválido')
      }
      
      const response = await api.get(`${BASE_URL}/listings/${listingId}`)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  /**
   * Crear un nuevo listado en el marketplace
   */
  static async createListing(data: CreateListingData): Promise<MarketplaceListing> {
    try {
      const response = await api.post<MarketplaceListing>(`${BASE_URL}/listings`, data)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  /**
   * Crear preferencia de pago para comprar un ticket del marketplace
   */
  static async createMarketplacePurchase(
    listingId: string,
    data: MarketplacePurchaseRequest
  ): Promise<MarketplacePurchaseResponse> {
    try {
      if (!listingId || listingId === 'undefined') {
        throw new Error('ID de listado inválido')
      }

      console.log('Creando preferencia de pago para listing:', listingId)
      
      const response = await api.post<MarketplacePurchaseResponse>(
        `${BASE_URL}/listings/${listingId}/create-preference`,
        data
      )
      
      console.log('Respuesta de create-preference:', response.data)
      
      // Validar que la respuesta tenga los campos requeridos
      if (!response.data.initPoint) {
        throw new Error('La respuesta del servidor no incluye la URL de pago')
      }
      
      return response.data
    } catch (error: any) {
      console.error('Error en createMarketplacePurchase:', error)
      
      // Mejorar el manejo de errores
      if (error.response?.data?.detail) {
        const detail = error.response.data.detail
        
        // Si es un array de errores de validación de Pydantic
        if (Array.isArray(detail)) {
          const errorMessages = detail.map((err: any) => {
            if (err.msg) return err.msg
            if (err.message) return err.message
            return 'Error de validación'
          }).join(', ')
          
          throw new Error(errorMessages)
        }
        
        // Si es un string
        if (typeof detail === 'string') {
          throw new Error(detail)
        }
      }
      
      throw handleApiError(error)
    }
  }

  /**
   * Cancelar/retirar un listing del marketplace
   */
  static async cancelListing(listingId: string): Promise<void> {
    try {
      await api.delete(`${BASE_URL}/listings/${listingId}`)
    } catch (error) {
      throw handleApiError(error)
    }
  }
}
