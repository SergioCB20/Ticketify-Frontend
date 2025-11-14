import type { Event } from './event'
import type { User } from './user'

// Tipos de tickets
export interface Ticket {
  id: string
  price: number
  purchaseDate: string
  status: string
  qrCode?: string
  isValid?: boolean

  isListed: boolean
  listingId?: string

  event: TicketEventLite

  ticketType?: {
    id: string
    name: string
  }
}

export interface TicketEventLite {
  id: string
  title: string
  startDate: string
  venue: string
  coverImage?: string | null
}


export interface PurchaseTicketData {
  eventId: string
  quantity: number
}

export type TicketStatus = 'RESERVED' | 'PURCHASED' | 'CANCELLED'
