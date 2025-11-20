import api, { handleApiError } from '@/lib/api'

const BASE_URL = '/purchases'

export interface TicketSelection {
  ticketTypeId: string
  quantity: number
}

export interface CreatePreferenceRequest {
  eventId: string
  tickets: TicketSelection[]
  promotionCode?: string | null
}

export interface CreatePreferenceResponse {
  purchaseId: string
  init_point: string
  preferenceId: string
}

export interface PurchaseDetail {
  id: string
  totalAmount: number
  subtotal: number
  taxAmount: number
  serviceFee: number
  discountAmount: number
  quantity: number
  status: string
  paymentMethod?: string
  buyerEmail: string
  purchaseDate: string
  eventId: string
  eventTitle: string
  tickets: any[]
}

export class PurchaseService {
  /**
   * Crea una preferencia de pago para comprar tickets
   */
  static async createPreference(data: CreatePreferenceRequest): Promise<CreatePreferenceResponse> {
    try {
      const response = await api.post<CreatePreferenceResponse>(`${BASE_URL}/create-preference`, data)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  /**
   * Obtiene las compras del usuario actual
   */
  static async getMyPurchases(page: number = 1, pageSize: number = 10): Promise<any> {
    try {
      const response = await api.get(`${BASE_URL}/my-purchases`, {
        params: { page, page_size: pageSize }
      })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  /**
   * Obtiene el detalle de una compra específica
   */
  static async getPurchaseDetail(purchaseId: string): Promise<PurchaseDetail> {
    try {
      const response = await api.get<PurchaseDetail>(`${BASE_URL}/my-purchases/${purchaseId}`)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }
}
