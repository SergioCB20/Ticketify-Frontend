import api, { handleApiError } from '../../lib/api'
import type {
  PaginatedUsers,
  User,
  AdminUser,
  AdminStats,
  BanUserRequest,
  UpdateAdminRoleRequest
} from '../../lib/types'

export class AdminService {
  // ============= USUARIOS =============
  
  static async getUsers(
    page: number = 1,
    pageSize: number = 8,
    search?: string,
    isActive?: boolean
  ): Promise<PaginatedUsers> {
    try {
      const params: any = { page, page_size: pageSize }
      if (search) params.search = search
      if (isActive !== undefined) params.is_active = isActive
      
      const response = await api.get<PaginatedUsers>('/admin/users', { params })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  static async getUserById(userId: string): Promise<User> {
    try {
      const response = await api.get<User>(`/admin/users/${userId}`)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  static async banUser(userId: string, data: BanUserRequest): Promise<User> {
    try {
      const response = await api.patch<User>(`/admin/users/${userId}/ban`, data)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // ============= ADMINISTRADORES =============

  static async getAdmins(): Promise<AdminUser[]> {
    try {
      const response = await api.get<AdminUser[]>('/admin/admins')
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  static async updateAdminRole(
    adminId: string,
    data: UpdateAdminRoleRequest
  ): Promise<AdminUser> {
    try {
      const response = await api.patch<AdminUser>(
        `/admin/admins/${adminId}/role`,
        data
      )
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  static async deactivateAdmin(adminId: string): Promise<AdminUser> {
    try {
      const response = await api.patch<AdminUser>(
        `/admin/admins/${adminId}/deactivate`
      )
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  static async activateAdmin(adminId: string): Promise<AdminUser> {
    try {
      const response = await api.patch<AdminUser>(
        `/admin/admins/${adminId}/activate`
      )
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // ============= ESTADÍSTICAS =============

  static async getStats(): Promise<AdminStats> {
    try {
      const response = await api.get<AdminStats>('/admin/stats')
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }
}
