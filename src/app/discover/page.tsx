'use client'

import React, { useState } from 'react'
import { EventCard } from '@/components/events/event-card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Filter, Search } from 'lucide-react'

// Tipos
interface Event {
  id: string
  title: string
  description: string
  date: string
  location: string
  price: number
  image: string
  category: string
  availableTickets?: number
}

// Datos de ejemplo (simulando eventos de Lima)
const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Expo Manualidades Internacional Lima Navidad',
    description: 'Gran feria de manualidades y artesanías navideñas con expositores nacionales e internacionales',
    date: '2024-10-25',
    location: 'Lima',
    price: 10.00,
    image: '/events/expo-navidad.jpg',
    category: 'Arte & Cultura',
    availableTickets: 150
  },
  {
    id: '2',
    title: 'MALI - Museo de Arte de Lima',
    description: 'Exposición permanente de arte peruano e internacional. Entrada libre.',
    date: '2024-10-25',
    location: 'Lima',
    price: 0.00,
    image: '/events/mali.jpg',
    category: 'Arte & Cultura',
    availableTickets: 500
  },
  {
    id: '3',
    title: 'MICRO CIUDAD 3 - SÉ LO QUE HICISTE Y LA CHICA RED FLAG',
    description: 'Doble función de teatro con las obras más aclamadas de la temporada',
    date: '2024-10-25',
    location: 'Lima',
    price: 35.00,
    image: '/events/micro-ciudad.jpg',
    category: 'Teatro',
    availableTickets: 45
  },
  {
    id: '4',
    title: 'DanSa - La Magia de Teresa',
    description: 'Espectáculo de danza contemporánea que explora la magia y el misterio',
    date: '2024-10-25',
    location: 'Lima',
    price: 79.00,
    image: '/events/dansa.jpg',
    category: 'Danza',
    availableTickets: 80
  },
  {
    id: '5',
    title: 'CENSO MORAL - Comedia Stand Up',
    description: 'Noche de comedia con los mejores comediantes de Lima',
    date: '2024-10-25',
    location: 'Lima',
    price: 45.00,
    image: '/events/censo-moral.jpg',
    category: 'Comedia',
    availableTickets: 120
  },
  {
    id: '6',
    title: 'LIBER - Special Show',
    description: 'Concierto especial de música alternativa con artistas invitados',
    date: '2024-10-30',
    location: 'Lima',
    price: 55.00,
    image: '/events/liber.jpg',
    category: 'Música',
    availableTickets: 200
  },
  {
    id: '7',
    title: 'Tour Nocturno - Cementerio Baquíjano',
    description: 'Recorrido guiado nocturno por el histórico cementerio con historias y leyendas',
    date: '2024-10-30',
    location: 'Lima',
    price: 40.00,
    image: '/events/tour-nocturno.jpg',
    category: 'Tour',
    availableTickets: 30
  },
  {
    id: '8',
    title: 'RUTA DEL HORROR MALI',
    description: 'Experiencia inmersiva de terror en el museo. Solo para mayores de 16 años',
    date: '2024-10-30',
    location: 'Lima',
    price: 65.00,
    image: '/events/ruta-horror.jpg',
    category: 'Entretenimiento',
    availableTickets: 8
  },
]

// Categorías disponibles
const CATEGORIES = [
  'Todos los eventos',
  'Arte & Cultura',
  'Música',
  'Teatro',
  'Deportes',
  'Comedia',
  'Danza',
  'Tour',
  'Entretenimiento',
  'Conferencias',
]

// Opciones de ordenamiento
const SORT_OPTIONS = [
  { label: 'Próximos', value: 'date-asc' },
  { label: 'Fecha: más lejanos', value: 'date-desc' },
  { label: 'Precio: menor a mayor', value: 'price-asc' },
  { label: 'Precio: mayor a menor', value: 'price-desc' },
  { label: 'Popularidad', value: 'popularity' },
]

export default function DiscoverPage() {
  const [selectedCategory, setSelectedCategory] = useState('Todos los eventos')
  const [selectedSort, setSelectedSort] = useState('date-asc')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Filtrar y ordenar eventos
  const filteredEvents = MOCK_EVENTS
    .filter(event => {
      // Filtro por categoría
      if (selectedCategory !== 'Todos los eventos' && event.category !== selectedCategory) {
        return false
      }
      // Filtro por búsqueda
      if (searchQuery && !event.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      switch (selectedSort) {
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case 'price-asc':
          return a.price - b.price
        case 'price-desc':
          return b.price - a.price
        default:
          return 0
      }
    })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Descubrir
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary-100">
              {selectedCategory}
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Encuentra los mejores eventos en Lima. Conciertos, teatro, deportes y más.
            </p>

            {/* Barra de búsqueda */}
            <div className="max-w-2xl">
              <Input
                type="text"
                placeholder="Buscar eventos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="h-5 w-5" />}
                className="py-4 text-lg shadow-lg border-0 focus:ring-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filtros y Ordenamiento */}
      <section className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Filtro por mes */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Filtro por mes:</span>
              <div className="min-w-[200px]">
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  options={CATEGORIES.map(cat => ({ label: cat, value: cat }))}
                  className="text-sm"
                />
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>

            {/* Ordenar por */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Ordenar por:</span>
              <div className="min-w-[200px]">
                <Select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  options={SORT_OPTIONS}
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          {/* Filtros adicionales móvil */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg md:hidden">
              <h3 className="font-semibold text-gray-900 mb-3">Categorías</h3>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? 'primary' : 'default'}
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Contador de resultados */}
      <section className="container mx-auto px-4 py-6">
        <p className="text-sm text-gray-600">
          {filteredEvents.length} evento{filteredEvents.length !== 1 ? 's' : ''} encontrado{filteredEvents.length !== 1 ? 's' : ''}
        </p>
      </section>

      {/* Grid de eventos */}
      <section className="container mx-auto px-4 pb-16">
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                description={event.description}
                date={event.date}
                location={event.location}
                price={event.price}
                image={event.image}
                category={event.category}
                availableTickets={event.availableTickets}
                onViewDetails={(id) => console.log('Ver detalles:', id)}
                onBuyTicket={(id) => console.log('Comprar ticket:', id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No se encontraron eventos
            </h3>
            <p className="text-gray-600 mb-6">
              Intenta ajustar tus filtros o busca otro término
            </p>
            <Button
              variant="primary"
              onClick={() => {
                setSelectedCategory('Todos los eventos')
                setSearchQuery('')
              }}
            >
              Limpiar filtros
            </Button>
          </div>
        )}
      </section>

      {/* Paginación (placeholder) */}
      {filteredEvents.length > 0 && (
        <section className="container mx-auto px-4 pb-16">
          <div className="flex justify-center gap-2">
            <Button variant="outline" size="sm" disabled>
              Anterior
            </Button>
            <Button variant="primary" size="sm">1</Button>
            <Button variant="outline" size="sm">2</Button>
            <Button variant="outline" size="sm">3</Button>
            <Button variant="outline" size="sm">
              Siguiente
            </Button>
          </div>
        </section>
      )}
    </div>
  )
}
