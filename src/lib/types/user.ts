// Tipos relacionados con usuarios
export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  country: string
  city: string
  documentType: 'DNI' | 'CE' | 'Pasaporte'
  documentId: string
  profilePhoto?: string
  gender: "masculino" | "femenino" | "otro" | "prefiero-no-decirlo"
  isActive: boolean
  createdAt: string
  lastLogin?: string
  roles: string[]
  
  // Campos de MercadoPago (opcionales)
  mercadopagoUserId?: string
  mercadopagoPublicKey?: string
  mercadopagoEmail?: string
  isMercadopagoConnected?: boolean
  mercadopagoConnectedAt?: string
}

export interface UserUpdate {
  firstName?: string
  lastName?: string
  phoneNumber?: string
  profilePhoto?: string
  city?: string
  country?: string
}

export interface OrganizerInfo {
  id: string
  firstName: string
  lastName: string
  email: string
}
