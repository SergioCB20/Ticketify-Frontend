import api, { handleApiError } from '../../lib/api'
import type {
  Category,
  CreateCategoryRequest,
  UpdateCategoryRequest
} from '../../lib/types'

export class AdminCategoriesService {
  /**
   * Obtener todas las categorías (incluidas inactivas)
   */
  static async getCategories(): Promise<Category[]> {
    try {
      const response = await api.get<Category[]>('/admin/categories')
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  /**
   * Crear una nueva categoría
   */
  static async createCategory(data: CreateCategoryRequest): Promise<Category> {
    try {
      const response = await api.post<Category>('/admin/categories', data)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  /**
   * Actualizar una categoría
   */
  static async updateCategory(
    categoryId: string,
    data: UpdateCategoryRequest
  ): Promise<Category> {
    try {
      const response = await api.put<Category>(
        `/admin/categories/${categoryId}`,
        data
      )
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  /**
   * Desactivar una categoría (eliminación lógica)
   */
  static async deleteCategory(categoryId: string): Promise<Category> {
    try {
      const response = await api.delete<Category>(
        `/admin/categories/${categoryId}`
      )
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  /**
   * Reactivar una categoría
   */
  static async activateCategory(categoryId: string): Promise<Category> {
    try {
      const response = await api.patch<Category>(
        `/admin/categories/${categoryId}/activate`
      )
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }
}
