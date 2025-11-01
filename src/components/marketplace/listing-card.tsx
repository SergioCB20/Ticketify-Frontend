'use client'

import React from 'react'
import { cn, formatPrice, formatDate } from '@/lib/utils'
import type { MarketplaceListing } from '@/lib/types'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Tag, Calendar, MapPin, User, ArrowRight } from 'lucide-react'

interface ListingCardProps {
  listing: MarketplaceListing
  className?: string
  onViewListing?: (id: string) => void
}

/**
 * ListingCard Component
 * Tarjeta para mostrar un ticket en reventa (Marketplace)
 */
const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  className,
  onViewListing,
}) => {
  
  const { event, seller, price, originalPrice, title } = listing

  // Calcular descuento
  const hasDiscount = originalPrice && price < originalPrice;
  const discountPercent = hasDiscount 
    ? Math.round(((originalPrice! - price) / originalPrice!) * 100)
    : 0;

  return (
    <Card 
      variant="interactive" 
      className={cn('group h-full flex flex-col', className)}
    >
      {/* Imagen del evento */}
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-primary-200 to-secondary-200">
        <img
          src={event.multimedia?.[0] || 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80'}
          alt={event.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Badges sobre la imagen */}
        <div className="absolute top-3 left-3">
          {hasDiscount && (
            <Badge variant="success">
              {discountPercent}% OFF
            </Badge>
          )}
        </div>
      </div>

      {/* Contenido */}
      <CardHeader className="pb-3">
        {/* Vendedor */}
        <div className="flex items-center gap-2 mb-2">
          <Avatar 
            src={seller.profilePhoto} 
            fallback={`${seller.firstName[0]}${seller.lastName[0]}`}
            size="xs"
            shape="circle"
          />
          <span className="text-xs font-medium text-gray-700">
            Vendido por {seller.firstName} {seller.lastName[0]}.
          </span>
        </div>

        {/* Título del Listado */}
        <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {title}
        </h3>
        
        {/* Título del Evento */}
        <p className="text-sm text-gray-500 line-clamp-1">
          Para: {event.title}
        </p>
      </CardHeader>

      <CardContent className="space-y-2 pt-0 pb-4 flex-grow">
        {/* Fecha */}
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="mr-2 h-4 w-4 text-primary-500" />
          {formatDate(event.startDate, { month: 'long', day: 'numeric' })}
        </div>

        {/* Ubicación */}
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="mr-2 h-4 w-4 text-primary-500" />
          <span className="line-clamp-1">{event.venue}</span>
        </div>
      </CardContent>

      {/* Footer con precio y acción */}
      <CardFooter className="flex items-end justify-between">
        {/* Precio */}
        <div className="flex flex-col items-start">
          <span className="text-2xl font-bold text-primary-600">
            {formatPrice(price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(originalPrice!)}
            </span>
          )}
        </div>
        
        {/* Botón */}
        <Button
          variant="primary"
          size="md"
          className="group"
          onClick={() => onViewListing?.(listing.id)}
        >
          Comprar
          <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
        </Button>
      </CardFooter>
    </Card>
  )
}

ListingCard.displayName = 'ListingCard'

export { ListingCard }