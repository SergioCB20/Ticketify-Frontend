import api, { handleApiError } from '@/lib/api'
import type { ProcessPaymentRequest, PurchaseResponse } from '@/lib/types'

const BASE_URL = '/purchases'

export class PurchaseService {
  /**
   * Procesar compra de tickets con pago simulado
   */
  static async processPurchase(data: ProcessPaymentRequest): Promise<PurchaseResponse> {
    try {
      const response = await api.post<PurchaseResponse>(`${BASE_URL}/process`, data)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }
}
