'use client'

import React, { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Button } from './button'
import { Input } from './input'

interface SearchFilter {
  categories: string[]
  priceRange: { min: number | null; max: number | null }
  dateRange: { start: string | null; end: string | null }
  location: string
}

interface AdvancedSearchProps {
  onSearch: (query: string, filters: SearchFilter) => void
  className?: string
  placeholder?: string
  categories?: Array<{ id: string; name: string; icon?: string }>
}

/**
 * AdvancedSearch Component
 * Barra de búsqueda con modal de filtros avanzados
 */
export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onSearch,
  className,
  placeholder = 'Buscar por eventos o artistas',
  categories = []
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [priceMin, setPriceMin] = useState<number | null>(null)
  const [priceMax, setPriceMax] = useState<number | null>(null)
  const [dateStart, setDateStart] = useState<string | null>(null)
  const [dateEnd, setDateEnd] = useState<string | null>(null)
  const [location, setLocation] = useState('')
  
  const modalRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)

  // Cerrar modal al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        searchRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSearch = () => {
    const filters: SearchFilter = {
      categories: selectedCategories,
      priceRange: { min: priceMin, max: priceMax },
      dateRange: { start: dateStart, end: dateEnd },
      location
    }
    onSearch(searchQuery, filters)
    setIsOpen(false)
  }

  const handleCancel = () => {
    setIsOpen(false)
  }

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const hasActiveFilters = 
    selectedCategories.length > 0 ||
    priceMin !== null ||
    priceMax !== null ||
    dateStart !== null ||
    dateEnd !== null ||
    location !== ''

  return (
    <div className={cn('relative', className)}>
      {/* Search Bar */}
      <div ref={searchRef} className="relative">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="w-full h-12 pl-12 pr-4 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          />
          {hasActiveFilters && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary-500 text-white text-xs font-medium">
                {selectedCategories.length +
                  (priceMin !== null ? 1 : 0) +
                  (priceMax !== null ? 1 : 0) +
                  (dateStart !== null ? 1 : 0) +
                  (dateEnd !== null ? 1 : 0) +
                  (location !== '' ? 1 : 0)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Filters Modal */}
      {isOpen && (
        <div
          ref={modalRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 animate-slide-down"
        >
          <div className="p-6">
            {/* Categories */}
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <svg
                  className="h-5 w-5 text-gray-700 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                <span className="text-sm font-semibold text-gray-900">Categorías</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => toggleCategory(category.id)}
                    className={cn(
                      'inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all',
                      selectedCategories.includes(category.id)
                        ? 'bg-primary-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    )}
                  >
                    {category.icon && <span className="mr-2">{category.icon}</span>}
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <svg
                  className="h-5 w-5 text-gray-700 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm font-semibold text-gray-900">Precio</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  value={priceMin ?? ''}
                  onChange={(e) => setPriceMin(e.target.value ? Number(e.target.value) : null)}
                  placeholder="Mín"
                  className="flex-1 h-10 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  value={priceMax ?? ''}
                  onChange={(e) => setPriceMax(e.target.value ? Number(e.target.value) : null)}
                  placeholder="Máx"
                  className="flex-1 h-10 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Date Range */}
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <svg
                  className="h-5 w-5 text-gray-700 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm font-semibold text-gray-900">Fechas</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="date"
                  value={dateStart ?? ''}
                  onChange={(e) => setDateStart(e.target.value || null)}
                  className="flex-1 h-10 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="date"
                  value={dateEnd ?? ''}
                  onChange={(e) => setDateEnd(e.target.value || null)}
                  className="flex-1 h-10 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Location */}
            <div className="mb-6">
              <div className="flex items-center mb-3">
                <svg
                  className="h-5 w-5 text-gray-700 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-sm font-semibold text-gray-900">Ubicación</span>
              </div>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ciudad, distrito, local..."
                className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="md"
                fullWidth
                onClick={handleCancel}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                size="md"
                fullWidth
                onClick={handleSearch}
              >
                Buscar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

AdvancedSearch.displayName = 'AdvancedSearch'

export default AdvancedSearch
