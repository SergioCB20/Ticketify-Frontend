"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { CheckCircle2, Ticket, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"

export default function MarketplaceSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const listingId = searchParams.get("listing_id")
  const paymentId = searchParams.get("payment_id")

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <Container className="max-w-md text-center">
        <div className="bg-white p-6 rounded-xl shadow space-y-6 border-green-100">

          <div className="flex justify-center">
            <div className="rounded-full bg-green-100 p-4">
              <CheckCircle2 className="h-16 w-16 text-green-600" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-900">¡Pago Exitoso!</h1>

          <p className="text-gray-600">
            Tu compra en el Marketplace ha sido procesada correctamente.
          </p>

          {paymentId && (
            <p className="text-sm text-gray-500 bg-gray-100 p-2 rounded">
              ID de Pago: {paymentId}
            </p>
          )}

          {listingId && (
            <p className="text-sm text-gray-500">
              Listing ID: {listingId}
            </p>
          )}

          <div className="flex flex-col gap-3 pt-4">
            <Button 
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

        </div>
      </Container>
    </div>
  )
}
