'use client'

import React, { useState } from 'react'
import { cn, formatPrice, formatDate } from '@/lib/utils'
import type { MarketplaceListing } from '@/lib/types'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Calendar, MapPin, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

interface ListingCardProps {
  listing: MarketplaceListing
  className?: string
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, className }) => {
  const { event, seller, price, originalPrice, title } = listing

  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const hasDiscount = originalPrice && price < originalPrice
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice! - price) / originalPrice!) * 100)
    : 0

  const imageUrl =
    event.multimedia?.[0] ||
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80'

  // ✅ Redirigir al checkout del marketplace
  const handleRedirectToCheckout = () => {
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para comprar')
      router.push('/login')
      return
    }

    if (user && !user.roles.includes('ATTENDEE')) {
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
    <Card
      variant="interactive"
      className={cn('group h-full flex flex-col', className)}
    >
      {/* Imagen del evento */}
      <Link href={`/marketplace/${listing.id}`} className="block">
        <div className="relative h-48 w-full overflow-hidden bg-gray-200">
          <img
            src={imageUrl}
            alt={event.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3">
            {hasDiscount && (
              <Badge variant="success" size="sm">
                {discountPercent}% OFF
              </Badge>
            )}
          </div>
        </div>
      </Link>

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
        <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 transition-colors">
          <Link
            href={`/marketplace/${listing.id}`}
            className="hover:text-primary-600"
          >
            {title}
          </Link>
        </h3>

        {/* Título del Evento */}
        <p className="text-sm text-gray-500 line-clamp-1">
          Para: {event.title}
        </p>
      </CardHeader>

      <CardContent className="space-y-2 pt-0 pb-4 flex-grow">
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="mr-2 h-4 w-4 text-primary-500" />
          {formatDate(event.startDate, {
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
          })}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="mr-2 h-4 w-4 text-primary-500" />
          <span className="line-clamp-1">{event.venue}</span>
        </div>
      </CardContent>

      <CardFooter className="flex items-end justify-between">
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

        {/* ✅ Botón que redirige al checkout del marketplace */}
        <Button
          variant="primary"
          size="md"
          className="group"
          onClick={handleRedirectToCheckout}
          loading={loading}
        >
          Comprar
          {!loading && (
            <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}

ListingCard.displayName = 'ListingCard'
export { ListingCard }
