'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { QRCodeDisplay } from '@/components/marketplace/qr-code-display'
import { SellTicketModal } from '@/components/marketplace/sell-ticket-modal'
import { Loader2, ArrowLeft, Calendar, MapPin, Tag, Store } from 'lucide-react'
import { TicketsService } from '@/services/api/tickets'
import type { MyTicket } from '@/lib/types'
import { formatDate } from '@/lib/utils'
import { toast } from 'react-hot-toast'

export default function TicketDetailPage() {
  const params = useParams()
  const router = useRouter()
  const ticketId = params.ticketId as string
  
  const [ticket, setTicket] = useState<MyTicket | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Estado para controlar el modal de venta
  const [isSellModalOpen, setIsSellModalOpen] = useState(false)

  const loadTicket = useCallback(async () => {
    try {
      setLoading(true)
      const tickets = await TicketsService.getMyTickets()
      const foundTicket = tickets.find(t => t.id === ticketId)
      
      if (!foundTicket) {
        setError('Ticket no encontrado')
      } else {
        setTicket(foundTicket as unknown as MyTicket)
      }
    } catch (err: any) {
      console.error('Error loading ticket:', err)
      setError(err.message || 'Error al cargar el ticket')
    } finally {
      setLoading(false)
    }
  }, [ticketId])

  useEffect(() => {
    loadTicket()
  }, [loadTicket])

  // --- LÓGICA DE REDIRECCIÓN AL ÉXITO ---
  const handleSellSuccess = () => {
    setIsSellModalOpen(false)
    // Mostramos un mensaje de éxito y redirigimos
    toast.success('¡Tu ticket ya está visible en el Marketplace!', {
      duration: 4000,
      icon: '🚀'
    })
    
    // Pequeño delay para que el usuario vea el toast antes de cambiar de página
    setTimeout(() => {
      router.push('/marketplace')
    }, 1000)
  }

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

  if (!ticket.event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-800">Información incompleta</h3>
          <Button 
            variant="primary" 
            className="mt-4"
            onClick={() => router.push('/panel/my-tickets')}
          >
            Volver
          </Button>
        </div>
      </div>
    )
  }

  if (ticket.status === 'TRANSFERRED') {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <Container>
          <Button
            variant="ghost"
            onClick={() => router.push('/panel/my-tickets')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Mis Tickets
          </Button>

          <Card className="max-w-2xl mx-auto border-green-100 shadow-lg">
            <CardContent className="py-12 text-center">
              <div className="mb-6 animate-in zoom-in duration-500">
                <div className="w-24 h-24 mx-auto bg-green-100 rounded-full flex items-center justify-center shadow-inner">
                  <span className="text-5xl">💰</span>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                ¡Vendido!
              </h1>
              <p className="text-xl text-gray-600 mb-6">{ticket.event.title}</p>
              
              <div className="max-w-md mx-auto bg-white p-6 rounded-xl border border-gray-200 shadow-sm mb-8">
                <p className="text-gray-600 mb-2">
                  Este ticket ha sido vendido y transferido al comprador.
                </p>
                <p className="text-green-600 font-semibold">
                  Los fondos han sido agregados a tu cuenta.
                </p>
              </div>

              <div className="flex justify-center gap-4">
                <Button 
                  variant="outline"
                  onClick={() => router.push('/panel/billing')}
                >
                  Ver mis Ganancias
                </Button>
                <Button 
                  variant="primary"
                  onClick={() => router.push('/panel/my-tickets')}
                >
                  Mis otros tickets
                </Button>
              </div>
            </CardContent>
          </Card>
        </Container>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container>
        <Button
          variant="ghost"
          onClick={() => router.push('/panel/my-tickets')}
          className="mb-6 hover:bg-white hover:shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Mis Tickets
        </Button>

        <Card className="max-w-2xl mx-auto shadow-md overflow-hidden border-0">
          {/* Header con gradiente suave */}
          <div className="bg-gradient-to-b from-primary-50 to-white px-6 pt-8 pb-6 border-b border-gray-100 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {ticket.event.title}
            </h1>
            
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {ticket.ticketType?.name && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 text-primary-700 text-sm font-medium">
                  <Tag className="w-3 h-3 mr-2" />
                  {ticket.ticketType.name}
                </span>
              )}
              
              {ticket.event.startDate && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm">
                  <Calendar className="w-3 h-3 mr-2" />
                  {formatDate(ticket.event.startDate, { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                </span>
              )}
            </div>
          </div>

          <CardContent className="pt-8 pb-8 px-6 sm:px-10">
            {/* --- SECCIÓN DE ACCIÓN PRINCIPAL --- */}
            <div className="mb-10">
              {!ticket.isListed && ticket.status === 'ACTIVE' && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 text-center">
                  <h3 className="text-green-900 font-semibold text-lg mb-2">¿No podrás asistir?</h3>
                  <p className="text-green-700/80 mb-4 text-sm">Vende tu entrada de forma segura en nuestro Marketplace oficial.</p>
                  <Button
                    onClick={() => setIsSellModalOpen(true)}
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-6 px-10 text-lg shadow-lg shadow-green-200 transition-all transform hover:-translate-y-0.5"
                  >
                    <Store className="w-5 h-5 mr-2" />
                    Vender en Marketplace
                  </Button>
                </div>
              )}

              {ticket.isListed && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center animate-pulse">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Store className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-blue-900 font-bold text-lg">En Venta</h3>
                  <p className="text-blue-700 mt-1">Tu ticket está visible para miles de compradores.</p>
                  <Button 
                    variant="link" 
                    className="text-blue-700 mt-2 font-semibold"
                    onClick={() => router.push('/marketplace')}
                  >
                    Ver en Marketplace &rarr;
                  </Button>
                </div>
              )}
            </div>

            {/* QR Code Area */}
            <div className="flex flex-col items-center justify-center mb-8 p-6 bg-white rounded-2xl border-2 border-dashed border-gray-200">
              <QRCodeDisplay
                qrCode={ticket.qrCode || ''}
                ticketId={ticket.id}
                eventName={ticket.event.title}
              />
              <p className="mt-4 text-xs text-gray-400 font-mono text-center">ID: {ticket.id}</p>
            </div>

            {/* Detalles */}
            <div className="space-y-4">
              <h3 className="font-bold text-gray-900 border-l-4 border-primary-500 pl-3">
                Detalles de la Entrada
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Precio Original</p>
                  <p className="font-semibold text-gray-900">S/ {ticket.price?.toFixed(2) || '0.00'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Ubicación</p>
                  <p className="font-semibold text-gray-900 truncate">{ticket.event.venue || 'Por definir'}</p>
                </div>
                <div className="sm:col-span-2">
                   <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Estado</p>
                   <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${
                      ticket.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                   }`}>
                     {ticket.status === 'ACTIVE' ? 'VÁLIDO PARA INGRESAR' : ticket.status}
                   </span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-start gap-3 p-4 bg-amber-50 rounded-lg text-amber-800 text-sm">
              <div className="mt-0.5">⚠️</div>
              <p>
                <strong>Seguridad:</strong> El código QR es tu llave de acceso. No lo compartas en redes sociales. 
                Si vendes la entrada, este código se invalidará automáticamente.
              </p>
            </div>
          </CardContent>
        </Card>
      </Container>

      {ticket && (
        <SellTicketModal
          open={isSellModalOpen}
          onOpenChange={setIsSellModalOpen}
          ticket={{
            id: ticket.id,
            eventName: ticket.event.title,
            originalPrice: ticket.price || 0,
            eventPhoto: undefined 
          }}
          onSuccess={handleSellSuccess}
        />
      )}
    </div>
  )
}