'use client'

import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MarketplaceService } from '@/services/api/marketplace'
import { API_URL } from '@/lib/constants' // CORRECCIÓN: Importamos la URL base dinámica
import type { MarketplaceListing } from '@/lib/types'
import { Search, Loader2, TrendingUp, Calendar, MapPin, Filter, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { toast } from 'react-hot-toast'

export default function MarketplacePage() {
  const router = useRouter()
  const [listings, setListings] = useState<MarketplaceListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Estados de Paginación y Filtros
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [minPrice, setMinPrice] = useState<number | undefined>()
  const [maxPrice, setMaxPrice] = useState<number | undefined>()
  const [orderBy, setOrderBy] = useState<string>('newest')
  const [showFilters, setShowFilters] = useState(false)

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
        setTotal(data.total || 0)
        
      } catch (err) {
        console.error("Error fetching listings:", err)
        setError("No se pudieron cargar los tickets. Intenta de nuevo.")
        toast.error("Error al cargar el marketplace")
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

  const handleClearFilters = () => {
    setSearchTerm('')
    setMinPrice(undefined)
    setMaxPrice(undefined)
    setOrderBy('newest')
    setCurrentPage(1)
  }

  const handleViewListing = (id: string) => {
    router.push(`/marketplace/${id}`)
  }

  const getDiscountPercentage = (original: number, current: number) => {
    if (original <= current) return 0
    return Math.round(((original - current) / original) * 100)
  }

  const hasActiveFilters = searchTerm || minPrice !== undefined || maxPrice !== undefined || orderBy !== 'newest'

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

          <Container className="relative py-16 md:py-20">
            <div className="max-w-3xl mx-auto text-center">
              <Badge variant="default" className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm">
                🎫 Marketplace de Reventa Segura
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Compra y Vende Tickets
                <br />
                <span className="text-white/90">de Forma Segura</span>
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Encuentra tickets para tus eventos favoritos o vende los que no puedas usar. 
                Transacciones 100% seguras con Ticketify.
              </p>
              
              <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <p className="text-3xl font-bold">{total}</p>
                  <p className="text-sm text-white/80">Tickets Disponibles</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <p className="text-3xl font-bold">100%</p>
                  <p className="text-sm text-white/80">Seguro</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <p className="text-3xl font-bold">5%</p>
                  <p className="text-sm text-white/80">Comisión</p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        <Container className="py-12 md:py-16">
          
          {/* Barra de búsqueda y filtros */}
          <div className="mb-8">
            <Card className="p-6 shadow-lg border-gray-200">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Buscar por evento, artista o ciudad..."
                    className="h-14 pl-12 pr-32 text-lg border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                    {hasActiveFilters && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleClearFilters}
                        className="h-10"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Limpiar
                      </Button>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowFilters(!showFilters)}
                      className="h-10"
                    >
                      <Filter className="w-4 h-4 mr-1" />
                      Filtros
                    </Button>
                  </div>
                </div>

                {showFilters && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Precio Mínimo
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">S/</span>
                        <Input
                          type="number"
                          placeholder="0"
                          className="pl-8"
                          value={minPrice || ''}
                          onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Precio Máximo
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">S/</span>
                        <Input
                          type="number"
                          placeholder="1000"
                          className="pl-8"
                          value={maxPrice || ''}
                          onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ordenar por
                      </label>
                      <select
                        className="h-12 w-full px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={orderBy}
                        onChange={(e) => setOrderBy(e.target.value)}
                      >
                        <option value="newest">Más recientes</option>
                        <option value="price_asc">Precio: menor a mayor</option>
                        <option value="price_desc">Precio: mayor a menor</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        fullWidth
                        className="h-12"
                        loading={loading}
                      >
                        <Search className="w-4 h-4 mr-2" />
                        Buscar
                      </Button>
                    </div>
                  </div>
                )}
              </form>

              {hasActiveFilters && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {searchTerm && (
                    <Badge variant="secondary" className="px-3 py-1">
                      Búsqueda: "{searchTerm}"
                    </Badge>
                  )}
                  {minPrice !== undefined && (
                    <Badge variant="secondary" className="px-3 py-1">
                      Desde: S/ {minPrice}
                    </Badge>
                  )}
                  {maxPrice !== undefined && (
                    <Badge variant="secondary" className="px-3 py-1">
                      Hasta: S/ {maxPrice}
                    </Badge>
                  )}
                </div>
              )}
            </Card>
          </div>

          <div className="mb-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {hasActiveFilters ? 'Resultados de búsqueda' : 'Tickets Disponibles'}
              </h2>
              <p className="text-gray-600 mt-1">
                {loading ? (
                  'Cargando...'
                ) : (
                  `${total} ticket${total !== 1 ? 's' : ''} ${hasActiveFilters ? 'encontrado' : 'disponible'}${total !== 1 ? 's' : ''}`
                )}
              </p>
            </div>
          </div>

          {loading && (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-primary-500 animate-spin mx-auto" />
                <p className="mt-4 text-gray-600">Cargando marketplace...</p>
              </div>
            </div>
          )}

          {!loading && error && (
            <Card className="text-center py-16 border-red-200 bg-red-50">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <X className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Ocurrió un error</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button variant="primary" onClick={() => window.location.reload()}>
                  Reintentar
                </Button>
              </div>
            </Card>
          )}

          {!loading && !error && listings.length === 0 && (
            <Card className="text-center py-16 border-gray-200">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {hasActiveFilters ? 'No se encontraron tickets' : 'No hay tickets en reventa'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {hasActiveFilters 
                    ? 'Intenta ajustar tus filtros de búsqueda' 
                    : 'Vuelve más tarde o explora nuestros eventos'}
                </p>
                {hasActiveFilters ? (
                  <Button variant="outline" onClick={handleClearFilters}>
                    Limpiar Filtros
                  </Button>
                ) : (
                  <Button variant="primary" onClick={() => router.push('/events')}>
                    Explorar Eventos
                  </Button>
                )}
              </div>
            </Card>
          )}

          {!loading && !error && listings.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listings.map((listing) => {
                const discount = listing.originalPrice 
                  ? getDiscountPercentage(listing.originalPrice, listing.price) 
                  : 0
                
                // CORRECCIÓN: Construimos la URL de la imagen usando API_URL
                // Esto permite que funcione en localhost y en ngrok.
                let imageUrl: string | null = null;
                if (event?.photoUrl) {
                    // 1. Extraemos solo la ruta (path) de la URL, ignorando el dominio que venga del backend
                    let path = event.photoUrl;
                    if (path.startsWith('http')) {
                        try {
                            const urlObj = new URL(path);
                            path = urlObj.pathname + urlObj.search;
                        } catch (e) {
                            console.warn('Error al parsear URL de imagen:', path);
                        }
                    }
                    
                    // 2. Nos aseguramos de que el API_URL no tenga slash al final
                    const base = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
                    
                    // 3. Nos aseguramos de que el path tenga slash al inicio
                    const cleanPath = path.startsWith('/') ? path : `/${path}`;
                    
                    // 4. Construimos la nueva URL usando TU configuración de ngrok (API_URL)
                    imageUrl = `${base}${cleanPath}`;
                }
                
                return (
                  <Card 
                    key={listing.id}
                    className="group hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden border-gray-200 hover:border-primary-300"
                    onClick={() => handleViewListing(listing.id)}
                  >
                    {/* Imagen del evento */}
                    <div className="relative h-48 bg-gradient-to-br from-primary-500 to-secondary-500 overflow-hidden">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={event?.title || listing.title} // CORRECCIÓN: Usamos event?.title
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Calendar className="w-16 h-16 text-white/50" />
                        </div>
                      )}
                      
                      {/* Badge de descuento */}
                      {discount > 0 && (
                        <div className="absolute top-3 right-3">
                          <Badge variant="success" className="shadow-lg backdrop-blur-sm bg-green-500">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            {discount}% OFF
                          </Badge>
                        </div>
                      )}
                      
                      {/* Badge de "Nuevo" */}
                      {new Date(listing.createdAt).getTime() > Date.now() - 24 * 60 * 60 * 1000 && (
                        <div className="absolute top-3 left-3">
                          <Badge variant="default" className="shadow-lg backdrop-blur-sm bg-primary-600">
                            ✨ Nuevo
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Contenido */}
                    <div className="p-5">
                      {/* Título */}
                      <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors min-h-[3.5rem]">
                        {event?.title || listing.title} {/* CORRECCIÓN: Usamos event?.title */}
                      </h3>

                      {/* Información del evento */}
                      <div className="space-y-2 mb-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 flex-shrink-0 text-gray-400" />
                          <span className="line-clamp-1">{event?.venue || 'Ubicación no especificada'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 flex-shrink-0 text-gray-400" />
                          <span>
                            {event?.startDate
                              ? new Date(event.startDate).toLocaleDateString('es-PE', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })
                              : 'Fecha por confirmar'}
                          </span>
                        </div>
                      </div>

                      {/* Vendedor */}
                      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
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
                            {listing.originalPrice && listing.originalPrice > listing.price && (
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
                          className="shadow-md hover:shadow-lg transition-shadow"
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
              <Card className="px-6 py-4 shadow-md">
                <div className="flex items-center gap-6">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1 || loading}
                    className="min-w-[100px]"
                  >
                    ← Anterior
                  </Button>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Página <span className="font-semibold text-gray-900">{currentPage}</span> de{' '}
                      <span className="font-semibold text-gray-900">{totalPages}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {total} resultado{total !== 1 ? 's' : ''} total{total !== 1 ? 'es' : ''}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages || loading}
                    className="min-w-[100px]"
                  >
                    Siguiente →
                  </Button>
                </div>
              </Card>
            </div>
          )}

        </Container>
      </main>

      <Footer />
    </div>
  )
}