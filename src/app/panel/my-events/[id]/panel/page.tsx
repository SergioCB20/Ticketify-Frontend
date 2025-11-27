'use client' 
 
import { useEffect, useState } from 'react' 
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { Container } from '@/components/ui/container'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EventService, type OrganizerEventPanelResponse } from '@/services/api/events'
import { ArrowLeft, Ticket, Wallet, Mail } from 'lucide-react'
import type { EventStatus } from '@/lib/types'

function getStatusLabel(status: EventStatus) {
  switch (status) {
    case 'DRAFT':
      return 'Borrador'
    case 'PUBLISHED':
      return 'Publicado'
    case 'CANCELLED':
      return 'Cancelado'
    case 'COMPLETED':
      return 'Completado'
    default:
      return status
  }
}

export default function EventPanelPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const eventId = params?.id as string

  const [data, setData] = useState<OrganizerEventPanelResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showUpdatedToast, setShowUpdatedToast] = useState(false)

  // Lee ?updated=1 para mostrar el flotante
  useEffect(() => {
    const updated = searchParams.get('updated')
    if (updated === '1') {
      setShowUpdatedToast(true)
      const t = setTimeout(() => {
        setShowUpdatedToast(false)
      }, 3000)
      return () => clearTimeout(t)
    }
  }, [searchParams])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await EventService.getEventPanel(eventId)
      setData(res)
    } catch (err: any) {
      console.error(err)
      setError('No se pudo cargar el panel del evento')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (eventId) loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId])

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" />
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <main className="flex-grow">
          <Container className="py-8 max-w-5xl">
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={() => router.back()}
              className="mb-4"
            >
              <ArrowLeft size={16} className="mr-2" />
              Volver
            </Button>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
          </Container>
        </main>
      </div>
    )
  }

  const { event, ticketStats, billing, communications } = data

  const totalTicketsSold = ticketStats.reduce(
    (sum, t) => sum + (t.sold ?? 0),
    0
  )

  const totalRevenue = ticketStats.reduce(
    (sum, t) => sum + (t.revenue ?? 0),
    0
  )

  const totalTicketsConfigured = ticketStats.reduce(
    (sum, t) => sum + (t.total ?? 0),
    0
  )

  const occupancy =
    totalTicketsConfigured > 0
      ? (totalTicketsSold / totalTicketsConfigured) * 100
      : 0

  const capacity = event.totalCapacity ?? 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="flex-grow">
        <Container className="py-8 max-w-6xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <Button
                variant="ghost"
                size="sm"
                type="button"
                onClick={() => router.back()}
                className="mb-3"
              >
                <ArrowLeft size={16} className="mr-2" />
                Volver
              </Button>
              <h1 className="text-3xl font-bold text-gray-900">
                Panel del Evento
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Controla las entradas, la facturación y la comunicación con tus asistentes.
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => router.push(`/panel/my-events/${event.id}/edit`)}
              >
                Editar evento
              </Button>
            </div>
          </div>

          {/* Resumen superior */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <p className="text-xs font-semibold text-gray-500 mb-1">Estado</p>
                <p className="text-sm font-medium">
                  {getStatusLabel(event.status as EventStatus)}
                </p>
                <p className="text-xs text-gray-400 mt-1">{event.venue}</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-4">
                <p className="text-xs font-semibold text-gray-500 mb-1">Entradas vendidas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalTicketsSold.toLocaleString('es-PE')}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Capacidad total: {event.totalCapacity?.toLocaleString('es-PE') ?? '-'}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-4">
                <p className="text-xs font-semibold text-gray-500 mb-1">Monto recaudado</p>
                <p className="text-2xl font-bold text-emerald-600">
                  S/. {totalRevenue.toFixed(2)}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Comisiones: S/. {billing.platformFees.toFixed(2)}
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-4">
                <p className="text-xs font-semibold text-gray-500 mb-1">Avance de ventas</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {Math.round(occupancy)}%
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {totalTicketsSold.toLocaleString('es-PE')} de{' '}
                  {totalTicketsConfigured.toLocaleString('es-PE')} entradas vendidas
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* HU6.5 – Entradas */}
            <Card className="shadow-lg lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-primary-50 to-blue-50">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Ticket className="w-5 h-5 text-primary-600" />
                    Entradas por tipo
                  </CardTitle>
                  <p className="text-xs text-gray-500 mt-1">
                    Revisa el desempeño de cada tipo de entrada.
                  </p>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-xs md:text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 border-b">
                        <th className="py-2 pr-4 font-semibold">Tipo</th>
                        <th className="py-2 pr-4 font-semibold">Precio (S/.)</th>
                        <th className="py-2 pr-4 font-semibold">Total</th>
                        <th className="py-2 pr-4 font-semibold">Vendidas</th>
                        <th className="py-2 pr-4 font-semibold">Disponibles</th>
                        <th className="py-2 pr-4 font-semibold">Recaudado (S/.)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ticketStats.map((t) => (
                        <tr key={t.id} className="border-b last:border-0">
                          <td className="py-2 pr-4 font-medium text-gray-900">{t.name}</td>
                          <td className="py-2 pr-4">S/. {t.price.toFixed(2)}</td>
                          <td className="py-2 pr-4">{t.total}</td>
                          <td className="py-2 pr-4">{t.sold}</td>
                          <td className="py-2 pr-4">{t.remaining}</td>
                          <td className="py-2 pr-4 font-semibold text-emerald-600">
                            S/. {t.revenue.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                      {ticketStats.length === 0 && (
                        <tr>
                          <td colSpan={7} className="py-4 text-center text-gray-400">
                            Aún no hay tipos de entrada configurados.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* HU6.6 – Facturación */}
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50">
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-amber-600" />
                  Resumen de facturación
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Total recaudado</span>
                  <span className="font-semibold">
                    S/. {totalRevenue.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Comisiones plataforma</span>
                  <span className="font-semibold">
                    S/. {billing.platformFees.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-3 mt-2">
                  <span className="text-gray-700 font-semibold">Ingresos netos</span>
                  <span className="font-bold text-indigo-600">
                    S/. {billing.netRevenue.toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* HU9.2 – Comunicación */}
          <div className="mt-6">
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-emerald-600" />
                  Comunicación con asistentes
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-gray-500">
                    Asistentes totales
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {communications.totalAttendees.toLocaleString('es-PE')}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-gray-500">
                    Correos enviados
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {communications.emailsSent.toLocaleString('es-PE')}
                  </p>
                  {communications.lastCampaignAt && (
                    <p className="text-xs text-gray-400">
                      Última campaña:{' '}
                      {new Date(communications.lastCampaignAt).toLocaleString('es-PE')}
                    </p>
                  )}
                </div>
                <div className="flex flex-col justify-center gap-2">
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() =>
                      router.push(`/panel/my-events/${eventId}/messages`)
                    }
                  >
                    Enviar información adicional
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      router.push(`/panel/my-events/${eventId}/messages`)
                    }
                  >
                    Ver historial de mensajes
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </Container>
      </main>

      {/* 🔔 Toast flotante de éxito */}
      {showUpdatedToast && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="rounded-lg bg-emerald-600 text-white px-4 py-3 shadow-lg text-sm">
            ✅ Evento actualizado correctamente
          </div>
        </div>
      )}
    </div>
  )
}
