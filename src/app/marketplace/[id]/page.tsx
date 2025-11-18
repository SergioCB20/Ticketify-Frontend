'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { toast } from 'react-hot-toast'
import { MarketplaceService } from '@/services/api/marketplace'
import { StorageService } from '@/services/storage'
import { Loader2, ShoppingCart, CreditCard, User, MapPin, Calendar, Clock, TrendingUp } from 'lucide-react'

export default function MarketplaceCheckoutPage() {
  const { id } = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [listing, setListing] = useState<any>(null)

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const data = await MarketplaceService.getListingById(id as string)
        setListing(data)
      } catch (error: any) {
        toast.error(error.message || 'Error al cargar el listado')
        router.push('/marketplace')
      } finally {
        setLoading(false)
      }
    }

    fetchListing()
  }, [id, router])

  const handleCheckout = async () => {
    const token = StorageService.getAccessToken()
    if (!token) {
      toast.error('Debes iniciar sesión para continuar')
      router.push('/login')
      return
    }

    setProcessing(true)

    try {
      // Crear preferencia de pago
      const response = await MarketplaceService.createMarketplacePurchase(listing.id, {})

      // Redirigir a MercadoPago
      window.location.href = response.initPoint

    } catch (error: any) {
      console.error('Error al procesar el pago:', error)
      toast.error(error.message || 'Error al procesar el pago')
      setProcessing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    )
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <p className="text-xl text-gray-700 mb-4">Listado no encontrado</p>
        <Button onClick={() => router.push('/marketplace')}>
          Volver al Marketplace
        </Button>
      </div>
    )
  }

  const discountPercentage = listing.originalPrice > 0
    ? Math.round(((listing.originalPrice - listing.price) / listing.originalPrice) * 100)
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <Container className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => router.push('/marketplace')}
                disabled={processing}
              >
                ← Volver
              </Button>
              <h1 className="text-xl font-bold text-gray-900">Comprar en Marketplace</h1>
            </div>
            <Badge variant="secondary">Reventa Verificada</Badge>
          </div>
        </Container>
      </div>

      <Container className="py-8 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información del ticket */}
            <Card className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{listing.title}</h2>
                  <p className="text-gray-600">{listing.description}</p>
                </div>
                {discountPercentage > 0 && (
                  <Badge variant="success" className="flex-shrink-0">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {discountPercentage}% OFF
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-gray-700">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Ubicación</p>
                    <p className="font-medium">{listing.event?.venue || 'No especificado'}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-gray-700">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Fecha del evento</p>
                    <p className="font-medium">
                      {listing.event?.startDate 
                        ? new Date(listing.event.startDate).toLocaleDateString('es-PE', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })
                        : 'No especificado'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Hora</p>
                    <p className="font-medium">
                      {listing.event?.startDate 
                        ? new Date(listing.event.startDate).toLocaleTimeString('es-PE', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'No especificado'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-gray-700">
                  <ShoppingCart className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Tipo de entrada</p>
                    <p className="font-medium">{listing.ticket?.ticket_type?.name || 'General'}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Información del vendedor */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Vendedor</h3>
              <div className="flex items-center gap-4">
                <Avatar
                  src={listing.seller?.profilePhoto}
                  alt={`${listing.seller?.firstName} ${listing.seller?.lastName}`}
                  size="lg"
                  fallback={listing.seller?.firstName?.[0] || 'V'}
                />
                <div>
                  <p className="font-semibold text-gray-900">
                    {listing.seller?.firstName} {listing.seller?.lastName}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                    <User className="w-4 h-4" />
                    <span>Vendedor verificado</span>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  ✓ Compra protegida por Ticketify. Recibirás tu ticket inmediatamente después del pago.
                </p>
              </div>
            </Card>
          </div>

          {/* Columna lateral: Resumen de pago */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Resumen de Compra</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-600">Precio de reventa</p>
                    {listing.originalPrice > listing.price && (
                      <p className="text-xs text-gray-500 line-through">S/ {listing.originalPrice.toFixed(2)}</p>
                    )}
                  </div>
                  <p className="text-lg font-bold text-gray-900">S/ {listing.price.toFixed(2)}</p>
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-gray-900">Total a Pagar</span>
                    <span className="text-2xl font-bold text-primary-600">S/ {listing.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleCheckout}
                disabled={processing}
                className="mb-4"
              >
                {processing ? (
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

              <div className="space-y-2 text-xs text-gray-500">
                <p className="flex items-start gap-2">
                  <span>✓</span>
                  <span>Pago 100% seguro procesado por MercadoPago</span>
                </p>
                <p className="flex items-start gap-2">
                  <span>✓</span>
                  <span>Ticket digital enviado inmediatamente</span>
                </p>
                <p className="flex items-start gap-2">
                  <span>✓</span>
                  <span>Garantía de autenticidad Ticketify</span>
                </p>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  )
}
