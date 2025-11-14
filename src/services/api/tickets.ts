import api, { handleApiError } from '@/lib/api';
import type { Ticket as MyTicket } from '@/lib/types';

/** ---------- Tipos que usa la vista paginada ---------- */
export type TicketListItem = {
  id: string
  code?: string
  price?: number
  status: string
  purchase_date: string
  isListed: boolean
  listingId?: string | null
  event: {
    id: string
    title: string
    start_date: string
    venue: string
    cover_image?: string | null
  }
  ticketType?: {
    id: string
    name: string
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
  price: t.price ?? 0,
  status: t.status,
  purchase_date: t.purchase_date ?? t.purchaseDate ?? '',
  isListed: t.isListed ?? false,
  listingId: t.listingId ?? null,
  event: {
    id: String(t.event?.id ?? ''),
    title: t.event?.title ?? '',
    start_date: t.event?.start_date ?? t.event?.startDate ?? '',
    venue: t.event?.venue ?? '',
    cover_image: t.event?.cover_image ?? t.event?.coverImage ?? null,
  },
  ticketType: t.ticketType ? {
    id: String(t.ticketType.id),
    name: t.ticketType.name ?? ''
  } : undefined,
})

const toMyTicket = (i: TicketListItem): MyTicket => ({
  id: i.id,
  price: i.price ?? 0,
  purchaseDate: i.purchase_date,
  status: i.status as any,
  isValid: true,
  qrCode: i.code,
  isListed: i.isListed,
  listingId: i.listingId ?? undefined,
  event: {
    id: i.event.id,
    title: i.event.title,
    startDate: i.event.start_date,
    venue: i.event.venue,
  },
  ticketType: i.ticketType ?? { id: '', name: '' },
})

/** ---------- API (paginado) usado por tu página /panel/my-tickets ---------- */
export const getMyTickets = async (page = 1, pageSize = 20): Promise<TicketListResponse> => {
  try {
    const { data } = await api.get('/tickets/my-tickets', {
      params: { page, page_size: pageSize },
    })

    if (isArrayResponse(data)) {
      const items = data.map(toListItem)
      return { items, total: items.length, page: 1, page_size: items.length }
    }
    if (isPagedResponse(data)) {
      return { ...data, items: data.items.map(toListItem) }
    }
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

  // 🟢 Obtener tickets del usuario autenticado
  static async getMyTickets(): Promise<any[]> {
    try {
      const response = await api.get('/tickets/my-tickets')
      return response.data.items
    } catch (error) {
      throw handleApiError(error)
    }
  }

  // 🆕 Crear ticket real
  static async createTicket(ticketData: {
    event_id: string
    ticket_type_id: string
    price: number
    promo_code?: string
  }): Promise<any> {
    try {
      const response = await api.post('/tickets', ticketData)
      return response.data
    } catch (error: any) {
      console.error('❌ Error al crear ticket:', error)
      throw handleApiError(error)
    }
  }
}
