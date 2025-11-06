import type { Event } from './event'
import type { User } from './user'

// Tipos de tickets
export interface Ticket {
  id: string
  eventId: string
  event: Event
  userId: string
  user: User
  quantity: number
  totalPrice: number
  status: 'RESERVED' | 'PURCHASED' | 'CANCELLED'
  purchaseDate: string
  qrCode?: string
}

export interface PurchaseTicketData {
  eventId: string
  quantity: number
}

export type TicketStatus = 'RESERVED' | 'PURCHASED' | 'CANCELLED'
