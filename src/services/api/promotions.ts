import api, { handleApiError } from '../../lib/api'
import type { Promotion } from '../../lib/types'

export class PromotionService {
  // ✅ Obtener todas las promociones
  static async getAll(): Promise<Promotion[]> {
    try {
      const response = await api.get<Promotion[]>('/promotions')
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // ✅ Crear nueva promoción
  static async create(promoData: Partial<Promotion>): Promise<Promotion> {
    try {
      const response = await api.post<Promotion>('/promotions', promoData)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // ✅ Actualizar promoción
  static async update(id: string, promoData: Partial<Promotion>): Promise<Promotion> {
    try {
      const response = await api.put<Promotion>(`/promotions/${id}`, promoData)
      return response.data
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // ✅ Eliminar promoción
  static async delete(id: string): Promise<void> {
    try {
      await api.delete(`/promotions/${id}`)
    } catch (error) {
      throw handleApiError(error)
    }
  }
}
