// Tipos para compras y pagos

export interface PurchaseTicketRequest {
  eventId: string
  ticketTypeId: string
  quantity: number
}

export interface PaymentData {
  cardNumber: string
  cardholderName: string
  expiryMonth: string
  expiryYear: string
  cvv: string
}

export interface ProcessPaymentRequest {
  purchase: PurchaseTicketRequest
  payment: PaymentData
}

export interface TicketPurchased {
  id: string
  eventId: string
  ticketTypeId: string
  price: number
  qrCode: string  // Base64 image string
  status: string
  purchaseDate: string
}

export interface PurchaseResponse {
  success: boolean
  message: string
  purchaseId: string
  paymentId: string
  tickets: TicketPurchased[]
  totalAmount: number
}
