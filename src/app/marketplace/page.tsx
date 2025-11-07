'use client'

import React, { useState, useEffect } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { ListingCard } from '@/components/marketplace/listing-card' // (El componente que creamos arriba)
import { MarketplaceService } from '@/services/api/marketplace' // (El servicio que creamos)
import type { MarketplaceListing } from '@/lib/types'
import { Search, Tag, Loader2 } from 'lucide-react'

export default function MarketplacePage() {
  const [listings, setListings] = useState<MarketplaceListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Estados de Paginación y Filtros
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')

  // Cargar datos del backend
  useEffect(() => {
    const loadListings = async () => {
      setLoading(true);
      setError(null);
      try {
        // Usamos el servicio que creamos
        const data = await MarketplaceService.getListings(currentPage, 12, searchTerm);
        
        // Asumimos que la API devuelve un objeto Paginado
        // Si tu API de marketplace devuelve un array simple, ajusta esto:
        setListings(data.items || []); // data.items o data
        setTotalPages(data.totalPages || 1); // data.totalPages o 1
        
      } catch (err) {
        console.error("Error fetching listings:", err);
        setError("No se pudieron cargar los tickets. Intenta de nuevo.");
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, [currentPage, searchTerm]); // Recargar cuando cambie la página o la búsqueda

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Resetear a la página 1 al buscar
    // El useEffect se encargará de recargar
  }

  const handleViewListing = (id: string) => {
    // Aquí navegarías a la página de detalle del listado
    console.log("Navegar a /marketplace/", id);
    // router.push(`/marketplace/${id}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow">
        <Container className="py-12 md:py-16">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Marketplace de Reventa
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Encuentra tickets para tus eventos favoritos, vendidos de forma segura por otros fans.
            </p>
          </div>

          {/* Filtros y Búsqueda */}
          <form onSubmit={handleSearch} className="mb-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Búsqueda */}
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar por evento, artista o ciudad..."
                  className="h-12 pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Botón de Búsqueda */}
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
              {listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onViewListing={handleViewListing}
                />
              ))}
            </div>
          )}

          {/* Paginación (Opcional pero recomendado) */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-12">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => p - 1)}
                  disabled={currentPage === 1 || loading}
                >
                  Anterior
                </Button>
                <span className="text-sm text-gray-700">
                  Página <span className="font-semibold">{currentPage}</span> de <span className="font-semibold">{totalPages}</span>
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(p => p + 1)}
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