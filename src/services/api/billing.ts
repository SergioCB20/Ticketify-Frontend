import api, { handleApiError } from '../../lib/api'

// ============================================================
// Tipos de Datos de Facturación
// ============================================================

export interface BillingCommission {
  amount: number
  percentage: number
}

export interface BillingCommissions {
  mercadoPago: BillingCommission
  platform: BillingCommission
  total: number
}

export interface BillingAccreditation {
  credited: number
  pending: number
  nextDate: string | null
}

export interface BillingSummary {
  totalRevenue: number
  totalTransactions: number
  commissions: BillingCommissions
  netAmount: number
  accreditation: BillingAccreditation
}

export interface PaymentMethod {
  method: string
  count: number
  amount: number
  percentage: number
}

export interface BillingTransaction {
  id: string
  mpPaymentId: string | null
  date: string
  buyerEmail: string
  amount: number
  mpCommission: number
  platformCommission: number
  netAmount: number
  status: 'approved' | 'pending' | 'rejected' | 'refunded' | 'charged_back'
  paymentMethod: string
  accreditationDate: string | null
  mpLink: string | null
}

export interface EventBillingDetail {
  eventId: string
  eventName: string
  eventDate: string
  summary: BillingSummary
  paymentMethods: PaymentMethod[]
  transactions: BillingTransaction[]
  lastSync: string
}

export interface OrganizerEventBilling {
  id: string
  title: string
  startDate: string
  totalRevenue: number
  totalTransactions: number
  netAmount: number
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED'
}

// ============================================================
// Servicio de Facturación
// ============================================================

const billingService = {
  /**
   * Obtener lista de eventos del organizador con datos de facturación
   */
  getOrganizerEvents: async (): Promise<OrganizerEventBilling[]> => {
    try {
      const response = await api.get('/organizer/billing/events')
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * Obtener detalle de facturación de un evento específico
   */
  getEventBillingDetail: async (eventId: string): Promise<EventBillingDetail> => {
    try {
      const response = await api.get(`/organizer/billing/events/${eventId}`)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * Sincronizar datos con Mercado Pago
   */
  syncEventBilling: async (eventId: string): Promise<{ message: string }> => {
    try {
      const response = await api.post(`/organizer/billing/events/${eventId}/sync`)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },

  /**
   * Descargar reporte de facturación en PDF
   */
  downloadBillingReport: async (eventId: string, format: 'pdf' | 'excel' = 'pdf'): Promise<Blob> => {
    try {
      const response = await api.get(`/organizer/billing/events/${eventId}/report`, {
        params: { format },
        responseType: 'blob',
      })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  },
}

export default billingService
