'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { QRCodeDisplay } from '@/components/marketplace/qr-code-display'
import { PurchaseService } from '@/services/api/purchase'
import type { ProcessPaymentRequest, PurchaseResponse, TicketPurchased } from '@/lib/types'
import { CreditCard, Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Parámetros de la URL
  const eventId = searchParams.get('eventId')
  const ticketTypeId = searchParams.get('ticketTypeId')
  const quantity = parseInt(searchParams.get('quantity') || '1')
  const price = parseFloat(searchParams.get('price') || '0')
  const eventName = searchParams.get('eventName') || 'Evento'

  // Estados
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [purchaseResult, setPurchaseResult] = useState<PurchaseResponse | null>(null)

  // Estados del formulario
  const [cardNumber, setCardNumber] = useState('')
  const [cardholderName, setCardholderName] = useState('')
  const [expiryMonth, setExpiryMonth] = useState('')
  const [expiryYear, setExpiryYear] = useState('')
  const [cvv, setCvv] = useState('')

  // Validación inicial
  useEffect(() => {
    if (!eventId || !ticketTypeId) {
      router.push('/events')
    }
  }, [eventId, ticketTypeId, router])

  // Formatear número de tarjeta (agregar espacios cada 4 dígitos)
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '').replace(/\D/g, '')
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned
    return formatted.slice(0, 19) // Máximo 16 dígitos + 3 espacios
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const paymentData: ProcessPaymentRequest = {
        purchase: {
          eventId: eventId!,
          ticketTypeId: ticketTypeId!,
          quantity
        },
        payment: {
          cardNumber: cardNumber.replace(/\s/g, ''),
          cardholderName,
          expiryMonth,
          expiryYear,
          cvv
        }
      }

      const result = await PurchaseService.processPurchase(paymentData)
      setPurchaseResult(result)
      setSuccess(true)
      
    } catch (err: any) {
      setError(err.message || 'Error al procesar el pago. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  const totalAmount = price * quantity

  // Vista de éxito con tickets y QR
  if (success && purchaseResult) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow py-12">
          <Container>
            <div className="max-w-4xl mx-auto">
              {/* Header de éxito */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  ¡Compra Exitosa!
                </h1>
                <p className="text-lg text-gray-700">
                  {purchaseResult.message}
                </p>
              </div>

              {/* Información de la compra */}
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold mb-4">Resumen de la Compra</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ID de Compra:</span>
                    <span className="font-mono">{purchaseResult.purchaseId.slice(0, 8)}...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Pagado:</span>
                    <span className="font-semibold text-lg">${purchaseResult.totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tickets Generados:</span>
                    <span className="font-semibold">{purchaseResult.tickets.length}</span>
                  </div>
                </div>
              </div>

              {/* QR Codes de los tickets */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                  Tus Tickets
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {purchaseResult.tickets.map((ticket, index) => (
                    <QRCodeDisplay
                      key={ticket.id}
                      qrCode={ticket.qrCode}
                      ticketId={ticket.id}
                      eventName={`${eventName} - Ticket ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={() => router.push('/panel/my-tickets')}
                >
                  Ver Mis Tickets
                </Button>
                <Button
                  variant="primary"
                  onClick={() => router.push('/events')}
                >
                  Explorar Más Eventos
                </Button>
              </div>
            </div>
          </Container>
        </main>
        <Footer />
      </div>
    )
  }

  // Formulario de pago
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow py-12">
        <Container>
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Finalizar Compra
              </h1>
              <p className="text-gray-600">
                Completa los datos de pago para obtener tus tickets
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Resumen del pedido */}
              <div className="md:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                  <h2 className="text-lg font-semibold mb-4">Resumen</h2>
                  <div className="space-y-3 mb-6">
                    <div>
                      <p className="text-sm text-gray-600">Evento</p>
                      <p className="font-medium">{eventName}</p>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Cantidad</span>
                      <span className="font-medium">{quantity} ticket(s)</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Precio unitario</span>
                      <span className="font-medium">${price.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Total</span>
                      <span className="text-2xl font-bold text-primary-600">
                        ${totalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Formulario de pago */}
              <div className="md:col-span-2">
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <CreditCard className="w-6 h-6 text-primary-600" />
                    <h2 className="text-xl font-semibold">Datos de Pago</h2>
                  </div>

                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-800">{error}</p>
                    </div>
                  )}

                  {/* Nota de simulación */}
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Modo de prueba:</strong> Usa cualquier número de tarjeta excepto:
                    </p>
                    <ul className="text-xs text-blue-700 mt-2 space-y-1">
                      <li>• Termina en 0000: Será rechazada</li>
                      <li>• Termina en 1111: Fondos insuficientes</li>
                    </ul>
                  </div>

                  <div className="space-y-4">
                    {/* Número de tarjeta */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número de Tarjeta *
                      </label>
                      <Input
                        type="text"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="1234 5678 9012 3456"
                        required
                        maxLength={19}
                      />
                    </div>

                    {/* Nombre del titular */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre del Titular *
                      </label>
                      <Input
                        type="text"
                        value={cardholderName}
                        onChange={(e) => setCardholderName(e.target.value.toUpperCase())}
                        placeholder="JUAN PÉREZ"
                        required
                      />
                    </div>

                    {/* Fecha de expiración y CVV */}
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Mes *
                        </label>
                        <Input
                          type="text"
                          value={expiryMonth}
                          onChange={(e) => setExpiryMonth(e.target.value.replace(/\D/g, '').slice(0, 2))}
                          placeholder="MM"
                          required
                          maxLength={2}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Año *
                        </label>
                        <Input
                          type="text"
                          value={expiryYear}
                          onChange={(e) => setExpiryYear(e.target.value.replace(/\D/g, '').slice(0, 2))}
                          placeholder="YY"
                          required
                          maxLength={2}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CVV *
                        </label>
                        <Input
                          type="text"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                          placeholder="123"
                          required
                          maxLength={4}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Botón de pago */}
                  <div className="mt-8">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full"
                      loading={loading}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
                          Procesando Pago...
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5 mr-2" />
                          Pagar ${totalAmount.toFixed(2)}
                        </>
                      )}
                    </Button>
                  </div>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    <Lock className="w-3 h-3 inline mr-1" />
                    Tus datos están protegidos con encriptación SSL
                  </p>
                </form>
              </div>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
