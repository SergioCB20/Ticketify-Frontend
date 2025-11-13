'use client'

import Link from 'next/link'
import QRCode from 'react-qr-code'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { TicketDetail } from '@/services/api/tickets'

type Props = { ticket: TicketDetail }

export default function TicketDetailView({ ticket }: Props) {
  const { id, code, qr_code: qr, status, price, event } = ticket

type Variant = 'default' | 'success' | 'warning' | 'destructive'

const statusToVariant = (s?: string): Variant => {
  switch ((s ?? '').toLowerCase()) {
    case 'active':
    case 'valid':
    case 'válido':
      return 'success'
    case 'used':
    case 'redeemed':
    case 'usado':
      return 'warning'
    case 'cancelled':
    case 'canceled':
    case 'anulado':
      return 'destructive'
    default:
      return 'default'
  }
}

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>{event?.title ?? 'Ticket'}</span>
            <Badge variant={statusToVariant(status)} className="capitalize">
              {status ?? '—'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="text-sm text-gray-500">ID</div>
            <div className="font-mono text-sm break-all">{id}</div>

            <div className="text-sm text-gray-500 mt-4">Código</div>
            <div className="font-mono text-sm break-all">{code ?? '—'}</div>

            <div className="text-sm text-gray-500 mt-4">Evento</div>
            <div className="text-sm">
              {event?.title ?? '—'}
              {event?.id && (
                <>
                  {' '}·{' '}
                  <Link className="text-primary underline" href={`/events/${event.id}`}>
                    Ver evento
                  </Link>
                </>
              )}
            </div>

            <div className="text-sm text-gray-500 mt-4">Precio</div>
            <div className="text-sm">S/ {Number(price ?? 0).toFixed(2)}</div>
          </div>

          <div className="flex flex-col items-center">
            <div className="text-sm text-gray-500 mb-2">QR (referencial)</div>
            {qr ? (
              <div className="bg-white p-4 rounded-lg">
                <QRCode value={qr} size={160} />
              </div>
            ) : (
              <div className="text-red-600 text-sm">Este ticket no tiene QR.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
