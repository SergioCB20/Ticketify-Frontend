'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { CheckCircle } from 'lucide-react'

interface PurchaseSuccessPageProps {
  params: {
    listingId: string
  }
}

export default function MarketplacePurchaseSuccessPage({ params }: PurchaseSuccessPageProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow py-12">
        <Container>
          <div className="max-w-3xl mx-auto">
            {/* Header de éxito */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8 text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                ¡Compra Exitosa en el Marketplace!
              </h1>
              <p className="text-lg text-gray-700">
                Tu ticket ha sido transferido y se generó un nuevo código QR.
              </p>
            </div>

            {/* Nota informativa */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <p className="text-sm text-blue-800">
                <strong>Importante:</strong> Este es un nuevo ticket con un código QR único. 
                El ticket del vendedor anterior ha sido invalidado automáticamente.
              </p>
            </div>

            {/* Información */}
            <div className="text-center mb-8">
              <p className="text-gray-600 mb-4">
                Para ver tu ticket con código QR, visita la sección "Mis Tickets"
              </p>
            </div>

            {/* Botones de acción */}
            <div className="flex gap-4 justify-center">
              <Button
                variant="primary"
                onClick={() => router.push('/panel/my-tickets')}
              >
                Ver Mis Tickets
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push('/marketplace')}
              >
                Volver al Marketplace
              </Button>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </div>
  )
}
