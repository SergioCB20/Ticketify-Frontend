import { api } from '@/lib/api'

export const EventService = {
  getAllByUser: async (userId: string) => {
    const res = await api.get(`/events/${userId}`)
    return res.data
  },
  getPromotions: async (eventId: string) => {
    const res = await api.get(`/events/${eventId}/promotions`)
    return res.data
  },
  createPromotion: async (data: any) => {
    const res = await api.post('/promotions', data)
    return res.data
  },
  updatePromotion: async (id: string, data: any) => {
    const res = await api.put(`/promotions/${id}`, data)
    return res.data
  },
  deletePromotion: async (id: string) => {
    const res = await api.delete(`/promotions/${id}`)
    return res.data
  },
}
