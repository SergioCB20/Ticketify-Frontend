'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams, useParams } from 'next/navigation'
import { Container } from '@/components/ui/container'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, Mail, CreditCard, Home, Ticket } from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function CheckoutPendingPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const eventId = params.id as string

  const paymentId = searchParams.get('payment_id')
  const status = searchParams.get('status')
  const purchaseId = searchParams.get('purchase_id')

  useEffect(() => {
    // Mostrar notificación informativa al cargar la página
    toast.loading('Tu pago está en proceso de verificación', {
      duration: 3000,
      icon: '⏳'
    })
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container className="max-w-md">
        <Card className="text-center p-6 shadow-lg border-yellow-100">
          <CardContent className="pt-6 space-y-6">
            
            <div className="flex justify-center">
              <div className="rounded-full bg-yellow-100 p-4">
                <Clock className="h-16 w-16 text-yellow-600" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">Pago Pendiente</h1>
              <p className="text-gray-600">
                Tu pago está siendo procesado. Recibirás una confirmación por correo cuando se complete.
              </p>
              
              {paymentId && (
                <p className="text-sm text-gray-500 bg-gray-100 p-2 rounded">
                  Referencia: {paymentId}
                </p>
              )}
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3 text-left">
                <Mail className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yellow-900">
                    Revisa tu correo electrónico
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Te enviaremos una confirmación cuando tu pago sea aprobado.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-left">
                <CreditCard className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yellow-900">
                    Tiempo de procesamiento
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Algunos métodos de pago pueden tardar hasta 48 horas en confirmarse.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-left">
                <Ticket className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-yellow-900">
                    Tus tickets
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Los tickets se generarán automáticamente una vez aprobado el pago.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <Button 
                variant="primary" 
                size="lg" 
                className="w-full"
                onClick={() => router.push('/panel/my-tickets')}
              >
                <Ticket className="mr-2 h-5 w-5" />
                Ver Mis Compras
              </Button>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => router.push(`/events/${eventId}`)}
              >
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
                Si tienes dudas, puedes contactar a nuestro equipo de soporte o revisar el estado de tu compra en "Mis Compras".
              </p>
            </div>

          </CardContent>
        </Card>
      </Container>
    </div>
  )
}
