'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Container } from '@/components/ui/container'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getMyTickets, type TicketListItem } from '@/services/api/tickets'

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



export default function MyTicketsPage() {
  const [data, setData] = useState<{ items: TicketListItem[], total: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    getMyTickets()
      .then(res => setData(res))
      .catch(() => setErr('No se pudo cargar tus tickets'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
          <p className="mt-3 text-gray-600">Cargando tickets…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Mis Tickets</h1>
          <p className="text-gray-600">Aquí verás tus entradas compradas.</p>
        </div>

        {err && (
          <div className="mb-6 text-red-600">{err}</div>
        )}

        {!data || data.items.length === 0 ? (
          <Card variant="elevated" className="p-6">
            <p className="text-gray-600">Aún no tienes tickets.</p>
            <div className="mt-4">
              <Link href="/events">
                <Button variant="primary">Explorar eventos</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((t) => (
              <Card key={t.id} variant="elevated" className="overflow-hidden">
                {t.event.cover_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={t.event.cover_image}
                    alt={t.event.title}
                    className="w-full h-40 object-cover"
                  />
                ) : null}

                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{t.event.title}</CardTitle>
                </CardHeader>

                <CardContent className="text-sm text-gray-700 space-y-1">
                  <div>
                    <span className="font-medium">Fecha:</span>{' '}
                    {new Date(t.purchase_date).toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">Lugar:</span> {t.event.venue}
                  </div>
                  <div className="pt-1">
                    <Badge variant={statusToVariant(t.status)}>{pretty(t.status)}</Badge>
                  </div>
                </CardContent>

                <CardFooter className="pt-2">
                  <Link href={`/panel/my-tickets/${t.id}`}>
                    <Button variant="outline" size="sm">Ver ticket</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </Container>
    </div>
  )
}
