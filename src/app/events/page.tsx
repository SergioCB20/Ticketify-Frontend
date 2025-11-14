'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { EventCard } from '@/components/events/event-card'
import { Container } from '@/components/ui/container'
import { Navbar } from '@/components/layout/navbar'
import { toast } from 'react-hot-toast'
import type { Event } from '@/lib/types/event'
import { EventService } from '@/services/api/events'

export default function EventsPage() {
  const searchParams = useSearchParams()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  const fetchEvents = async () => {
    setLoading(true)
    try {
      // Verifica si hay filtros activos
      const hasFilters = Array.from(searchParams.keys()).length > 0

      let data: any[] = []

      if (hasFilters) {
        // 🔎 Si hay filtros, usa la búsqueda normal
        const filters: any = {}
        if (searchParams.get('q')) filters.query = searchParams.get('q')
        if (searchParams.get('categories')) filters.categories = searchParams.get('categories')
        if (searchParams.get('minPrice')) filters.min_price = Number(searchParams.get('minPrice'))
        if (searchParams.get('maxPrice')) filters.max_price = Number(searchParams.get('maxPrice'))
        if (searchParams.get('startDate')) filters.start_date = searchParams.get('startDate')
        if (searchParams.get('endDate')) filters.end_date = searchParams.get('endDate')
        if (searchParams.get('location')) filters.location = searchParams.get('location')
        if (searchParams.get('venue')) filters.venue = searchParams.get('venue')
        filters.status = 'PUBLISHED'

        const response = await EventService.search(filters, 1, 20)
        data = Array.isArray(response) ? response : response.events || []
      } else {
        // 🟢 Si no hay filtros, usa directamente los eventos activos
        const response = await EventService.getActiveEvents()
        data = Array.isArray(response) ? response : [response]
      }

      setEvents(data)
    } catch (error: any) {
      console.error('Error loading events:', error)
      toast.error(error.message || 'Error al cargar los eventos')
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  fetchEvents()
}, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Cargando eventos...</p>
        </div>
      </div>
    )
  }

  const hasFilters = searchParams.toString() !== ''

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar showSearch={true} />
      <Container className="py-10">
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {hasFilters ? 'Resultados de búsqueda' : 'Descubre eventos increíbles'}
          </h1>
          <p className="text-gray-600">
            {hasFilters
              ? `${events.length} evento${events.length !== 1 ? 's' : ''} encontrado${events.length !== 1 ? 's' : ''}`
              : 'Encuentra los mejores eventos cerca de ti.'}
          </p>
        </div>

        {events.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {hasFilters ? 'No se encontraron eventos' : 'No hay eventos disponibles'}
            </h3>
            <p className="text-sm text-gray-500">
              {hasFilters
                ? 'Intenta ajustar tus filtros de búsqueda.'
                : 'Vuelve pronto para descubrir nuevos eventos.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="transition-transform duration-200 hover:scale-[1.02]"
              >
                <EventCard
                  id={event.id}
                  title={event.title}
                  description={event.description || ''}
                  date={event.startDate}
                  location={event.venue}
                  price={event.minPrice ?? 0}
                  image={
                    event.multimedia && event.multimedia.length > 0
                      ? event.multimedia[0]
                      : 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800'
                  }
                  category={event.categoryId || 'Sin categoría'}
                  availableTickets={event.availableTickets}
                  onViewDetails={(id) => (window.location.href = `/events/${id}`)}
                />
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  )
}
