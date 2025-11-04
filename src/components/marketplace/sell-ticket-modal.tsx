'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { MarketplaceService } from '@/services/api/marketplace'
import { toast } from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea' // (Ahora existirá)
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog' // (Ahora existirá)
import { formatPrice } from '@/lib/utils'

// Esquema de validación para el formulario
const sellSchema = z.object({
  price: z.number({ invalid_type_error: 'Debe ser un número' }).gt(0, 'El precio debe ser mayor a 0'),
  description: z.string().max(500, 'Máximo 500 caracteres').optional(),
})
type SellFormData = z.infer<typeof sellSchema>

interface SellTicketModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ticket: {
    id: string
    eventName: string
    originalPrice: number
  }
  onSuccess: () => void // Para refrescar la lista de tickets
}

export function SellTicketModal({ open, onOpenChange, ticket, onSuccess }: SellTicketModalProps) {
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SellFormData>({
    resolver: zodResolver(sellSchema),
  })

  const onSubmit = async (data: SellFormData) => {
    setLoading(true)
    try {
      await MarketplaceService.createListing({
        ticketId: ticket.id,
        price: data.price,
        description: data.description || `Entrada para ${ticket.eventName}`,
      })
      
      toast.success('¡Ticket publicado en el marketplace!')
      onSuccess() // Llama a la función para refrescar
      handleClose()
    } catch (error: any) {
      toast.error(error.message || 'Error al publicar el ticket')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Poner en Venta: {ticket.eventName}</DialogTitle>
          <DialogDescription>
            Precio original pagado: {formatPrice(ticket.originalPrice)}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Precio de Venta (S/)
            </label>
            <Input
              id="price"
              type="number"
              step="0.01"
              placeholder="150.00"
              {...register('price', { valueAsNumber: true })}
            />
            {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>}
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Descripción (Opcional)
            </label>
            <Textarea
              id="description"
              placeholder="Ej: No podré asistir, la vendo al costo."
              {...register('description')}
            />
            {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={handleClose}>Cancelar</Button>
            <Button type="submit" variant="primary" loading={loading}>
              Publicar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}