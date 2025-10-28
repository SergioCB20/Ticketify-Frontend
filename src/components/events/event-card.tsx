import React from 'react'
import { cn } from '../../lib/utils'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'

interface EventCardProps {
  id: string
  title: string
  description?: string
  date: string
  location: string
  price: number
  image?: string
  category?: string
  availableTickets?: number
  className?: string
  onViewDetails?: (id: string) => void
  onBuyTicket?: (id: string) => void
}

/**
 * EventCard Component
 * Tarjeta para mostrar información de un evento
 */
const EventCard: React.FC<EventCardProps> = ({
  id,
  title,
  description,
  date,
  location,
  price,
  image,
  category,
  availableTickets,
  className,
  onViewDetails,
  onBuyTicket,
}) => {
  
  // Formatear fecha
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  // Formatear precio
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(price)
  }

  const isLowStock = availableTickets !== undefined && availableTickets < 10
  const isSoldOut = availableTickets === 0

  return (
    <Card 
      variant="interactive" 
      className={cn('group h-full flex flex-col', className)}
    >
      {/* Imagen del evento */}
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-primary-200 to-secondary-200">
        {image ? (
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <svg
              className="h-16 w-16 text-white opacity-50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
              />
            </svg>
          </div>
        )}
        
        {/* Badges sobre la imagen */}
        <div className="absolute top-3 left-3 flex gap-2">
          {category && (
            <Badge variant="primary" size="sm">
              {category}
            </Badge>
          )}
          {isSoldOut && (
            <Badge variant="error" size="sm">
              Agotado
            </Badge>
          )}
          {isLowStock && !isSoldOut && (
            <Badge variant="warning" size="sm">
              ¡Últimos tickets!
            </Badge>
          )}
        </div>
      </div>

      {/* Contenido */}
      <CardHeader className="flex-grow">
        <CardTitle className="line-clamp-2 text-xl group-hover:text-primary-600 transition-colors">
          {title}
        </CardTitle>
        {description && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
            {description}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Fecha */}
        <div className="flex items-center text-sm text-gray-600">
          <svg
            className="mr-2 h-4 w-4 text-primary-500"
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
          {formatDate(date)}
        </div>

        {/* Ubicación */}
        <div className="flex items-center text-sm text-gray-600">
          <svg
            className="mr-2 h-4 w-4 text-primary-500"
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
          <span className="line-clamp-1">{location}</span>
        </div>

        {/* Precio */}
        <div className="flex items-baseline gap-1">
          <span className="text-sm text-gray-500">Desde</span>
          <span className="text-2xl font-bold text-primary-600">
            {formatPrice(price)}
          </span>
        </div>
      </CardContent>

      {/* Footer con acciones */}
      <CardFooter className="flex gap-2">
        <Button
          variant="outline"
          size="md"
          className="flex-1"
          onClick={() => onViewDetails?.(id)}
        >
          Ver detalles
        </Button>
        <Button
          variant="primary"
          size="md"
          className="flex-1"
          disabled={isSoldOut}
          onClick={() => onBuyTicket?.(id)}
        >
          {isSoldOut ? 'Agotado' : 'Comprar'}
        </Button>
      </CardFooter>
    </Card>
  )
}

EventCard.displayName = 'EventCard'

export { EventCard }
export type { EventCardProps }
