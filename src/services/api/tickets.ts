import api, { handleApiError } from '@/lib/api'
import type { Ticket as MyTicket } from '@/lib/types'

/** ---------- Tipos que usa la vista paginada ---------- */
export type TicketListItem = {
  id: string
  code?: string              // code | qr_code | qrCode
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

/** ---------- Type guards de respuesta ---------- */
function isArrayResponse(data: unknown): data is MyTicket[] {
  return Array.isArray(data)
}
function isPagedResponse(data: any): data is TicketListResponse {
  return data && Array.isArray(data.items)
}

/** ---------- Normalizadores ---------- */
const toListItem = (t: any): TicketListItem => ({
  id: String(t.id),
  code: t.code ?? t.qr_code ?? t.qrCode ?? undefined,
  status: t.status,
  purchase_date: t.purchase_date ?? t.purchaseDate ?? '',
  event: {
    id: String(t.event?.id ?? ''),
    title: t.event?.title ?? '',
    start_date: t.event?.start_date ?? t.event?.startDate ?? '',
    venue: t.event?.venue ?? '',
    cover_image: t.event?.cover_image ?? t.event?.coverImage ?? null,
  },
})

const toMyTicket = (i: TicketListItem): MyTicket => ({
  // Mapea al shape que usa main (ajusta si tu MyTicket tiene más campos)
  id: i.id,
  price: undefined as any,
  purchaseDate: i.purchase_date,
  status: i.status as any,
  isValid: true as any,
  qrCode: i.code,
  event: {
    id: i.event.id,
    title: i.event.title,
    startDate: i.event.start_date as any,
    venue: i.event.venue,
  } as any,
  ticketType: undefined as any,
  isListed: false as any,
  listingId: null as any,
})

/** ---------- API (paginado) usado por tu página /panel/my-tickets ---------- */
export const getMyTickets = async (page = 1, pageSize = 20): Promise<TicketListResponse> => {
  try {
    const { data } = await api.get('/tickets/my-tickets', {
      params: { page, page_size: pageSize },
    })

    if (isArrayResponse(data)) {
      // El backend devolvió un array (contrato de main)
      const items = data.map(toListItem)
      return { items, total: items.length, page: 1, page_size: items.length }
    }
    if (isPagedResponse(data)) {
      // El backend devolvió estructura paginada (tu contrato)
      return { ...data, items: data.items.map(toListItem) }
    }
    // Fallback seguro
    return { items: [], total: 0, page, page_size: pageSize }
  } catch (error) {
    throw handleApiError(error)
  }
}

/** ---------- Detalle de ticket ---------- */
export type TicketDetail = {
  id: string
  price?: number
  qr_code?: string
  code?: string
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

export const getMyTicketById = async (id: string): Promise<TicketDetail> => {
  try {
    const { data } = await api.get(`/tickets/my-tickets/${id}`)
    const t: any = data
    return {
      id: String(t.id),
      price: t.price,
      qr_code: t.qr_code ?? t.qrCode ?? t.code,
      code: t.code ?? t.qr_code ?? t.qrCode,
      purchase_date: t.purchase_date ?? t.purchaseDate ?? '',
      status: t.status,
      event: {
        id: String(t.event?.id ?? ''),
        title: t.event?.title ?? '',
        start_date: t.event?.start_date ?? t.event?.startDate ?? '',
        end_date: t.event?.end_date ?? t.event?.endDate ?? undefined,
        venue: t.event?.venue ?? '',
        multimedia: t.event?.multimedia ?? [],
        cover_image: t.event?.cover_image ?? t.event?.coverImage ?? null,
      },
    }
  } catch (error) {
    throw handleApiError(error)
  }
}

/** ---------- API estilo main (array) para no romper a quien lo importe ---------- */
const BASE_URL = '/tickets'
export class TicketsService {
  static async getMyTickets(): Promise<MyTicket[]> {
    try {
      const { data } = await api.get(`${BASE_URL}/my-tickets`)
      if (isArrayResponse(data)) return data
      if (isPagedResponse(data)) return data.items.map(toMyTicket)
      return []
    } catch (error) {
      throw handleApiError(error)
    }
  }
}

