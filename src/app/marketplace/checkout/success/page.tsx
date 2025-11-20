'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Container } from '@/components/ui/container'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Loader2, Ticket, Home } from 'lucide-react'
import api from '@/lib/api'
import { toast } from 'react-hot-toast'

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [verifying, setVerifying] = useState(true)
  const [verified, setVerified] = useState(false)

  // Obtener parámetros que Mercado Pago pone en la URL
  const paymentId = searchParams.get('payment_id')
  const status = searchParams.get('status')
  const purchaseId = searchParams.get('purchase_id') // Este lo pusimos nosotros en back_urls

  useEffect(() => {
    const verifyPayment = async () => {
      if (!paymentId || !purchaseId) {
        setVerifying(false)
        return
      }

      if (status !== 'approved') {
        toast.error('El pago no fue aprobado')
        setVerifying(false)
        return
      }

      try {
        // Llamamos al backend para que verifique con MP y actualice la BD
        await api.post(`/purchases/${purchaseId}/verify`, {
          payment_id: paymentId
        })
        setVerified(true)
        toast.success('¡Compra confirmada y tickets generados!')
      } catch (error) {
        console.error('Error verificando pago:', error)
        toast.error('Error al verificar el pago. Contacta a soporte.')
      } finally {
        setVerifying(false)
      }
    }

    // Ejecutar solo una vez
    if (paymentId && purchaseId) {
      verifyPayment()
    }
  }, [paymentId, status, purchaseId])

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container className="max-w-md">
        <Card className="text-center p-6 shadow-lg border-green-100">
          <CardContent className="pt-6 space-y-6">
            
            {verifying ? (
              <div className="flex flex-col items-center justify-center py-10">
                <Loader2 className="h-16 w-16 text-primary-500 animate-spin mb-4" />
                <h2 className="text-xl font-semibold text-gray-800">Verificando tu pago...</h2>
                <p className="text-gray-500">Por favor espera un momento, estamos generando tus tickets.</p>
              </div>
            ) : verified ? (
              <>
                <div className="flex justify-center">
                  <div className="rounded-full bg-green-100 p-4">
                    <CheckCircle2 className="h-16 w-16 text-green-600" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold text-gray-900">¡Pago Exitoso!</h1>
                  <p className="text-gray-600">
                    Tu compra ha sido confirmada. Hemos enviado un correo con los detalles.
                  </p>
                  <p className="text-sm text-gray-500 bg-gray-100 p-2 rounded">
                    ID de Pago: {paymentId}
                  </p>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="w-full"
                    onClick={() => router.push('/panel/my-tickets')}
                  >
                    <Ticket className="mr-2 h-5 w-5" />
                    Ver mis Tickets
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => router.push('/')}
                  >
                    <Home className="mr-2 h-5 w-5" />
                    Volver al Inicio
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="text-red-500 text-6xl mb-4">⚠️</div>
                <h2 className="text-xl font-bold text-gray-900">Algo salió mal</h2>
                <p className="text-gray-600">
                  No pudimos verificar tu pago automáticamente o fue rechazado.
                </p>
                <Button variant="outline" onClick={() => router.push('/panel/my-tickets')}>
                  Verificar en "Mis Tickets"
                </Button>
              </div>
            )}

          </CardContent>
        </Card>
      </Container>
    </div>
  )
}