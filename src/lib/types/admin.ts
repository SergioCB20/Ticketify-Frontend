import type { User } from './user'

// Tipos de Admin
export interface AdminUser {
  id: string
  email: string
  firstName: string
  lastName: string
  phoneNumber?: string
  isActive: boolean
  roles: string[]
  createdAt: string
  lastLogin?: string
}

export interface PaginatedUsers {
  users: User[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface AdminStats {
  totalUsers: number
  activeUsers: number
  bannedUsers: number
  totalAdmins: number
  activeAdmins: number
  totalEvents: number
  totalTickets: number
  recentRegistrations: number
}

export interface BanUserRequest {
  isActive: boolean
  reason?: string
}

export interface UpdateAdminRoleRequest {
  role: 'SUPER_ADMIN' | 'SUPPORT_ADMIN' | 'SECURITY_ADMIN' | 'CONTENT_ADMIN'
}

export interface CreateAdminRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber?: string
  role: 'SUPER_ADMIN' | 'SUPPORT_ADMIN' | 'SECURITY_ADMIN' | 'CONTENT_ADMIN'
  documentType: 'DNI' | 'CE' | 'Pasaporte'
  documentId: string
}

export type AdminRole = 'SUPER_ADMIN' | 'SUPPORT_ADMIN' | 'SECURITY_ADMIN' | 'CONTENT_ADMIN'
