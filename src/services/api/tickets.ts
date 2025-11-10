import api, { handleApiError } from '@/lib/api'

export type TicketListItem = {
  id: string
  code?: string              // si el backend devuelve "code" en la lista
  status: string
  purchase_date: string
  event: {
    id: string
    title: string
    start_date: string
    venue: string
    cover_image?: string | null
  }
}

export type TicketListResponse = {
  items: TicketListItem[]
  total: number
  page: number
  page_size: number
}

export const getMyTickets = async (page = 1, pageSize = 20) => {
  try {
    const { data } = await api.get<TicketListResponse>('/tickets/my-tickets', {
      params: { page, page_size: pageSize },
    })
    return data
  } catch (error) {
    throw handleApiError(error)
  }
}

export type TicketDetail = {
  id: string
  price?: number
  qr_code?: string
  code?: string               // fallback por si el backend usa "code"
  purchase_date: string
  status: string
  event: {
    id: string
    title: string
    start_date: string
    end_date?: string
    venue: string
    multimedia?: string[]
    cover_image?: string | null
  }
}

export const getMyTicketById = async (id: string) => {
  try {
    const { data } = await api.get<TicketDetail>(`/tickets/my-tickets/${id}`)
    return data
  } catch (error) {
    throw handleApiError(error)
  }
}
