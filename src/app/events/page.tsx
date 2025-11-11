'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { EventCard } from '@/components/events/event-card'
import { Container } from '@/components/ui/container'
import { Navbar } from '@/components/layout/navbar'

interface Event {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  venue: string
  multimedia?: string[]
  minPrice?: number
  maxPrice?: number
  category?: {
    id: string
    name: string
    slug?: string
    icon?: string
    color?: string
  }
  availableTickets: number
  status: string
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

export default function EventsPage() {
  const searchParams = useSearchParams()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)
      try {
        // Construir URL con parámetros de búsqueda
        const params = new URLSearchParams()
        
        const query = searchParams.get('q')
        if (query) params.set('query', query)
        
        const categories = searchParams.get('categories')
        if (categories) params.set('categories', categories)
        
        const minPrice = searchParams.get('minPrice')
        if (minPrice) params.set('min_price', minPrice)
        
        const maxPrice = searchParams.get('maxPrice')
        if (maxPrice) params.set('max_price', maxPrice)
        
        const startDate = searchParams.get('startDate')
        if (startDate) params.set('start_date', startDate)
        
        const endDate = searchParams.get('endDate')
        if (endDate) params.set('end_date', endDate)
        
        const location = searchParams.get('location')
        if (location) params.set('location', location)
        
        const venue = searchParams.get('venue')
        if (venue) params.set('venue', venue)

        console.log('Search parameters:', params.toString())

        // Decidir qué endpoint usar
        const endpoint = params.toString() 
          ? `${API_URL}/events/search?${params.toString()}`
          : `${API_URL}/events/`

        console.log('Fetching from:', endpoint)
        const response = await fetch(endpoint)
        
        if (!response.ok) {
          const errorText = await response.text()
          console.error('Error response:', errorText)
          throw new Error('Error al cargar eventos')
        }
        
        const data = await response.json()
        console.log('Response data:', data)
        
        // El endpoint /search devuelve {events: [], total, page, ...}
        // El endpoint /events devuelve directamente un array
        if (params.toString()) {
          setEvents(data.events || [])
        } else {
          setEvents(data)
        }
      } catch (error) {
        console.error('Error loading events:', error)
        setEvents([])
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
      <Container className="py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {hasFilters ? 'Resultados de búsqueda' : 'Descubre eventos increíbles'}
          </h1>
          <p className="text-gray-600">
            {hasFilters
              ? `${events.length} evento${events.length !== 1 ? 's' : ''} encontrado${events.length !== 1 ? 's' : ''}`
              : 'Encuentra los mejores eventos cerca de ti'}
          </p>
          
          {/* Mostrar filtros activos */}
          {hasFilters && (
            <div className="mt-4 flex flex-wrap gap-2">
              {searchParams.get('q') && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-700">
                  Búsqueda: {searchParams.get('q')}
                </span>
              )}
              {searchParams.get('categories') && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-700">
                  Categorías seleccionadas
                </span>
              )}
              {(searchParams.get('minPrice') || searchParams.get('maxPrice')) && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-700">
                  Precio: {searchParams.get('minPrice') || '0'} - {searchParams.get('maxPrice') || '∞'}
                </span>
              )}
              {(searchParams.get('startDate') || searchParams.get('endDate')) && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-700">
                  Fechas filtradas
                </span>
              )}
              {searchParams.get('location') && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-700">
                  📍 Ubicación: {searchParams.get('location')}
                </span>
              )}
              {searchParams.get('venue') && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-700">
                  🏢 Local: {searchParams.get('venue')}
                </span>
              )}
            </div>
          )}
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12">
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
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {hasFilters ? 'No se encontraron eventos' : 'No hay eventos disponibles'}
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {hasFilters
                ? 'Intenta ajustar tus filtros de búsqueda'
                : 'Vuelve pronto para ver nuevos eventos.'}
            </p>
            {hasFilters && (
              <button
                onClick={() => window.location.href = '/events'}
                className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition-colors"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                description={event.description || ''}
                date={event.startDate}
                location={event.venue}
                image={event.multimedia && event.multimedia.length > 0 ? event.multimedia[0] : 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800'}
                price={event.minPrice || 0}
                category={event.category || 'Sin categoría'}
                availableTickets={event.availableTickets}
              />
            ))}
          </div>
        )}
      </Container>
    </div>
  )
}
