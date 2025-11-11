import type { Ticket } from './ticket'
import type { User } from './user'

// Tipos de marketplace (reventa de tickets)
interface TicketWithType extends Ticket {
  ticketType: {
    id: string
    name: string
    price: number
  }
}

export interface MarketplaceListing {
  id: string
  ticketId: string
  ticket_type_id: string
  ticket: Ticket
  sellerId: string
  seller: User
  price: number
  status: 'AVAILABLE' | 'SOLD' | 'CANCELLED'
  createdAt: string
  updatedAt: string
}

export interface CreateListingData {
  ticketId: string
  price: number
}

export interface MarketplaceFilters {
  eventId?: string
  priceMin?: number
  priceMax?: number
  status?: 'AVAILABLE' | 'SOLD' | 'CANCELLED'
}

export type ListingStatus = 'AVAILABLE' | 'SOLD' | 'CANCELLED'
