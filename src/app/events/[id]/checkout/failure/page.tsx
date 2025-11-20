'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams, useParams } from 'next/navigation'
import { Container } from '@/components/ui/container'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { XCircle, ArrowLeft, RefreshCcw, Home } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function CheckoutFailurePage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const eventId = params.id as string

  const paymentId = searchParams.get('payment_id')
  const status = searchParams.get('status')
  const purchaseId = searchParams.get('purchase_id')

  useEffect(() => {
    // Mostrar notificación de error al cargar la página
    if (status === 'rejected') {
      toast.error('Tu pago fue rechazado')
    } else {
      toast.error('El pago no pudo ser procesado')
    }
  }, [status])

  const handleRetry = () => {
    router.push(`/events/${eventId}/checkout`)
  }

  const handleBackToEvent = () => {
    router.push(`/events/${eventId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container className="max-w-md">
        <Card className="text-center p-6 shadow-lg border-red-100">
          <CardContent className="pt-6 space-y-6">
            
            <div className="flex justify-center">
              <div className="rounded-full bg-red-100 p-4">
                <XCircle className="h-16 w-16 text-red-600" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">Pago Rechazado</h1>
              <p className="text-gray-600">
                No pudimos procesar tu pago. Por favor, verifica tus datos e intenta nuevamente.
              </p>
              
              {paymentId && (
                <p className="text-sm text-gray-500 bg-gray-100 p-2 rounded">
                  Referencia: {paymentId}
                </p>
              )}

              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                <p className="text-sm text-red-800">
                  <strong>Posibles razones:</strong>
                </p>
                <ul className="text-sm text-red-700 list-disc list-inside mt-2 text-left">
                  <li>Fondos insuficientes</li>
                  <li>Datos de la tarjeta incorrectos</li>
                  <li>Límite de compra excedido</li>
                  <li>Problemas con tu banco emisor</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <Button 
                variant="primary" 
                size="lg" 
                className="w-full"
                onClick={handleRetry}
              >
                <RefreshCcw className="mr-2 h-5 w-5" />
                Intentar Nuevamente
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleBackToEvent}
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Volver al Evento
              </Button>

              <Button 
                variant="ghost" 
                className="w-full"
                onClick={() => router.push('/')}
              >
                <Home className="mr-2 h-5 w-5" />
                Ir al Inicio
              </Button>
            </div>

            <div className="pt-4 border-t">
              <p className="text-xs text-gray-500">
                Si el problema persiste, contacta a tu banco o intenta con otro método de pago.
              </p>
            </div>

          </CardContent>
        </Card>
      </Container>
    </div>
  )
}
