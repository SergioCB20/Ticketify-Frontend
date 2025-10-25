'use client'

import React from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { EventCard } from '@/components/events/event-card'
import { Badge } from '@/components/ui/badge'

export default function HomePage() {
  // Mock data - en producción vendría del backend
  const featuredEvents = [
    {
      id: '1',
      title: 'Concierto Rock en Vivo',
      description: 'Las mejores bandas de rock nacional e internacional en un solo escenario',
      date: '2025-11-15T20:00:00',
      location: 'Estadio Nacional, Lima',
      price: 150,
      image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
      category: 'Música',
      availableTickets: 250,
    },
    {
      id: '2',
      title: 'Festival de Comedia Stand Up',
      description: 'Los comediantes más divertidos del momento en una noche inolvidable',
      date: '2025-11-20T19:00:00',
      location: 'Teatro Municipal, Lima',
      price: 80,
      image: 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800&q=80',
      category: 'Comedia',
      availableTickets: 5,
    },
    {
      id: '3',
      title: 'Conferencia Tech Summit 2025',
      description: 'Las últimas tendencias en tecnología e innovación',
      date: '2025-12-01T09:00:00',
      location: 'Centro de Convenciones, San Isidro',
      price: 200,
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
      category: 'Tecnología',
      availableTickets: 150,
    },
  ]

  const categories = [
    { name: 'Música', icon: '🎵', count: 245 },
    { name: 'Deportes', icon: '⚽', count: 189 },
    { name: 'Teatro', icon: '🎭', count: 134 },
    { name: 'Comedia', icon: '😂', count: 98 },
    { name: 'Tecnología', icon: '💻', count: 76 },
    { name: 'Arte', icon: '🎨', count: 156 },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar
        onLogin={() => console.log('Login clicked')}
      />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 text-white overflow-hidden">
          {/* Patrón decorativo de fondo */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          </div>

          <Container className="relative py-20 md:py-32">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="secondary" size="lg" className="mb-6 bg-white/20 text-white border-white/30">
                🎉 Bienvenido a Ticketify
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Descubre los mejores eventos cerca de ti
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-white/90">
                Miles de eventos increíbles esperándote. Compra tus tickets de forma segura y sencilla.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="secondary" 
                  size="xl"
                  className="shadow-xl hover:shadow-2xl"
                >
                  Explorar eventos
                </Button>
                <Button 
                  variant="outline" 
                  size="xl"
                  className="bg-white/10 border-white text-white hover:bg-white/20 backdrop-blur-sm"
                >
                  Cómo funciona
                </Button>
              </div>
            </div>
          </Container>
        </section>

        {/* Search Section */}
        <section className="bg-white py-6 shadow-md -mt-8 relative z-10">
          <Container>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Buscar eventos..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div className="flex-1">
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                  <option>Todas las categorías</option>
                  <option>Música</option>
                  <option>Deportes</option>
                  <option>Teatro</option>
                </select>
              </div>
              <Button variant="primary" size="lg" className="md:w-auto">
                Buscar
              </Button>
            </div>
          </Container>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-gray-50">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Explora por categoría
              </h2>
              <p className="text-lg text-gray-600">
                Encuentra eventos que se adapten a tus intereses
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <button
                  key={category.name}
                  className="group p-6 bg-white rounded-xl border-2 border-gray-200 hover:border-primary-500 hover:shadow-lg transition-all duration-200"
                >
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {category.count} eventos
                  </p>
                </button>
              ))}
            </div>
          </Container>
        </section>

        {/* Featured Events Section */}
        <section className="py-16 bg-white">
          <Container>
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  Eventos destacados
                </h2>
                <p className="text-lg text-gray-600">
                  No te pierdas estos increíbles eventos
                </p>
              </div>
              <Button variant="outline" size="lg" className="hidden md:flex">
                Ver todos
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredEvents.map((event) => (
                <EventCard
                  key={event.id}
                  {...event}
                  onViewDetails={(id) => console.log('View details:', id)}
                  onBuyTicket={(id) => console.log('Buy ticket:', id)}
                />
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Button variant="outline" size="lg" fullWidth>
                Ver todos los eventos
              </Button>
            </div>
          </Container>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gradient-to-br from-primary-600 to-secondary-600 text-white">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">10K+</div>
                <div className="text-lg text-white/80">Eventos publicados</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">500K+</div>
                <div className="text-lg text-white/80">Tickets vendidos</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">50K+</div>
                <div className="text-lg text-white/80">Usuarios activos</div>
              </div>
              <div>
                <div className="text-4xl md:text-5xl font-bold mb-2">98%</div>
                <div className="text-lg text-white/80">Satisfacción</div>
              </div>
            </div>
          </Container>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gray-50">
          <Container>
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-12 text-center text-white shadow-xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                ¿Organizas eventos?
              </h2>
              <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                Publica tus eventos en Ticketify y llega a miles de personas interesadas
              </p>
              <Button variant="secondary" size="xl" className="shadow-xl">
                Comenzar ahora
              </Button>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  )
}
