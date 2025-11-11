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

  /**
   * Iniciar el flujo OAuth de MercadoPago
   * En desarrollo, usa el endpoint de test que acepta token por URL
   * En producción, usará el endpoint normal con autenticación en header
   */
  static getConnectUrl(accessToken: string): string {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    const isDevelopment = process.env.NODE_ENV !== 'production'
    
    if (isDevelopment) {
      // En desarrollo, usar endpoint de test con token en URL
      return `${baseURL}/api/mercadopago/test-connect?token=${accessToken}`
    } else {
      // En producción, usar endpoint normal (requiere header Authorization)
      return `${baseURL}/api/mercadopago/connect`
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
