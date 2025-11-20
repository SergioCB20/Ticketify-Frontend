import api, { handleApiError } from '../../lib/api'

export interface MercadoPagoStatus {
  isConnected: boolean
  email: string | null
  connectedAt: string | null
  tokenExpired: boolean | null
}

export interface MercadoPagoConnectResponse {
  message: string
  success: boolean
}

export class MercadoPagoService {
  /**
   * Obtener el estado de conexión de MercadoPago del usuario actual
   */
  static async getStatus(): Promise<MercadoPagoStatus> {
    try {
      const response = await api.get<MercadoPagoStatus>('/mercadopago/status')
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  static async connect(): Promise<void> {
    try {
      // 1. Pedimos la URL al backend (enviando el token automáticamente por api instance)
      const response = await api.get<{ url: string }>('/mercadopago/connect')
      
      // 2. Redirigimos al usuario a Mercado Pago
      window.location.href = response.data.url
    } catch (error) {
      throw handleApiError(error)
    }
  }

  /**
   * Desvincula la cuenta de MercadoPago
   */
  static async disconnect(): Promise<MercadoPagoConnectResponse> {
    try {
      const response = await api.delete<MercadoPagoConnectResponse>('/mercadopago/disconnect')
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  /**
   * Refrescar el access token expirado usando el refresh token
   */
  static async refreshAccessToken(): Promise<void> {
    try {
      await api.post('/mercadopago/refresh-token')
    } catch (error) {
      throw handleApiError(error)
    }
  }
}
