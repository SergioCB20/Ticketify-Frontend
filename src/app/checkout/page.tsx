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
import type { ProcessPaymentRequest, PurchaseResponse } from '@/lib/types'
import { CreditCard, Lock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'

export default function CheckoutPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const eventId = searchParams.get('eventId')
  const ticketTypeId = searchParams.get('ticketTypeId')
  const quantity = parseInt(searchParams.get('quantity') || '1')
  const price = parseFloat(searchParams.get('price') || '0')
  const eventName = searchParams.get('eventName') || 'Evento'

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  useEffect(() => {
    if (error) {
      console.log('[DEBUG] Mensaje de error mostrado:', error)
    }
  }, [error])



  const [success, setSuccess] = useState(false)
  const [purchaseResult, setPurchaseResult] = useState<PurchaseResponse | null>(null)

  const [cardNumber, setCardNumber] = useState('')
  const [cardholderName, setCardholderName] = useState('')
  const [expiryMonth, setExpiryMonth] = useState('')
  const [expiryYear, setExpiryYear] = useState('')
  const [cvv, setCvv] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD')

  useEffect(() => {
    if (!eventId || !ticketTypeId) {
      router.push('/events')
    }
  }, [eventId, ticketTypeId, router])

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '').replace(/\D/g, '')
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned
    return formatted.slice(0, 19)
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value))
  }

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  setError(null)
  console.log('[DEBUG] Reiniciando error antes de enviar')

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
  console.error('[DEBUG] Error capturado:', err?.response?.data)

  const detail =
    err?.response?.data?.detail ??
    err?.response?.data?.message ??
    err?.response?.data?.error

  if (typeof detail === 'string') {
    setError(detail) // ✅ mostrará "Fondos insuficientes." o "Tarjeta rechazada..."
  } else if (Array.isArray(detail)) {
    setError(detail[0]?.msg || 'Error en los datos enviados.')
  } else if (Array.isArray(err?.response?.data)) {
    setError(err.response.data[0]?.msg || 'Error inesperado.')
  } else {
    setError(err?.message || 'Error al procesar el pago. Intenta nuevamente.')
  }
  } finally {
    setLoading(false) // ✅ Esto NO SE QUITA
  }
}




  const totalAmount = price * quantity

  if (success && purchaseResult) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow py-12">
          <Container>
            <div className="max-w-4xl mx-auto">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Compra Exitosa!</h1>
                <p className="text-lg text-gray-700">{purchaseResult.message}</p>
              </div>
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
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Tus Tickets</h2>
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
              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={() => router.push('/panel/my-tickets')}>Ver Mis Tickets</Button>
                <Button variant="primary" onClick={() => router.push('/events')}>Explorar Más Eventos</Button>
              </div>
            </div>
          </Container>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow py-12">
        <Container>
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Finalizar Compra</h1>
              <p className="text-gray-600">Completa los datos de pago para obtener tus tickets</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                  <h2 className="text-lg font-semibold mb-4">Resumen</h2>
                  <div className="space-y-3 mb-6">
                    <div><p className="text-sm text-gray-600">Evento</p><p className="font-medium">{eventName}</p></div>
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
                      <span className="text-2xl font-bold text-primary-600">${totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
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



                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Método de Pago *</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-primary-200"
                      required
                    >
                      <option value="">-- Elegir método --</option>
                      <option value="CREDIT_CARD">Tarjeta de Crédito</option>
                      <option value="DEBIT_CARD">Tarjeta de Débito</option>
                      <option value="MERCADOPAGO">MercadoPago</option>
                      <option value="PAYPAL">PayPal</option>
                      <option value="BANK_TRANSFER">Transferencia Bancaria</option>
                    </select>
                  </div>

                  {paymentMethod === 'CREDIT_CARD' || paymentMethod === 'DEBIT_CARD' ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Número de Tarjeta *</label>
                        <Input type="text" value={cardNumber} onChange={handleCardNumberChange} placeholder="1234 5678 9012 3456" required maxLength={19} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Titular *</label>
                        <Input type="text" value={cardholderName} onChange={(e) => setCardholderName(e.target.value.toUpperCase())} placeholder="JUAN PÉREZ" required />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Mes *</label>
                          <Input type="text" value={expiryMonth} onChange={(e) => setExpiryMonth(e.target.value.replace(/\D/g, '').slice(0, 2))} placeholder="MM" required maxLength={2} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Año *</label>
                          <Input type="text" value={expiryYear} onChange={(e) => setExpiryYear(e.target.value.replace(/\D/g, '').slice(0, 2))} placeholder="YY" required maxLength={2} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">CVV *</label>
                          <Input type="text" value={cvv} onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="123" required maxLength={4} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">Este método no requiere información adicional</p>
                  )}

                  <div className="mt-8">
                    <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading} disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin mr-2" /> Procesando Pago...
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5 mr-2" /> Pagar ${totalAmount.toFixed(2)}
                        </>
                      )}
                    </Button>
                  </div>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    <Lock className="w-3 h-3 inline mr-1" /> Tus datos están protegidos con encriptación SSL
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
