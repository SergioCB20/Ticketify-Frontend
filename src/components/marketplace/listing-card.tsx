'use client'

import React from 'react'
import { cn, formatPrice, formatDate } from '@/lib/utils'
import type { MarketplaceListing } from '@/lib/types'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Tag, Calendar, MapPin, User, ArrowRight } from 'lucide-react'
import Link from 'next/link'

// --- (1) IMPORTACIONES AÑADIDAS ---
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'

interface ListingCardProps {
  listing: MarketplaceListing
  className?: string
  
}

const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  className,
}) => {
  
  const { event, seller, price, originalPrice, title } = listing

  // --- (2) HOOKS DE AUTENTICACIÓN Y RUTA ---
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  const hasDiscount = originalPrice && price < originalPrice;
  const discountPercent = hasDiscount 
    ? Math.round(((originalPrice! - price) / originalPrice!) * 100)
    : 0;
  
  const imageUrl = event.multimedia?.[0] || 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80';

  // --- (3) LÓGICA DE VALIDACIÓN ---
  const handleBuyClick = () => {
    // 1. Validar si está logueado
    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para comprar')
      router.push('/login') // Redirige al login
      return;
    }

    // 2. Validar si tiene el rol de 'ATTENDEE'
    // Tu modelo de usuario del backend define 'ATTENDEE'
    if (user && !user.roles.includes('Attendee')) {
      toast.error('Solo los asistentes pueden comprar tickets.')
      return;
    }

    // 3. ¡Éxito! El usuario es un asistente logueado.
    // Aquí iría la lógica para navegar a la pasarela de pago.
    console.log('¡Validación exitosa! Redirigiendo a la pasarela de pago para el listado:', listing.id)
    // router.push(`/checkout/marketplace/${listing.id}`) // (Ejemplo de ruta futura)
    toast.success('¡Validado! Redirigiendo al pago...')
    router.push('/prueba-de-venta')
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
          <Link href={`/marketplace/${listing.id}`} className="hover:text-primary-600">
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
          {formatDate(event.startDate, { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
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
        
        {/* --- (4) BOTÓN ACTUALIZADO ---
            Se quita 'asChild' y '<Link>', se añade 'onClick'
        --- */}
        <Button
          variant="primary"
          size="md"
          className="group"
          onClick={handleBuyClick} // Se llama a la nueva función
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