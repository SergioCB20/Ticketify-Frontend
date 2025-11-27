/**
 * Datos de ejemplo para pruebas de desarrollo
 * Estos datos simulan las respuestas del backend
 */

import {
  OrganizerEventBilling,
  EventBillingDetail,
  BillingTransaction,
  PaymentMethod,
} from '@/services/api/billing'

// Lista de eventos con facturación (mock)
export const mockOrganizerEvents: OrganizerEventBilling[] = [
  {
    id: '1',
    title: 'Concierto de Rock 2025',
    startDate: '2025-12-15T20:00:00Z',
    totalRevenue: 15000.0,
    totalTransactions: 75,
    netAmount: 13050.0,
    status: 'PUBLISHED',
  },
  {
    id: '2',
    title: 'Festival de Jazz',
    startDate: '2025-11-20T19:00:00Z',
    totalRevenue: 8500.0,
    totalTransactions: 42,
    netAmount: 7395.0,
    status: 'COMPLETED',
  },
  {
    id: '3',
    title: 'Teatro - La Casa de Bernarda Alba',
    startDate: '2026-01-10T18:30:00Z',
    totalRevenue: 4200.0,
    totalTransactions: 28,
    netAmount: 3654.0,
    status: 'PUBLISHED',
  },
]

// Métodos de pago (mock)
export const mockPaymentMethods: PaymentMethod[] = [
  {
    method: 'credit_card',
    count: 45,
    amount: 9000.0,
    percentage: 60.0,
  },
  {
    method: 'debit_card',
    count: 25,
    amount: 5000.0,
    percentage: 33.3,
  },
  {
    method: 'digital_wallet',
    count: 5,
    amount: 1000.0,
    percentage: 6.7,
  },
]

// Transacciones (mock)
export const mockTransactions: BillingTransaction[] = [
  {
    id: 'tx_001',
    mpPaymentId: '123456789',
    date: '2025-11-20T10:30:00Z',
    buyerEmail: 'juan.perez@example.com',
    amount: 200.0,
    mpCommission: 8.0,
    platformCommission: 10.0,
    netAmount: 182.0,
    status: 'approved',
    paymentMethod: 'credit_card',
    accreditationDate: '2025-11-25T00:00:00Z',
    mpLink: 'https://www.mercadopago.com.pe/payments/123456789',
  },
  {
    id: 'tx_002',
    mpPaymentId: '123456790',
    date: '2025-11-20T11:15:00Z',
    buyerEmail: 'maria.garcia@example.com',
    amount: 150.0,
    mpCommission: 6.0,
    platformCommission: 7.5,
    netAmount: 136.5,
    status: 'approved',
    paymentMethod: 'debit_card',
    accreditationDate: '2025-11-22T00:00:00Z',
    mpLink: 'https://www.mercadopago.com.pe/payments/123456790',
  },
  {
    id: 'tx_003',
    mpPaymentId: '123456791',
    date: '2025-11-20T12:45:00Z',
    buyerEmail: 'carlos.lopez@example.com',
    amount: 300.0,
    mpCommission: 12.0,
    platformCommission: 15.0,
    netAmount: 273.0,
    status: 'pending',
    paymentMethod: 'credit_card',
    accreditationDate: null,
    mpLink: 'https://www.mercadopago.com.pe/payments/123456791',
  },
  {
    id: 'tx_004',
    mpPaymentId: '123456792',
    date: '2025-11-20T14:20:00Z',
    buyerEmail: 'ana.martinez@example.com',
    amount: 180.0,
    mpCommission: 7.2,
    platformCommission: 9.0,
    netAmount: 163.8,
    status: 'approved',
    paymentMethod: 'digital_wallet',
    accreditationDate: '2025-11-23T00:00:00Z',
    mpLink: 'https://www.mercadopago.com.pe/payments/123456792',
  },
  {
    id: 'tx_005',
    mpPaymentId: '123456793',
    date: '2025-11-20T15:00:00Z',
    buyerEmail: 'pedro.sanchez@example.com',
    amount: 250.0,
    mpCommission: 10.0,
    platformCommission: 12.5,
    netAmount: 227.5,
    status: 'rejected',
    paymentMethod: 'credit_card',
    accreditationDate: null,
    mpLink: 'https://www.mercadopago.com.pe/payments/123456793',
  },
]

// Detalle completo de facturación de un evento (mock)
export const mockEventBillingDetail: EventBillingDetail = {
  eventId: '1',
  eventName: 'Concierto de Rock 2025',
  eventDate: '2025-12-15T20:00:00Z',
  summary: {
    totalRevenue: 15000.0,
    totalTransactions: 75,
    commissions: {
      mercadoPago: {
        amount: 600.0,
        percentage: 4.0,
      },
      platform: {
        amount: 750.0,
        percentage: 5.0,
      },
      total: 1350.0,
    },
    netAmount: 13650.0,
    accreditation: {
      credited: 8000.0,
      pending: 5650.0,
      nextDate: '2025-12-20T00:00:00Z',
    },
  },
  paymentMethods: mockPaymentMethods,
  transactions: mockTransactions,
  lastSync: '2025-11-24T14:30:00Z',
}

/**
 * Función helper para simular delay de API
 */
export const mockApiDelay = (ms: number = 1000): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Servicio mock para desarrollo sin backend
 * Usar solo para testing local
 */
export const mockBillingService = {
  getOrganizerEvents: async (): Promise<OrganizerEventBilling[]> => {
    await mockApiDelay(800)
    return mockOrganizerEvents
  },

  getEventBillingDetail: async (
    eventId: string
  ): Promise<EventBillingDetail> => {
    await mockApiDelay(1000)
    return {
      ...mockEventBillingDetail,
      eventId,
    }
  },

  syncEventBilling: async (eventId: string): Promise<{ message: string }> => {
    await mockApiDelay(1500)
    return { message: 'Sincronización completada exitosamente' }
  },

  downloadBillingReport: async (
    eventId: string,
    format: 'pdf' | 'excel'
  ): Promise<Blob> => {
    await mockApiDelay(2000)
    // Simular un archivo vacío
    return new Blob(['Mock report content'], {
      type:
        format === 'pdf' ? 'application/pdf' : 'application/vnd.ms-excel',
    })
  },
}
