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

  // ✅ Lógica simplificada: el ticket se mantiene ACTIVE hasta que se venda
  const canBeSold = ticket.status === 'ACTIVE' && !ticket.isListed;
  const canBeDelisted = ticket.isListed; // Si está listado, se puede retirar
  const isSold = ticket.status === 'TRANSFERRED';

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

  return (
    <>
      <Card className="flex flex-col">
        <CardHeader className="pb-3">
          <h3 className="font-semibold text-lg text-gray-900">{ticket.event.title}</h3>
          <Badge 
            variant={canBeSold ? "success" : ticket.isListed ? "warning" : "default"}
            className="w-fit"
          >
            {ticket.isListed ? "Publicado en Marketplace" : (isSold ? "Vendido/Transferido" : ticket.status)}
          </Badge>
        </CardHeader>
        <CardContent className="flex-grow space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Tag className="mr-2 h-4 w-4 text-primary-500" />
            {ticket.ticketType?.name}
          </div>
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
          {/* Botón Ver más - Siempre visible para tickets ACTIVE o Listados */}
          {(canBeSold || canBeDelisted) && (
            <Link href={`/panel/my-tickets/${ticket.id}`} className="w-full">
              <Button variant="outline" className="w-full">
                <Eye className="w-4 h-4 mr-2" />
                Ver más
              </Button>
            </Link>
          )}
          
          {/* Botón Vender - Solo si está ACTIVE y no listado */}
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
          
          {/* Mensaje de vendido - Solo si fue transferido */}
          {isSold && (
            <div className="w-full text-center py-3 px-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-medium text-gray-700">✓ Entrada Vendida</p>
              <p className="text-xs text-gray-500 mt-1">Esta entrada fue transferida al comprador</p>
            </div>
          )}
          
          {/* Fallback para otros estados */}
          {!canBeSold && !canBeDelisted && !isSold && (
            <Button variant="ghost" className="w-full" disabled>
              No disponible
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {/* El Modal que se abre */}
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
