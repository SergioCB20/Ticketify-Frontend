'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Container } from '@/components/ui/container'
import { Loader2, Ticket } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import type { MyTicket } from '@/lib/types'
import { TicketsService } from '@/services/api/tickets'
import { MyTicketCard } from '@/components/profile/my-ticket-card' // (El componente que creamos)

export default function MyTicketsPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  
  const [tickets, setTickets] = useState<MyTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Función para cargar/refrescar los tickets
  const loadTickets = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await TicketsService.getMyTickets()
      setTickets(data)
    } catch (err: any) {
      setError(err.message || 'No se pudieron cargar tus tickets.')
    } finally {
      setLoading(false)
    }
  }, []) // No depende de nada, pero usamos useCallback

  useEffect(() => {
    // Si la autenticación está cargando, no hacer nada
    if (authLoading) return;

    // Si no está autenticado, redirigir al login
    if (!isAuthenticated) {
      router.push('/login?redirect=/profile/tickets');
      return;
    }
    
    // Si está autenticado, cargar los tickets
    loadTickets()
  }, [isAuthenticated, authLoading, router, loadTickets])

  // Renderizado
  const renderContent = () => {
    if (loading || authLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
        </div>
      )
    }

    if (error) {
      return (
        <div className="text-center h-64 flex flex-col justify-center items-center">
          <h3 className="text-xl font-semibold text-gray-800">Ocurrió un error</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      )
    }

    if (tickets.length === 0) {
      return (
        <div className="text-center h-64 flex flex-col justify-center items-center">
          <Ticket className="w-16 h-16 text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800">No tienes tickets</h3>
          <p className="text-gray-600">Cuando compres un ticket, aparecerá aquí.</p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets.map((ticket) => (
          <MyTicketCard 
            key={ticket.id} 
            ticket={ticket}
            onTicketListed={loadTickets} // <-- Pasa la función para refrescar
          />
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <Container className="py-12 md:py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-10">
            Mis Tickets
          </h1>
          {renderContent()}
        </Container>
      </main>
      <Footer />
    </div>
  )
}