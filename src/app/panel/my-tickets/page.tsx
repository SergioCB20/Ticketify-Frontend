'use client'

// 1. Importar useCallback
import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Container } from '@/components/ui/container'
import { useRouter } from 'next/navigation'
import type { MyTicket } from '@/lib/types'
import { TicketsService } from '@/services/api/tickets'
import { MyTicketCard } from '@/components/profile/my-ticket-card'
// 2. Quitar 'Ticket' (no usado)
import { Loader2 } from 'lucide-react'
import Link from 'next/link' // <-- ¡IMPORTAR LINK!
import { Button } from '@/components/ui/button' // <-- ¡IMPORTAR BUTTON!
import { Home } from 'lucide-react'

// 3. Eliminar API_URL (ya no se usa)
// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function MyTicketsPage() {
  // 4. Quitar 'user' de useAuth si no se usa directamente (authLoading sí se usa)
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter() // router tampoco se usa, pero puede quedar por si se añade la redirección
  const [tickets, setTickets] = useState<MyTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'past'>('all')

  // Esto está correcto
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
  }, []) // Dependencia vacía está bien

  // Esto está correcto
  useEffect(() => {
    if (authLoading) return
    if (!isAuthenticated) {
      setLoading(false)
      // Opcional: router.push('/login?redirect=/panel/my-tickets');
      return
    }
    loadTickets()
    // 5. Quitar 'router' de las dependencias si no se usa
  }, [isAuthenticated, authLoading, loadTickets])
  
  // 6. Eliminar la función 'fetchTickets' (redundante)
  /*
  const fetchTickets = async () => {
    ...
  }
  */

  // Esto está correcto
  const getFilteredTickets = () => {
    const now = new Date()
    
    switch (filter) {
      case 'upcoming':
        return tickets.filter(ticket => new Date(ticket.event.startDate) >= now)
      case 'past':
        return tickets.filter(ticket => new Date(ticket.event.startDate) < now)
      default:
        return tickets
    }
  }

  const filteredTickets = getFilteredTickets()
  
  // Los comentarios de getStatus... están bien

  // 7. Combinar 'loading' y 'authLoading' y usar el componente Loader2
  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          {/* Usar el Loader2 importado */}
          <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Cargando tus tickets...</p>
        </div>
      </div>
    )
  }

  // El resto del código está perfecto

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center py-12 bg-white rounded-lg shadow p-8">
          <h3 className="text-xl font-semibold text-gray-800">Ocurrió un error</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Container className="py-10">
        <div className="space-y-6">

          <div className="flex justify-end">
            <Link href="/panel">
              <Button variant="outline">
                <Home size={18} className="mr-2" />
                Volver al Incio
              </Button>
            </Link>
        </div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Tickets</h1>
          <p className="mt-2 text-gray-500">
            Administra y visualiza todos tus tickets de eventos
          </p>
        </div>
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            Todos ({tickets.length})
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'upcoming'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            Próximos
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'past'
                ? 'bg-primary-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            Pasados
          </button>
        </div>

        {filteredTickets.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <svg
              className="mx-auto h-16 w-16 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No tienes tickets
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {filter === 'all'
                ? 'Comienza a comprar tickets para tus eventos favoritos.'
                : filter === 'upcoming'
                ? 'No tienes eventos próximos.'
                : 'No tienes eventos pasados.'}
            </p>
            {filter === 'all' && (
              <a
                href="/events"
                className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
              >
                Explorar eventos
              </a>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTickets.map((ticket) => (
              <MyTicketCard 
                key={ticket.id} 
                ticket={ticket}
                onTicketListed={loadTickets} 
              />
            ))}
          </div>
        )}
      </Container>
    </div>
  )
}