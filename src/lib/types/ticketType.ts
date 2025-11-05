// Tipos para gestión de tipos de entrada de eventos

export interface TicketType {
  id: string
  eventId: string
  name: string
  description?: string
  price: number
  quantity: number
  availableQuantity: number
  maxPerPurchase?: number
  salesStartDate?: string
  salesEndDate?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface TicketTypeCreate {
  name: string
  description?: string
  price: number
  quantity: number
  maxPerPurchase?: number
  salesStartDate?: string
  salesEndDate?: string
}

export interface TicketTypeUpdate {
  name?: string
  description?: string
  price?: number
  quantity?: number
  maxPerPurchase?: number
  salesStartDate?: string
  salesEndDate?: string
  isActive?: boolean
}

// Tipo temporal para el formulario (antes de crear el evento)
export interface TicketTypeFormData {
  tempId: string // ID temporal para gestionar en el frontend
  name: string
  description: string
  price: string
  quantity: string
  maxPerPurchase: string
}
