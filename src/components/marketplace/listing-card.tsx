'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Tag, ArrowRight, ImageOff } from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'
import type { MarketplaceListing } from '@/lib/types/marketplace'

interface ListingCardProps {
  listing: MarketplaceListing
}

export function ListingCard({ listing }: ListingCardProps) {
  const router = useRouter()
  
  // Adaptador de datos flexible
  const l = listing as any
  const event = l.event || listing.ticket?.event
  const price = listing.price
  const originalPrice = l.original_price || listing.ticket?.price || 0
  const ticketType = l.ticket_type?.name || listing.ticket?.ticketType?.name || 'Entrada General'
  
  const [imageError, setImageError] = useState(false)

  if (!event) return null

  // Lógica de Imagen: Soporta camelCase y snake_case
  const eventImageSource = 
    !imageError && (
      event.photoUrl || 
      event.photo_url || 
      event.coverImage || 
      event.cover_image || 
      event.imageUrl || 
      event.image
    );

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col h-full border border-gray-200 bg-white">
      {/* Imagen */}
      <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
        {eventImageSource ? (
          <img
            src={eventImageSource}
            alt={event.title || 'Evento'}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 text-gray-400">
            <ImageOff className="w-10 h-10 mb-2 opacity-30" />
            <span className="text-xs font-medium">Sin imagen</span>
          </div>
        )}
        
        {event.category && (
          <Badge className="absolute top-3 right-3 bg-white/90 text-primary-700 hover:bg-white shadow-sm backdrop-blur-sm border-0 font-medium">
            {event.category.name}
          </Badge>
        )}
      </div>

      <CardHeader className="p-4 pb-2 space-y-1">
        <h3 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors" title={event.title}>
          {event.title}
        </h3>
        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="w-3.5 h-3.5 mr-1 text-gray-400 flex-shrink-0" />
          <span className="truncate">{event.venue || 'Ubicación por confirmar'}</span>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2 flex-grow space-y-3">
        <div className="flex items-center text-xs font-medium bg-primary-50 text-primary-700 px-2.5 py-1 rounded-md w-fit">
          <Calendar className="w-3.5 h-3.5 mr-1.5" />
          <span>
            {event.startDate ? formatDate(event.startDate, { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }) : 'Fecha pendiente'}
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-3">
          <div className="flex items-center text-sm text-gray-600">
            <Tag className="w-3.5 h-3.5 mr-1.5 text-gray-400" />
            <span className="truncate max-w-[150px]" title={ticketType}>{ticketType}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 bg-gray-50 flex items-center justify-between border-t border-gray-100 mt-auto">
        <div>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Precio</p>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-primary-700">
              {formatPrice(price)}
            </span>
            {originalPrice > 0 && price < originalPrice && (
              <span className="text-xs text-gray-400 line-through decoration-red-400 decoration-1">
                {formatPrice(originalPrice)}
              </span>
            )}
          </div>
        </div>
        
        <Button 
          onClick={() => router.push(`/marketplace/${listing.id}`)}
          className="bg-primary-600 hover:bg-primary-700 shadow-sm hover:shadow text-white h-9 px-4"
          size="sm"
        >
          Comprar <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
      </CardFooter>
    </Card>
  )
}