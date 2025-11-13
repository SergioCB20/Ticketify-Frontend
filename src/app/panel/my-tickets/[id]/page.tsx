'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { Container } from '@/components/ui/container'
import { getMyTicketById, type TicketDetail } from '@/services/api/tickets'
import { Button } from '@/components/ui/button'
import { Loader2, ArrowLeft } from 'lucide-react'
import TicketDetailView from './TicketDetail'
import QrView from './QrView'

export default function MyTicketPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const search = useSearchParams()
  const view = (search.get('view') ?? 'detail') as 'detail' | 'qr'

  const [ticket, setTicket] = useState<TicketDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    getMyTicketById(id)
      .then((res) => setTicket(res))
      .catch(() => setError('No se encontró el ticket'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (error || !ticket) {
    return (
      <Container className="py-10">
        <Button variant="ghost" onClick={() => router.push('/panel/my-tickets')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Mis Tickets
        </Button>
        <div className="mt-10 text-center text-red-600 font-medium">
          {error ?? 'No se encontró el ticket'}
        </div>
      </Container>
    )
  }

  return (
    <Container className="py-8">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.push('/panel/my-tickets')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Mis Tickets
        </Button>

        {view === 'detail' ? (
          <Button onClick={() => router.push(`/panel/my-tickets/${ticket.id}?view=qr`)}>
            Ver QR
          </Button>
        ) : (
          <Button variant="outline" onClick={() => router.push(`/panel/my-tickets/${ticket.id}?view=detail`)}>
            Ver detalle
          </Button>
        )}
      </div>

      {view === 'qr'
        ? <QrView ticket={ticket} />
        : <TicketDetailView ticket={ticket} />
      }
    </Container>
  )
}
