'use client'

import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MarketplaceService } from '@/services/api/marketplace'
import type { MarketplaceListing } from '@/lib/types'
import { Search, Tag, Loader2, TrendingUp, Calendar, MapPin, User as UserIcon, DollarSign } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'

export default function MarketplacePage() {
  const router = useRouter()
  const [listings, setListings] = useState<MarketplaceListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Estados de Paginación y Filtros
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [minPrice, setMinPrice] = useState<number | undefined>()
  const [maxPrice, setMaxPrice] = useState<number | undefined>()
  const [orderBy, setOrderBy] = useState<string>('newest')

  // Cargar datos del backend
  useEffect(() => {
    const loadListings = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await MarketplaceService.getListings(
          currentPage,
          12,
          searchTerm,
          minPrice,
          maxPrice,
          orderBy
        )
        
        setListings(data.items || [])
        setTotalPages(data.totalPages || 1)
        
      } catch (err) {
        console.error("Error fetching listings:", err)
        setError("No se pudieron cargar los tickets. Intenta de nuevo.")
      } finally {
        setLoading(false)
      }
    }

    loadListings()
  }, [currentPage, searchTerm, minPrice, maxPrice, orderBy])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1)
  }

  const handleViewListing = (id: string) => {
    router.push(`/marketplace/${id}`)
  }

  const getDiscountPercentage = (original: number, current: number) => {
    if (original <= current) return 0
    return Math.round(((original - current) / original) * 100)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-secondary-600 via-secondary-500 to-primary-500 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          </div>

          <Container className="relative py-16 md:py-24">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="default" className="mb-6 bg-white/20 text-white border-white/30">
                🎫 Marketplace de Reventa
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Compra y Vende Tickets de Forma Segura
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Encuentra tickets para tus eventos favoritos o vende los que no puedas usar
              </p>
            </div>
          </Container>
        </section>

        <Container className="py-12 md:py-16">
          
          {/* Filtros y Búsqueda */}
          <div className="mb-8 bg-white rounded-xl shadow-sm p-6">
            <form onSubmit={handleSearch} className="space-y-4">
              {/* Búsqueda principal */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar por evento, artista o ciudad..."
                  className="h-14 pl-12 text-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Filtros adicionales */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Input
                  type="number"
                  placeholder="Precio mínimo"
                  value={minPrice || ''}
                  onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
                />
                <Input
                  type="number"
                  placeholder="Precio máximo"
                  value={maxPrice || ''}
                  onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
                />
                <select
                  className="h-12 px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={orderBy}
                  onChange={(e) => setOrderBy(e.target.value)}
                >
                  <option value="newest">Más recientes</option>
                  <option value="price_asc">Precio: menor a mayor</option>
                  <option value="price_desc">Precio: mayor a menor</option>
                </select>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="h-12"
                  loading={loading}
                >
                  Buscar
                </Button>
              </div>
            </form>
          </div>

          {/* Contenido: Grid de Listados */}
          {loading && (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
            </div>
          )}

          {!loading && error && (
            <div className="text-center h-64 flex flex-col justify-center items-center">
              <Tag className="w-16 h-16 text-red-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">Ocurrió un error</h3>
              <p className="text-gray-600">{error}</p>
            </div>
          )}

          {!loading && !error && listings.length === 0 && (
            <div className="text-center h-64 flex flex-col justify-center items-center">
              <Tag className="w-16 h-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-800">No hay tickets en reventa</h3>
              <p className="text-gray-600">Vuelve a intentarlo más tarde o con otra búsqueda.</p>
            </div>
          )}

          {!loading && !error && listings.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listings.map((listing) => {
                const discount = getDiscountPercentage(listing.originalPrice, listing.price)
                
                return (
                  <Card 
                    key={listing.id}
                    className="group hover:shadow-xl transition-all duration-200 cursor-pointer overflow-hidden"
                    onClick={() => handleViewListing(listing.id)}
                  >
                    {/* Imagen del evento */}
                    <div className="relative h-48 bg-gradient-to-br from-primary-500 to-secondary-500 overflow-hidden">
                      {listing.event?.photoUrl ? (
                        <img
                          src={listing.event.photoUrl}
                          alt={listing.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Calendar className="w-16 h-16 text-white/50" />
                        </div>
                      )}
                      
                      {/* Badge de descuento */}
                      {discount > 0 && (
                        <div className="absolute top-3 right-3">
                          <Badge variant="success" className="shadow-lg">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            {discount}% OFF
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Contenido */}
                    <div className="p-4">
                      {/* Título */}
                      <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                        {listing.title}
                      </h3>

                      {/* Información del evento */}
                      <div className="space-y-2 mb-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span className="line-clamp-1">{listing.event?.venue || 'No especificado'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          <span>
                            {listing.event?.startDate
                              ? new Date(listing.event.startDate).toLocaleDateString('es-PE', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })
                              : 'Fecha por confirmar'}
                          </span>
                        </div>
                      </div>

                      {/* Vendedor */}
                      <div className="flex items-center gap-2 mb-4 pb-4 border-b">
                        <Avatar
                          src={listing.seller?.profilePhoto}
                          alt={`${listing.seller?.firstName} ${listing.seller?.lastName}`}
                          size="sm"
                          fallback={listing.seller?.firstName?.[0] || 'V'}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500">Vendedor</p>
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {listing.seller?.firstName} {listing.seller?.lastName}
                          </p>
                        </div>
                      </div>

                      {/* Precio */}
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Precio</p>
                          <div className="flex items-baseline gap-2">
                            <p className="text-2xl font-bold text-primary-600">
                              S/ {listing.price.toFixed(2)}
                            </p>
                            {listing.originalPrice > listing.price && (
                              <p className="text-sm text-gray-500 line-through">
                                S/ {listing.originalPrice.toFixed(2)}
                              </p>
                            )}
                          </div>
                        </div>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleViewListing(listing.id)
                          }}
                        >
                          Comprar
                        </Button>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}

          {/* Paginación */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || loading}
                >
                  Anterior
                </Button>
                <span className="text-sm text-gray-700">
                  Página <span className="font-semibold">{currentPage}</span> de{' '}
                  <span className="font-semibold">{totalPages}</span>
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || loading}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          )}

        </Container>
      </main>

      <Footer />
    </div>
  )
}
