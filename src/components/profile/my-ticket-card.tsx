'use client'

import React, { useState } from 'react'
import type { MyTicket } from '@/lib/types'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { Calendar, MapPin, Tag, Percent, X, Eye } from 'lucide-react'
import { SellTicketModal } from '@/components/marketplace/sell-ticket-modal'
import { MarketplaceService } from '@/services/api/marketplace'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

interface MyTicketCardProps {
  ticket: MyTicket
  onTicketListed: () => void // Función para refrescar la lista
}

export function MyTicketCard({ ticket, onTicketListed }: MyTicketCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDelisting, setIsDelisting] = useState(false)

  // Estados del ticket
  const isTransferred = ticket.status === 'TRANSFERRED'
  const isActive = ticket.status === 'ACTIVE'
  const isListed = ticket.isListed && ticket.listingId
  
  // Lógica de botones
  const canBeSold = isActive && !isListed && !isTransferred
  const canBeDelisted = isListed && !isTransferred
  const showSoldMessage = isTransferred

  const handleDelistTicket = async () => {
    if (!ticket.listingId) {
      toast.error('No se encontró el ID del listing')
      return
    }

    setIsDelisting(true)
    try {
      await MarketplaceService.cancelListing(ticket.listingId)
      toast.success('¡Entrada retirada del marketplace!')
      onTicketListed() // Refrescar la lista
    } catch (error: any) {
      toast.error(error.message || 'Error al retirar la entrada')
    } finally {
      setIsDelisting(false)
    }
  }

  // Determinar el badge a mostrar
  const getBadgeInfo = () => {
    if (showSoldMessage) {
      return { variant: 'default' as const, text: 'Vendido/Transferido' }
    }
    if (isListed) {
      return { variant: 'warning' as const, text: 'En Marketplace' }
    }
    if (isActive) {
      return { variant: 'success' as const, text: 'Activo' }
    }
    return { variant: 'default' as const, text: ticket.status }
  }

  const badgeInfo = getBadgeInfo()

  return (
    <>
      <Card className="flex flex-col">
        <CardHeader className="pb-3">
          <h3 className="font-semibold text-lg text-gray-900">{ticket.event.title}</h3>
          <Badge variant={badgeInfo.variant} className="w-fit">
            {badgeInfo.text}
          </Badge>
        </CardHeader>
        
        <CardContent className="flex-grow space-y-2">
          {ticket.ticketType && (
            <div className="flex items-center text-sm text-gray-600">
              <Tag className="mr-2 h-4 w-4 text-primary-500" />
              {ticket.ticketType.name}
            </div>
          )}
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="mr-2 h-4 w-4 text-primary-500" />
            {formatDate(ticket.event.startDate, { month: 'long', day: 'numeric' })}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="mr-2 h-4 w-4 text-primary-500" />
            {ticket.event.venue}
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col gap-2">
          {/* Mensaje de vendido - Solo si fue transferido */}
          {showSoldMessage ? (
            <div className="w-full text-center py-3 px-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-medium text-gray-700">✓ Entrada Vendida</p>
              <p className="text-xs text-gray-500 mt-1">Esta entrada fue transferida al comprador</p>
            </div>
          ) : (
            <>
              {/* Botón Ver más - Siempre visible para tickets activos o listados */}
              {(canBeSold || canBeDelisted) && (
                <Link href={`/panel/my-tickets/${ticket.id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    Ver más
                  </Button>
                </Link>
              )}
              
              {/* Botón Vender - Solo si está activo y NO listado */}
              {canBeSold && (
                <Button 
                  variant="primary" 
                  className="w-full"
                  onClick={() => setIsModalOpen(true)}
                >
                  <Percent className="w-4 h-4 mr-2" />
                  Vender en Marketplace
                </Button>
              )}
              
              {/* Botón Retirar - Solo si está listado */}
              {canBeDelisted && (
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleDelistTicket}
                  disabled={isDelisting}
                >
                  <X className="w-4 h-4 mr-2" />
                  {isDelisting ? 'Retirando...' : 'Retirar del Marketplace'}
                </Button>
              )}
              
              {/* Fallback para otros estados no manejados */}
              {!canBeSold && !canBeDelisted && !showSoldMessage && (
                <Button variant="ghost" className="w-full" disabled>
                  No disponible
                </Button>
              )}
            </>
          )}
        </CardFooter>
      </Card>
      
      {/* Modal para vender */}
      <SellTicketModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        ticket={{
          id: ticket.id,
          eventName: ticket.event.title,
          originalPrice: ticket.price,
        }}
        onSuccess={onTicketListed}
      />
    </>
  )
}
