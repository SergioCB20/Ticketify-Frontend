# Ejemplos de Uso - Sistema de Búsqueda Avanzada

## 1. Uso Básico del AdvancedSearch

```tsx
import { AdvancedSearch } from '@/components/ui/advanced-search'
import { useRouter } from 'next/navigation'

export default function MyPage() {
  const router = useRouter()

  const handleSearch = (query: string, filters: any) => {
    // Construir URL con parámetros
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (filters.categories.length > 0) {
      params.set('categories', filters.categories.join(','))
    }
    // ... más filtros
    
    router.push(`/events?${params.toString()}`)
  }

  return (
    <AdvancedSearch
      onSearch={handleSearch}
      placeholder="Buscar eventos..."
      categories={[
        { id: '1', name: 'Música', icon: '🎵' },
        { id: '2', name: 'Deportes', icon: '⚽' },
      ]}
    />
  )
}
```

## 2. Integración en Navbar

```tsx
import { Navbar } from '@/components/layout/navbar'

// En página que necesita búsqueda
export default function EventsLayout({ children }) {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    // Cargar categorías del backend
    fetch('http://localhost:8000/api/v1/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
  }, [])

  return (
    <div>
      <Navbar showSearch={true} categories={categories} />
      {children}
    </div>
  )
}
```

## 3. Página de Eventos con Búsqueda

```tsx
'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function EventsPage() {
  const searchParams = useSearchParams()
  const [events, setEvents] = useState([])

  useEffect(() => {
    const fetchEvents = async () => {
      // Construir URL del backend
      const params = new URLSearchParams()
      
      const query = searchParams.get('q')
      if (query) params.set('query', query)
      
      const categories = searchParams.get('categories')
      if (categories) params.set('categories', categories)
      
      // Más parámetros...
      
      const url = params.toString()
        ? `http://localhost:8000/api/v1/events/search?${params}`
        : 'http://localhost:8000/api/v1/events'

      const response = await fetch(url)
      const data = await response.json()
      setEvents(data)
    }

    fetchEvents()
  }, [searchParams])

  return (
    <div>
      {events.map(event => (
        <EventCard key={event.id} {...event} />
      ))}
    </div>
  )
}
```

## 4. Componente de Filtros Activos

```tsx
interface ActiveFiltersProps {
  searchParams: URLSearchParams
  onClear: () => void
}

export function ActiveFilters({ searchParams, onClear }: ActiveFiltersProps) {
  const filters = []

  if (searchParams.get('q')) {
    filters.push({
      label: `Búsqueda: ${searchParams.get('q')}`,
      key: 'q'
    })
  }

  if (searchParams.get('categories')) {
    filters.push({
      label: 'Categorías seleccionadas',
      key: 'categories'
    })
  }

  if (searchParams.get('minPrice') || searchParams.get('maxPrice')) {
    const min = searchParams.get('minPrice') || '0'
    const max = searchParams.get('maxPrice') || '∞'
    filters.push({
      label: `Precio: ${min} - ${max}`,
      key: 'price'
    })
  }

  if (filters.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {filters.map((filter) => (
        <span
          key={filter.key}
          className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-primary-100 text-primary-700"
        >
          {filter.label}
        </span>
      ))}
      <button
        onClick={onClear}
        className="text-sm text-gray-600 hover:text-gray-900 underline"
      >
        Limpiar filtros
      </button>
    </div>
  )
}

// Uso:
<ActiveFilters 
  searchParams={searchParams} 
  onClear={() => router.push('/events')} 
/>
```

## 5. Hook Personalizado para Búsqueda

```tsx
// hooks/useEventSearch.ts
import { useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'

export function useEventSearch() {
  const searchParams = useSearchParams()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams()
        
        // Mapear todos los parámetros
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

        const endpoint = params.toString()
          ? `http://localhost:8000/api/v1/events/search?${params}`
          : 'http://localhost:8000/api/v1/events'

        const response = await fetch(endpoint)
        
        if (!response.ok) {
          throw new Error('Error al cargar eventos')
        }
        
        const data = await response.json()
        setEvents(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [searchParams])

  return { events, loading, error }
}

// Uso:
export default function EventsPage() {
  const { events, loading, error } = useEventSearch()

  if (loading) return <div>Cargando...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {events.map(event => (
        <EventCard key={event.id} {...event} />
      ))}
    </div>
  )
}
```

## 6. Debounce para Búsqueda de Texto

```tsx
// hooks/useDebounce.ts
import { useState, useEffect } from 'react'

export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Uso en AdvancedSearch:
const [searchQuery, setSearchQuery] = useState('')
const debouncedQuery = useDebounce(searchQuery, 500)

useEffect(() => {
  if (debouncedQuery) {
    // Hacer búsqueda automática
    handleSearch()
  }
}, [debouncedQuery])
```

## 7. Persistencia de Filtros en LocalStorage

```tsx
// utils/searchPersistence.ts
const STORAGE_KEY = 'lastSearch'

export const saveSearch = (params: URLSearchParams) => {
  localStorage.setItem(STORAGE_KEY, params.toString())
}

export const loadLastSearch = (): URLSearchParams | null => {
  const saved = localStorage.getItem(STORAGE_KEY)
  return saved ? new URLSearchParams(saved) : null
}

export const clearLastSearch = () => {
  localStorage.removeItem(STORAGE_KEY)
}

// Uso:
const handleSearch = (query: string, filters: any) => {
  const params = new URLSearchParams()
  // ... construir params
  
  saveSearch(params)
  router.push(`/events?${params}`)
}

// Cargar última búsqueda:
useEffect(() => {
  const lastSearch = loadLastSearch()
  if (lastSearch) {
    router.push(`/events?${lastSearch}`)
  }
}, [])
```

## 8. Búsquedas Guardadas

```tsx
interface SavedSearch {
  id: string
  name: string
  params: URLSearchParams
  createdAt: Date
}

export function useSavedSearches() {
  const [searches, setSearches] = useState<SavedSearch[]>([])

  const saveSearch = (name: string, params: URLSearchParams) => {
    const newSearch: SavedSearch = {
      id: Date.now().toString(),
      name,
      params,
      createdAt: new Date()
    }
    
    const updated = [...searches, newSearch]
    setSearches(updated)
    localStorage.setItem('savedSearches', JSON.stringify(updated))
  }

  const loadSearch = (id: string) => {
    const search = searches.find(s => s.id === id)
    if (search) {
      router.push(`/events?${search.params}`)
    }
  }

  const deleteSearch = (id: string) => {
    const updated = searches.filter(s => s.id !== id)
    setSearches(updated)
    localStorage.setItem('savedSearches', JSON.stringify(updated))
  }

  return { searches, saveSearch, loadSearch, deleteSearch }
}
```

## 9. Integración con Analytics

```tsx
const handleSearch = (query: string, filters: any) => {
  // Trackear búsqueda
  if (window.gtag) {
    window.gtag('event', 'search', {
      search_term: query,
      filters: {
        categories: filters.categories.length,
        hasPrice: filters.priceRange.min || filters.priceRange.max,
        hasDate: filters.dateRange.start || filters.dateRange.end,
        hasLocation: !!filters.location
      }
    })
  }

  // Continuar con la búsqueda
  const params = new URLSearchParams()
  // ...
}
```

## 10. Tests Unitarios

```tsx
// __tests__/AdvancedSearch.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { AdvancedSearch } from '@/components/ui/advanced-search'

describe('AdvancedSearch', () => {
  it('should render search input', () => {
    render(<AdvancedSearch onSearch={() => {}} categories={[]} />)
    expect(screen.getByPlaceholderText(/buscar/i)).toBeInTheDocument()
  })

  it('should open modal on focus', () => {
    render(<AdvancedSearch onSearch={() => {}} categories={[]} />)
    const input = screen.getByPlaceholderText(/buscar/i)
    fireEvent.focus(input)
    expect(screen.getByText(/categorías/i)).toBeInTheDocument()
  })

  it('should call onSearch with correct parameters', () => {
    const mockOnSearch = jest.fn()
    render(
      <AdvancedSearch 
        onSearch={mockOnSearch} 
        categories={[{ id: '1', name: 'Música' }]} 
      />
    )
    
    const input = screen.getByPlaceholderText(/buscar/i)
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'concierto' } })
    
    const searchButton = screen.getByText(/buscar/i)
    fireEvent.click(searchButton)
    
    expect(mockOnSearch).toHaveBeenCalledWith(
      'concierto',
      expect.any(Object)
    )
  })
})
```

## Notas Importantes

1. **Siempre validar entrada del usuario** antes de enviar al backend
2. **Manejar errores** de red y del servidor apropiadamente
3. **Mostrar loading states** para mejor UX
4. **Implementar rate limiting** en el cliente para evitar spam
5. **Usar TypeScript** para type safety en filtros y parámetros
6. **Documentar** cambios en los filtros para el equipo
