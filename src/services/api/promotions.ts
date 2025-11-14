import { api, handleApiError } from '@/lib/api'
import type { Promotion } from '@/lib/types'

export const PromotionService = {
  // =========================================================
  // 🔹 Obtener todas las promociones (admin o listado general)
  // =========================================================
  async getAll(): Promise<Promotion[]> {
    try {
      const res = await api.get('/promotions/')
      return res.data
    } catch (err) {
      throw handleApiError(err)
    }
  },

  // =========================================================
  // 🔹 Obtener promociones de un evento específico
  // =========================================================
  async getByEvent(eventId: string): Promise<Promotion[]> {
    try {
      const res = await api.get(`/promotions/events/${eventId}`)
      return res.data
    } catch (err) {
      throw handleApiError(err)
    }
  },

  // =========================================================
  // 🔹 Crear una nueva promoción
  // =========================================================
  async create(data: any): Promise<Promotion> {
    try {
      console.log("🧾 Payload enviado a API:", data)
      const res = await api.post('/promotions/', data)
      return res.data
    } catch (err: any) {
      console.error("❌ Error en PromotionService.create:", err.response?.data || err.message)
      throw handleApiError(err)
    }
  },

  // =========================================================
  // 🔹 Actualizar una promoción existente
  // =========================================================
  async update(id: string, data: any): Promise<Promotion> {
    try {
      const res = await api.put(`/promotions/${id}`, data)
      return res.data
    } catch (err) {
      throw handleApiError(err)
    }
  },

  // =========================================================
  // 🔹 Eliminar una promoción
  // =========================================================
  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/promotions/${id}`)
    } catch (err) {
      throw handleApiError(err)
    }
  },

  async validate(code: string, eventId: string) {
    try {
      const response = await api.get(`/promotions/validate`, {
        params: { code, event_id: eventId }
      })
      return response.data
    } catch (error: any) {
      throw handleApiError(error)
    }
  }
}