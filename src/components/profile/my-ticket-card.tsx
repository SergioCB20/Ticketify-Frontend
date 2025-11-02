
'use client'

import React, { useState } from 'react'
import type { MyTicket } from '@/lib/types'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { Calendar, MapPin, Tag, Percent } from 'lucide-react'
import { SellTicketModal } from '@/components/marketplace/sell-ticket-modal'

interface MyTicketCardProps {
  ticket: MyTicket
  onTicketListed: () => void // Función para refrescar la lista
}

export function MyTicketCard({ ticket, onTicketListed }: MyTicketCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const canBeSold = ticket.status === 'ACTIVE' && !ticket.isListed;
  const isSold = ticket.status === 'TRANSFERRED';

  return (
    <>
      <Card className="flex flex-col">
        <CardHeader className="pb-3">
          <h3 className="font-semibold text-lg text-gray-900">{ticket.event.title}</h3>
          <Badge 
            variant={canBeSold ? "success" : "default"}
            className="w-fit"
          >
            {ticket.isListed ? "Publicado en Marketplace" : (isSold ? "Vendido/Transferido" : ticket.status)}
          </Badge>
        </CardHeader>
        <CardContent className="flex-grow space-y-2">
          <div className="flex items-center text-sm text-gray-600">
            <Tag className="mr-2 h-4 w-4 text-primary-500" />
            {ticket.ticketType.name}
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
        <CardFooter>
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
          {ticket.isListed && (
            <Button variant="outline" className="w-full" disabled>
              Publicado
            </Button>
          )}
          {!canBeSold && !ticket.isListed && (
            <Button variant="ghost" className="w-full" disabled>
              No se puede vender
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