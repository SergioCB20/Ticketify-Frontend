import api, { handleApiError } from '@/lib/api'
import type {
  UserPreferences,
  CategoryPreference,
  UpdateCategoryPreferenceRequest,
  UpdateEmailNotificationsRequest,
  BulkUpdateCategoryPreferencesRequest
} from '@/lib/types/preferences'

export class PreferencesService {
  /**
   * Obtener preferencias del usuario actual
   */
  static async getPreferences(): Promise<UserPreferences> {
    try {
      const response = await api.get<UserPreferences>('/preferences')
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  /**
   * Actualizar preferencia de notificaciones por email
   */
  static async updateEmailNotifications(enabled: boolean): Promise<{ message: string; emailNotifications: boolean }> {
    try {
      const response = await api.patch<{ message: string; emailNotifications: boolean }>(
        '/preferences/email-notifications',
        { emailNotifications: enabled }
      )
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  /**
   * Marcar/desmarcar una categoría como favorita
   */
  static async updateCategoryPreference(
    categoryId: string,
    isActive: boolean
  ): Promise<CategoryPreference> {
    try {
      const response = await api.post<CategoryPreference>('/preferences/categories', {
        categoryId,
        isActive
      })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  /**
   * Actualizar múltiples preferencias de categorías
   */
  static async bulkUpdateCategoryPreferences(
    preferences: UpdateCategoryPreferenceRequest[]
  ): Promise<CategoryPreference[]> {
    try {
      const response = await api.post<CategoryPreference[]>('/preferences/categories/bulk', {
        preferences
      })
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }
}
