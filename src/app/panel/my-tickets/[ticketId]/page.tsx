'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { QRCodeDisplay } from '@/components/marketplace/qr-code-display'
import { Loader2, ArrowLeft, Calendar, MapPin, Tag } from 'lucide-react'
import { TicketsService } from '@/services/api/tickets'
import type { MyTicket } from '@/lib/types'
import { formatDate } from '@/lib/utils'

export default function TicketDetailPage() {
  const params = useParams()
  const router = useRouter()
  const ticketId = params.ticketId as string
  
  const [ticket, setTicket] = useState<MyTicket | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTicket = async () => {
      try {
        setLoading(true)
        // Obtener todos los tickets y buscar el específico
        const tickets = await TicketsService.getMyTickets()
        const foundTicket = tickets.find(t => t.id === ticketId)
        
        if (!foundTicket) {
          setError('Ticket no encontrado')
        } else {
          setTicket(foundTicket)
        }
      } catch (err: any) {
        setError(err.message || 'Error al cargar el ticket')
      } finally {
        setLoading(false)
      }
    }

    loadTicket()
  }, [ticketId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Cargando ticket...</p>
        </div>
      </div>
    )
  }

  if (error || !ticket) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800">{error || 'Ticket no encontrado'}</h3>
          <Button 
            variant="primary" 
            className="mt-4"
            onClick={() => router.push('/panel/my-tickets')}
          >
            Volver a Mis Tickets
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container>
        {/* Botón de volver */}
        <Button
          variant="ghost"
          onClick={() => router.push('/panel/my-tickets')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Mis Tickets
        </Button>

        {/* Card principal */}
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center border-b pb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {ticket.event.title}
            </h1>
            <div className="flex flex-col gap-3 mt-4">
              <div className="flex items-center justify-center text-gray-700">
                <Tag className="w-5 h-5 mr-2 text-primary-500" />
                <span className="font-medium">{ticket.ticketType.name}</span>
              </div>
              <div className="flex items-center justify-center text-gray-700">
                <Calendar className="w-5 h-5 mr-2 text-primary-500" />
                <span>{formatDate(ticket.event.startDate, { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric'
                })}</span>
              </div>
              <div className="flex items-center justify-center text-gray-700">
                <MapPin className="w-5 h-5 mr-2 text-primary-500" />
                <span>{ticket.event.venue}</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-8 pb-8">
            {/* QR Code */}
            <div className="flex justify-center">
              <QRCodeDisplay
                qrCode={ticket.qrCode || ''}
                ticketId={ticket.id}
                eventName={ticket.event.title}
              />
            </div>

            {/* Información adicional */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Información del Ticket</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">ID del Ticket:</span>
                  <span className="font-mono text-gray-900">{ticket.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Precio:</span>
                  <span className="font-semibold text-gray-900">S/ {ticket.price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <span className={`font-medium ${
                    ticket.status === 'ACTIVE' ? 'text-green-600' : 
                    ticket.status === 'TRANSFERRED' ? 'text-orange-600' : 
                    'text-gray-600'
                  }`}>
                    {ticket.isListed ? 'Publicado en Marketplace' : ticket.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Fecha de compra:</span>
                  <span className="text-gray-900">
                    {formatDate(ticket.purchaseDate, { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Nota de seguridad */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Importante:</strong> Presenta este código QR en la entrada del evento. 
                No compartas este código con nadie, ya que es único y personal.
              </p>
            </div>
          </CardContent>
        </Card>
      </Container>
    </div>
  )
}
