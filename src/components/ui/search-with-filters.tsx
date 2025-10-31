'use client'

import React, { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

interface FilterOption {
  label: string
  value: string
  icon?: string
}

interface SearchFilters {
  price?: { min?: number; max?: number }
  categories?: string[]
  date?: { start?: string; end?: string }
  location?: string
  venue?: string
}

interface SearchWithFiltersProps {
  onSearch: (query: string, filters: SearchFilters) => void
  categories?: FilterOption[]
  className?: string
}

export const SearchWithFilters: React.FC<SearchWithFiltersProps> = ({
  onSearch,
  categories = [],
  className
}) => {
  const [query, setQuery] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [filters, setFilters] = useState<SearchFilters>({
    price: {},
    categories: [],
    date: {},
    location: '',
    venue: ''
  })
  
  // Estados para controlar qué modal está abierto
  const [showPriceModal, setShowPriceModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showDateModal, setShowDateModal] = useState(false)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [showVenueModal, setShowVenueModal] = useState(false)
  
  // Estados temporales para los modales
  const [tempPrice, setTempPrice] = useState<{ min?: number; max?: number }>({})
  const [priceTab, setPriceTab] = useState<'range' | 'free'>('range')
  
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false)
      }
    }

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isExpanded])

  // Sincronizar tempPrice con filters al abrir el modal
  useEffect(() => {
    if (showPriceModal) {
      setTempPrice(filters.price || {})
      setPriceTab((filters.price?.min === 0 && filters.price?.max === 0) ? 'free' : 'range')
    }
  }, [showPriceModal, filters.price])

  const handleSearch = () => {
    onSearch(query, filters)
    setIsExpanded(false)
  }

  // Ejecutar búsqueda cuando cambian los filtros
  useEffect(() => {
    if (Object.keys(filters.price || {}).length > 0 || 
        (filters.categories && filters.categories.length > 0) ||
        Object.keys(filters.date || {}).length > 0 ||
        filters.location) {
      onSearch(query, filters)
    }
  }, [filters])

  const handleCategoryToggle = (value: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories?.includes(value)
        ? prev.categories.filter(c => c !== value)
        : [...(prev.categories || []), value]
    }))
  }

  const handleSavePrice = () => {
    if (priceTab === 'free') {
      setFilters(prev => ({ ...prev, price: { min: 0, max: 0 } }))
    } else {
      setFilters(prev => ({ ...prev, price: tempPrice }))
    }
    setShowPriceModal(false)
  }

  const removePriceFilter = () => {
    setFilters(prev => ({ ...prev, price: {} }))
  }

  const removeCategoryFilter = (value: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories?.filter(c => c !== value)
    }))
  }

  const removeDateFilter = () => {
    setFilters(prev => ({ ...prev, date: {} }))
  }

  const removeLocationFilter = () => {
    setFilters(prev => ({ ...prev, location: '' }))
  }

  const removeVenueFilter = () => {
    setFilters(prev => ({ ...prev, venue: '' }))
  }

  const handleClearFilters = () => {
    setFilters({
      price: {},
      categories: [],
      date: {},
      location: '',
      venue: ''
    })
    setQuery('')
  }

  const hasPriceFilter = filters.price?.min !== undefined || filters.price?.max !== undefined
  const hasCategoryFilter = (filters.categories?.length || 0) > 0
  const hasDateFilter = filters.date?.start !== undefined || filters.date?.end !== undefined
  const hasLocationFilter = !!filters.location
  const hasVenueFilter = !!filters.venue

  // Formatear el texto del filtro de precio
  const getPriceFilterText = () => {
    if (!hasPriceFilter) return 'Precio'
    if (filters.price?.min === 0 && filters.price?.max === 0) return 'Gratis'
    if (filters.price?.min && filters.price?.max) {
      return `S/${filters.price.min} - S/${filters.price.max}`
    }
    if (filters.price?.min) return `Desde S/${filters.price.min}`
    if (filters.price?.max) return `Hasta S/${filters.price.max}`
    return 'Precio'
  }

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      {/* Simple Search Bar - Estado Colapsado */}
      {!isExpanded && (
        <div 
          onClick={() => setIsExpanded(true)}
          className="bg-white rounded-full shadow-md px-6 py-4 cursor-text hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center gap-3 text-gray-400">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-gray-500">Buscar por eventos o artistas</span>
          </div>
        </div>
      )}

      {/* Expanded Search with Filters */}
      {isExpanded && (
        <div className="absolute top-0 left-0 right-0 bg-white rounded-xl shadow-lg p-4 animate-slide-down z-50">
          <div className="flex items-center gap-2 text-gray-400 mb-4">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por eventos o artistas"
              className="flex-1 outline-none text-gray-700"
              autoFocus
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setShowPriceModal(true)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors text-sm",
                hasPriceFilter
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Precio
            </button>

            <button
              onClick={() => setShowCategoryModal(true)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors text-sm",
                hasCategoryFilter
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Categorías
            </button>

            <button
              onClick={() => setShowDateModal(true)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors text-sm",
                hasDateFilter
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Fechas
            </button>

            <button
              onClick={() => setShowLocationModal(true)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors text-sm",
                hasLocationFilter
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Ubicación
            </button>

            <button
              onClick={() => setShowVenueModal(true)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-colors text-sm",
                hasVenueFilter
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Local
            </button>
          </div>

          {/* Active Filters Display */}
          {(hasPriceFilter || hasCategoryFilter || hasDateFilter || hasLocationFilter || hasVenueFilter) && (
            <div className="flex flex-wrap gap-2 mb-4">
              {hasPriceFilter && (
                <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
                  <span>{getPriceFilterText()}</span>
                  <button
                    onClick={removePriceFilter}
                    className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {filters.categories?.map((cat) => {
                const category = categories.find(c => c.value === cat)
                return (
                  <div key={cat} className="flex items-center gap-1 px-3 py-1 bg-emerald-100 rounded-full text-sm">
                    <span>{category?.label || cat}</span>
                    <button
                      onClick={() => removeCategoryFilter(cat)}
                      className="ml-1 hover:bg-emerald-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )
              })}
              {hasDateFilter && (
                <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
                  <span>
                    {filters.date?.start && filters.date?.end
                      ? `${filters.date.start} - ${filters.date.end}`
                      : filters.date?.start || filters.date?.end}
                  </span>
                  <button
                    onClick={removeDateFilter}
                    className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {hasLocationFilter && (
                <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
                  <span>📍 {filters.location}</span>
                  <button
                    onClick={removeLocationFilter}
                    className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              {hasVenueFilter && (
                <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm">
                  <span>🏢 {filters.venue}</span>
                  <button
                    onClick={removeVenueFilter}
                    className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleClearFilters}
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
            >
              Cancelar
            </button>
            <button
              onClick={handleSearch}
              className="flex-1 px-4 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors text-sm font-medium"
            >
              Buscar
            </button>
          </div>
        </div>
      )}

      {/* Price Modal */}
      {showPriceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center items-center z-50 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl p-6 animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Precio</h2>
              <button
                onClick={() => setShowPriceModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setPriceTab('range')}
                className={cn(
                  "flex-1 px-4 py-2 rounded-lg font-medium transition-colors",
                  priceTab === 'range'
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700"
                )}
              >
                Rango de precios
              </button>
              <button
                onClick={() => setPriceTab('free')}
                className={cn(
                  "flex-1 px-4 py-2 rounded-lg font-medium transition-colors",
                  priceTab === 'free'
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-700"
                )}
              >
                Eventos gratuitos
              </button>
            </div>

            {/* Price Inputs */}
            {priceTab === 'range' && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    S/.
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={tempPrice.min || ''}
                      onChange={(e) => setTempPrice(prev => ({
                        ...prev,
                        min: e.target.value ? Number(e.target.value) : undefined
                      }))}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="0"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col">
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    S/.
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={tempPrice.max || ''}
                      onChange={(e) => setTempPrice(prev => ({
                        ...prev,
                        max: e.target.value ? Number(e.target.value) : undefined
                      }))}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                      placeholder="0"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col">
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleSavePrice}
              className="w-full px-4 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors text-sm font-medium"
            >
              Guardar
            </button>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl p-6 max-h-[80vh] overflow-y-auto animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Categorías</h2>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Search input for categories */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Conciertos"
                className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Categories List */}
            <div className="space-y-2">
              {categories.map((category) => {
                const isSelected = filters.categories?.includes(category.value)
                return (
                  <button
                    key={category.value}
                    onClick={() => handleCategoryToggle(category.value)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left",
                      isSelected
                        ? "bg-emerald-100 text-emerald-900"
                        : "hover:bg-gray-50"
                    )}
                  >
                    <div className={cn(
                      "w-5 h-5 rounded border-2 flex items-center justify-center",
                      isSelected ? "bg-emerald-500 border-emerald-500" : "border-gray-300"
                    )}>
                      {isSelected && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <span className="flex-1 font-medium">{category.label}</span>
                  </button>
                )
              })}
            </div>

            <button
              onClick={() => setShowCategoryModal(false)}
              className="w-full mt-6 px-4 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors text-sm font-medium"
            >
              Guardar
            </button>
          </div>
        </div>
      )}

      {/* Date Modal */}
      {showDateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl p-6 animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Fechas</h2>
              <button
                onClick={() => setShowDateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de inicio
                </label>
                <input
                  type="date"
                  value={filters.date?.start || ''}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    date: { ...prev.date, start: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de fin
                </label>
                <input
                  type="date"
                  value={filters.date?.end || ''}
                  onChange={(e) => setFilters(prev => ({
                    ...prev,
                    date: { ...prev.date, end: e.target.value }
                  }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            <button
              onClick={() => setShowDateModal(false)}
              className="w-full px-4 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors text-sm font-medium"
            >
              Guardar
            </button>
          </div>
        </div>
      )}

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl p-6 animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Ubicación</h2>
              <button
                onClick={() => setShowLocationModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ciudad, región o país
              </label>
              <input
                type="text"
                placeholder="Ej: Lima, San Isidro, Miraflores"
                value={filters.location || ''}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  location: e.target.value
                }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <p className="mt-2 text-sm text-gray-500">
                Busca eventos por ciudad o ubicación geográfica
              </p>
            </div>

            <button
              onClick={() => setShowLocationModal(false)}
              className="w-full px-4 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors text-sm font-medium"
            >
              Guardar
            </button>
          </div>
        </div>
      )}

      {/* Venue Modal */}
      {showVenueModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-2xl p-6 animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Local</h2>
              <button
                onClick={() => setShowVenueModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del local o venue
              </label>
              <input
                type="text"
                placeholder="Ej: Estadio Nacional, Teatro Municipal, Centro de Convenciones"
                value={filters.venue || ''}
                onChange={(e) => setFilters(prev => ({
                  ...prev,
                  venue: e.target.value
                }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
              <p className="mt-2 text-sm text-gray-500">
                Busca eventos por el nombre específico del lugar o recinto
              </p>
            </div>

            <button
              onClick={() => setShowVenueModal(false)}
              className="w-full px-4 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors text-sm font-medium"
            >
              Guardar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
