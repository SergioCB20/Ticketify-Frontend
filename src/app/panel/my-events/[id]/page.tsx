'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  Calendar, MapPin, Users, Ticket, DollarSign, 
  Edit, Trash2, MessageSquare, TrendingUp, Clock,
  Loader2, AlertCircle
} from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { EventService } from '@/services/api/events'

interface TicketTypeDetail {
  id: string
  name: string
  description?: string
  price: number
  quantity_available: number
  sold_quantity: number
  remaining_quantity: number
  is_active: boolean
  is_sold_out: boolean
}

interface EventDetail {
  id: string
  title: string
  description?: string
  startDate: string
  endDate: string
  venue: string
  status: string
  totalCapacity: number
  photoUrl?: string
  ticket_types?: TicketTypeDetail[]
  organizerId?: string
  categoryId?: string
  minPrice?: number
  maxPrice?: number
}

export default function EventDashboardPage() {
  const router = useRouter()
  const params = useParams()
  const { user } = useAuth()
  const [event, setEvent] = useState<EventDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const eventId = params?.id as string

  useEffect(() => {
    if (!eventId) return

    const fetchEventDetails = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await EventService.getEventById(eventId)
        setEvent(data)
      } catch (err: any) {
        console.error('Error al cargar evento:', err)
        setError(err.message || 'Error al cargar el evento')
      } finally {
        setIsLoading(false)
      }
    }

    fetchEventDetails()
  }, [eventId])

  const handleDelete = async () => {
    if (!confirm('¿Estás seguro de que deseas eliminar este evento? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      await EventService.deleteEvent(eventId)
      router.push('/panel/my-events')
    } catch (err: any) {
      alert(err.message || 'Error al eliminar el evento')
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-600" />
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error al cargar evento</h2>
            <p className="text-gray-600 mb-4">{error || 'Evento no encontrado'}</p>
            <Link href="/panel/my-events">
              <Button variant="outline">Volver a Mis Eventos</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const totalTickets = event.ticket_types?.reduce((sum, tt) => sum + tt.quantity_available, 0) || 0
  const soldTickets = event.ticket_types?.reduce((sum, tt) => sum + (tt.sold_quantity || 0), 0) || 0
  const availableTickets = totalTickets - soldTickets
  const salesPercentage = totalTickets > 0 ? ((soldTickets / totalTickets) * 100).toFixed(1) : '0'
  
  const totalRevenue = event.ticket_types?.reduce(
    (sum, tt) => sum + (tt.sold_quantity || 0) * tt.price, 
    0
  ) || 0

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'success'
      case 'DRAFT': return 'warning'
      case 'CANCELLED': return 'destructive'
      case 'COMPLETED': return 'default'
      default: return 'default'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PUBLISHED': return 'Publicado'
      case 'DRAFT': return 'Borrador'
      case 'CANCELLED': return 'Cancelado'
      case 'COMPLETED': return 'Completado'
      default: return status
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container>
        {/* Header */}
        <div className="mb-6">
          <Link href="/panel/my-events" className="text-violet-600 hover:text-violet-700 font-medium mb-4 inline-block">
            ← Volver a Mis Eventos
          </Link>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
              <Badge variant={getStatusColor(event.status) as any}>
                {getStatusText(event.status)}
              </Badge>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Link href={`/panel/my-events/${eventId}/messages`}>
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Mensajes
                </Button>
              </Link>
              <Link href={`/panel/my-events/${eventId}/edit`}>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </Link>
              <Button variant="destructive" size="sm" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Eliminar
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Tickets Vendidos
              </CardTitle>
              <Ticket className="h-4 w-4 text-violet-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{soldTickets.toLocaleString()}</div>
              <p className="text-xs text-gray-600 mt-1">
                de {totalTickets.toLocaleString()} totales ({salesPercentage}%)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Ingresos Totales
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalRevenue.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                PEN
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Disponibles
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{availableTickets.toLocaleString()}</div>
              <p className="text-xs text-gray-600 mt-1">
                tickets restantes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                Asistentes
              </CardTitle>
              <Users className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{soldTickets.toLocaleString()}</div>
              <p className="text-xs text-gray-600 mt-1">
                personas esperadas
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Event Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            {event.photoUrl && (
              <Card>
                <CardContent className="p-0">
                  <img 
                    src={`http://localhost:8000${event.photoUrl}`}
                    alt={event.title}
                    className="w-full h-64 object-cover rounded-t-lg"
                  />
                </CardContent>
              </Card>
            )}

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Descripción</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
              </CardContent>
            </Card>

            {/* Ticket Types */}
            <Card>
              <CardHeader>
                <CardTitle>Tipos de Tickets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {event.ticket_types && event.ticket_types.length > 0 ? (
                    event.ticket_types.map((ticket) => (
                      <div 
                        key={ticket.id}
                        className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <h4 className="font-semibold text-gray-900">{ticket.name}</h4>
                          <p className="text-sm text-gray-600">
                            Vendidos: {ticket.sold_quantity || 0} / {ticket.quantity_available + (ticket.sold_quantity || 0)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-violet-600">
                            S/ {ticket.price.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-600">
                            {ticket.remaining_quantity} disponibles
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-4">No hay tipos de tickets configurados</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Información del Evento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Inicio</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(event.startDate, { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Fin</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(event.endDate, { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Ubicación</p>
                    <p className="text-sm text-gray-600">{event.venue}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href={`/eventos/${eventId}`} target="_blank">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    Ver página pública
                  </Button>
                </Link>
                <Link href={`/panel/my-events/${eventId}/messages`}>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Enviar mensaje a asistentes
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  )
}
