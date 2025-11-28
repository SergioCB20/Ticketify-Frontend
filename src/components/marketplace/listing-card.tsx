'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Tag, ArrowRight, ImageOff } from 'lucide-react'
import { formatPrice, formatDate } from '@/lib/utils'
import type { MarketplaceListing } from '@/lib/types/marketplace'

interface ListingCardProps {
  listing: MarketplaceListing
}

export function ListingCard({ listing }: ListingCardProps) {
  const router = useRouter()
  
  // --- ADAPTADOR DE DATOS ---
  const l = listing as any
  const event = l.event || listing.ticket?.event
  
  const price = listing.price
  const originalPrice = l.original_price || listing.ticket?.price || 0
  const ticketType = l.ticket_type?.name || listing.ticket?.ticketType?.name || 'Entrada General'
  
  // Estado para controlar si la imagen falla al cargar
  const [imgError, setImgError] = useState(false)

  // --- LÓGICA DE FOTO SIMPLIFICADA ---
  // Usamos la URL directa tal como viene del backend, igual que en EventCard
  const imageUrl = 
    event?.photoUrl || 
    event?.photo_url || 
    event?.coverImage || 
    event?.cover_image || 
    event?.imageUrl || 
    event?.image

  const imageUrl =
    event.photoUrl ||
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80'

  // ✅ Redirigir al checkout del marketplace
  const handleRedirectToCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para comprar')
      router.push('/login')
      return
    }

    if (user && !(user.roles ?? []).includes('ATTENDEE')) {
      toast.error('Solo los asistentes pueden comprar tickets.')
      return
    }

    if (user?.id === seller.id) {
      toast.error('No puedes comprar tu propio ticket.')
      return
    }

    // Redirigir al checkout con parámetros del marketplace
    router.push(
      `/marketplace/checkout?listingId=${listing.id}&price=${price}&eventName=${encodeURIComponent(event.title)}&eventId=${event.id}`
    )
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group flex flex-col h-full border border-gray-200 bg-white">
      {/* SECCIÓN DE IMAGEN */}
      <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
        {imageUrl && !imgError ? (
          <img
            src={imageUrl}
            alt={event.title || 'Evento'}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              console.error('Error cargando imagen en Marketplace:', imageUrl)
              setImgError(true)
            }}
            // IMPORTANTE: referrerPolicy="no-referrer" suele ayudar con imágenes externas/ngrok
            // al no enviar la URL de origen que podría ser rechazada.
            referrerPolicy="no-referrer"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
            <div className="flex flex-col items-center">
               <ImageOff className="w-10 h-10 mb-2 opacity-30" />
               <span className="text-xs font-medium">Sin imagen</span>
            </div>
          </div>
        )}
        
        {/* Badge de Categoría */}
        {event.category && (
          <Badge className="absolute top-3 right-3 bg-white/90 text-primary-700 hover:bg-white shadow-sm backdrop-blur-sm border-0 font-medium">
            {event.category.name || event.category}
          </Badge>
        )}
      </div>

      <CardHeader className="p-4 pb-2 space-y-1">
        <h3 className="font-bold text-lg text-gray-900 line-clamp-1 group-hover:text-primary-600 transition-colors" title={event.title}>
          {event.title}
        </h3>
        
        {/* Ubicación con SVG idéntico al EventCard original */}
        <div className="flex items-center text-sm text-gray-600">
          <svg
            className="mr-2 h-4 w-4 text-primary-500 flex-shrink-0"
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
          <span className="truncate">{event.venue || 'Ubicación por confirmar'}</span>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-2 flex-grow space-y-3">
        {/* Fecha */}
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="w-4 h-4 mr-2 text-primary-500" />
          <span className="font-medium">
            {event.startDate ? formatDate(event.startDate, { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' }) : 'Fecha pendiente'}
          </span>
        </div>

        {/* Tipo de Ticket */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-auto">
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