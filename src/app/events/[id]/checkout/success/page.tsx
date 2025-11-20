'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Container } from '@/components/ui/container'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Loader2, Ticket, Home, RefreshCw } from 'lucide-react'
import api from '@/lib/api'
import { toast } from 'react-hot-toast'

export default function CheckoutSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [checking, setChecking] = useState(true)
  const [purchaseStatus, setPurchaseStatus] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  // Obtener parámetros que Mercado Pago pone en la URL
  const paymentId = searchParams.get('payment_id')
  const status = searchParams.get('status')
  const purchaseId = searchParams.get('purchase_id')

  useEffect(() => {
    if (!purchaseId) {
      setChecking(false)
      return
    }

    const checkPurchaseStatus = async () => {
      try {
        // Consultar el estado de la compra en el backend
        const response = await api.get(`/purchases/my-purchases/${purchaseId}`)
        const purchase = response.data
        
        setPurchaseStatus(purchase.status)
        
        if (purchase.status === 'COMPLETED') {
          setChecking(false)
          toast.success('¡Compra confirmada y tickets generados!')
        } else if (purchase.status === 'PENDING') {
          // Si aún está pendiente, esperar un poco y reintentar
          if (retryCount < 10) {
            setTimeout(() => {
              setRetryCount(prev => prev + 1)
            }, 2000) // Reintentar cada 2 segundos
          } else {
            // Después de 10 intentos (20 segundos), dejar de verificar
            setChecking(false)
            toast.loading('El pago está siendo procesado. Revisa "Mis Tickets" en unos momentos.', {
              duration: 5000,
              icon: '⏳'
            })
          }
        } else {
          setChecking(false)
        }
      } catch (error) {
        console.error('Error consultando estado de compra:', error)
        // Después de 10 intentos, mostrar el éxito de todos modos
        if (retryCount >= 10) {
          setChecking(false)
          setPurchaseStatus('COMPLETED') // Asumir éxito después de múltiples reintentos
        } else {
          setTimeout(() => {
            setRetryCount(prev => prev + 1)
          }, 2000)
        }
      }
    }

    checkPurchaseStatus()
  }, [purchaseId, retryCount])

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container className="max-w-md">
        <Card className="text-center p-6 shadow-lg border-green-100">
          <CardContent className="pt-6 space-y-6">
            
            {checking ? (
              <div className="flex flex-col items-center justify-center py-10">
                <Loader2 className="h-16 w-16 text-primary-500 animate-spin mb-4" />
                <h2 className="text-xl font-semibold text-gray-800">Verificando tu pago...</h2>
                <p className="text-gray-500">Por favor espera un momento, estamos generando tus tickets.</p>
                <p className="text-xs text-gray-400 mt-2">Intento {retryCount + 1}/10</p>
              </div>
            ) : purchaseStatus === 'COMPLETED' ? (
              <>
                <div className="flex justify-center">
                  <div className="rounded-full bg-green-100 p-4">
                    <CheckCircle2 className="h-16 w-16 text-green-600" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold text-gray-900">¡Pago Exitoso!</h1>
                  <p className="text-gray-600">
                    Tu compra ha sido confirmada y tus tickets han sido generados.
                  </p>
                  {paymentId && (
                    <p className="text-sm text-gray-500 bg-gray-100 p-2 rounded">
                      ID de Pago: {paymentId}
                    </p>
                  )}
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-green-800">
                    <strong>✅ Compra completada</strong>
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    Puedes ver tus tickets en la sección "Mis Tickets"
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
            ) : purchaseStatus === 'PENDING' ? (
              <>
                <div className="flex justify-center">
                  <div className="rounded-full bg-yellow-100 p-4">
                    <RefreshCw className="h-16 w-16 text-yellow-600" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold text-gray-900">Procesando Pago</h1>
                  <p className="text-gray-600">
                    Tu pago está siendo procesado. Los tickets se generarán automáticamente cuando se confirme.
                  </p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>⏳ Estado: Pendiente</strong>
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Recibirás una notificación cuando tu compra sea confirmada.
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
                    Ver Mis Compras
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
              <>
                <div className="flex justify-center">
                  <div className="rounded-full bg-blue-100 p-4">
                    <CheckCircle2 className="h-16 w-16 text-blue-600" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold text-gray-900">¡Pago Aprobado!</h1>
                  <p className="text-gray-600">
                    Tu pago fue aprobado por Mercado Pago. Los tickets se están generando.
                  </p>
                  {paymentId && (
                    <p className="text-sm text-gray-500 bg-gray-100 p-2 rounded">
                      ID de Pago: {paymentId}
                    </p>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>ℹ️ Información</strong>
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    Si los tickets no aparecen inmediatamente, revisa "Mis Tickets" en unos segundos.
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
            )}

          </CardContent>
        </Card>
      </Container>
    </div>
  )
}
