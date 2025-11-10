'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import QRCode from 'react-qr-code'
import { Container } from '@/components/ui/container'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getMyTicketById, type TicketDetail } from '@/services/api/tickets'

type BadgeVariant =
  | 'default' | 'success' | 'destructive' | 'warning'
  | 'violet' | 'blue' | 'orange' | 'cyan';

const statusToVariant = (status?: string): BadgeVariant => {
  switch ((status || '').toUpperCase()) {
    case 'ACTIVE':
    case 'VALID':
    case 'PUBLISHED':
      return 'success';
    case 'CANCELLED':
    case 'CANCELED':
      return 'destructive';
    case 'REFUNDED':
      return 'warning';
    case 'PENDING':
      return 'violet';
    case 'TRANSFERRED':
    case 'USED':
      return 'blue';
    default:
      return 'default';
  }
};

const pretty = (s?: string) =>
  (s || '').replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());


export default function TicketDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [data, setData] = useState<TicketDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    getMyTicketById(id)
      .then(res => setData(res))
      .catch(() => setErr('No se encontró el ticket'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
          <p className="mt-3 text-gray-600">Cargando ticket…</p>
        </div>
      </div>
    )
  }

  if (err) return <div className="p-6 text-red-600">{err}</div>
  if (!data) return null

  const qr = data.qr_code ?? data.code ?? ''

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/panel/my-tickets" className="text-blue-600 hover:underline">
            ← Volver
          </Link>
          <Button variant="outline" size="sm" onClick={() => router.refresh()}>
            Actualizar
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card variant="elevated">
            {data.event.cover_image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.event.cover_image}
                alt={data.event.title}
                className="w-full h-56 object-cover"
              />
            ) : null}
            <CardHeader className="pb-2">
              <CardTitle>{data.event.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 space-y-1">
              <div>
                <span className="font-medium">Fecha:</span>{' '}
                {data.event.start_date ? new Date(data.event.start_date).toLocaleString() : '-'}
              </div>
              <div>
                <span className="font-medium">Lugar:</span> {data.event.venue}
              </div>
              <div>
                <span className="font-medium">Estado:</span>{' '}
                <Badge variant={statusToVariant(data.status)}>{pretty(data.status)}</Badge>
              </div>
              <div>
                <span className="font-medium">Precio:</span>{' '}
                {typeof data.price === 'number' ? `S/ ${data.price.toFixed(2)}` : '-'}
              </div>
              <div>
                <span className="font-medium">Compra:</span>{' '}
                {data.purchase_date ? new Date(data.purchase_date).toLocaleString() : '-'}
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated" className="flex items-center justify-center">
            <CardContent className="w-full flex flex-col items-center">
              <div className="text-sm text-gray-600 mb-3">Muestra este código en el ingreso</div>
              {qr ? (
                <div className="bg-white p-4 rounded-lg">
                  <QRCode value={qr} size={192} />
                </div>
              ) : (
                <div className="text-red-600">Este ticket no tiene QR.</div>
              )}
              <div className="mt-3 text-xs break-all text-gray-500">{qr}</div>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  )
}
