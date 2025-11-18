'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from 'react-hot-toast'
import { PurchaseService } from '@/services/api/purchase'
import { StorageService } from '@/services/storage'
import { Loader2, ShoppingCart, CreditCard, CheckCircle2 } from 'lucide-react'

export default function EventCheckoutPage() {
  const { id } = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [event, setEvent] = useState<any>(null)
  const [selectedTickets, setSelectedTickets] = useState<any[]>([])
  const [appliedPromo, setAppliedPromo] = useState<any>(null)

  useEffect(() => {
    // Cargar datos del localStorage
    const eventData = localStorage.getItem('selectedEvent')
    const ticketsData = localStorage.getItem('selectedTickets')
    const promoData = localStorage.getItem('appliedPromo')

    if (!eventData || !ticketsData) {
      toast.error('No hay datos de compra. Redirigiendo...')
      router.push(`/events/${id}`)
      return
    }

    setEvent(JSON.parse(eventData))
    setSelectedTickets(JSON.parse(ticketsData))
    if (promoData) {
      setAppliedPromo(JSON.parse(promoData))
    }
  }, [id, router])

  const calculateTotal = () => {
    return selectedTickets.reduce((sum, ticket) => {
      return sum + (ticket.price * ticket.quantity)
    }, 0)
  }

  const handleCheckout = async () => {
    const token = StorageService.getAccessToken()
    if (!token) {
      toast.error('Debes iniciar sesión para continuar')
      router.push('/login')
      return
    }

    setLoading(true)

    try {
      // Preparar los datos para el backend
      const tickets = selectedTickets.map(t => ({
        ticketTypeId: t.ticket_type_id,
        quantity: t.quantity
      }))

      const requestData = {
        eventId: event.id,
        tickets: tickets,
        promotionCode: appliedPromo?.code || null
      }

      // Crear preferencia de pago
      const response = await PurchaseService.createPreference(requestData)

      // Redirigir a MercadoPago
      window.location.href = response.initPoint

    } catch (error: any) {
      console.error('Error al procesar el pago:', error)
      toast.error(error.message || 'Error al procesar el pago')
      setLoading(false)
    }
  }

  if (!event || selectedTickets.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    )
  }

  const total = calculateTotal()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <Container className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => router.push(`/events/${id}`)}
                disabled={loading}
              >
                ← Volver
              </Button>
              <h1 className="text-xl font-bold text-gray-900">Finalizar Compra</h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <ShoppingCart className="w-4 h-4" />
              <span>{selectedTickets.reduce((sum, t) => sum + t.quantity, 0)} tickets</span>
            </div>
          </div>
        </Container>
      </div>

      <Container className="py-8 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna principal: Resumen de compra */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información del evento */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Información del Evento</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{event.title}</p>
                  <p className="text-gray-600 mt-1">{event.description}</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-gray-700">
                  <span>📍 {event.venue}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>🗓️ {new Date(event.startDate).toLocaleDateString('es-PE', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>⏰ {new Date(event.startDate).toLocaleTimeString('es-PE', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</span>
                </div>
              </div>
            </Card>

            {/* Tickets seleccionados */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tickets Seleccionados</h2>
              <div className="space-y-3">
                {selectedTickets.map((ticket, index) => (
                  <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-900">{ticket.name}</p>
                      <p className="text-sm text-gray-600">Cantidad: {ticket.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">S/ {(ticket.price * ticket.quantity).toFixed(2)}</p>
                      <p className="text-sm text-gray-600">S/ {ticket.price.toFixed(2)} c/u</p>
                    </div>
                  </div>
                ))}
              </div>

              {appliedPromo && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-900">Promoción aplicada: {appliedPromo.code}</p>
                      <p className="text-sm text-green-700">
                        {appliedPromo.promotion_type === 'PERCENTAGE' 
                          ? `${appliedPromo.discount_value}% de descuento` 
                          : `S/ ${appliedPromo.discount_value} de descuento`}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Columna lateral: Resumen de pago */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumen de Pago</h2>
              
              <div className="space-y-3 mb-6">
                {selectedTickets.map((ticket, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600">{ticket.name} (x{ticket.quantity})</span>
                    <span className="font-medium text-gray-900">S/ {(ticket.price * ticket.quantity).toFixed(2)}</span>
                  </div>
                ))}
                
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between text-base font-bold">
                    <span className="text-gray-900">Total a Pagar</span>
                    <span className="text-primary-600 text-xl">S/ {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleCheckout}
                disabled={loading}
                className="mb-4"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" />
                    Pagar con MercadoPago
                  </>
                )}
              </Button>

              <div className="text-xs text-gray-500 text-center">
                <p>Pago seguro procesado por MercadoPago</p>
                <p className="mt-1">Recibirás tus tickets por email inmediatamente después del pago</p>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  )
}
