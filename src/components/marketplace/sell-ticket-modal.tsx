'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { MarketplaceService } from '@/services/api/marketplace'
import { toast } from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog'
import { formatPrice } from '@/lib/utils'
import { AlertCircle, Store } from 'lucide-react'

interface SellTicketModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ticket: {
    id: string
    eventName: string
    originalPrice: number
    eventPhoto?: string
  }
  onSuccess: () => void
}

export function SellTicketModal({ open, onOpenChange, ticket, onSuccess }: SellTicketModalProps) {
  const [loading, setLoading] = useState(false)
  
  // Calcular precio máximo (150%) y mínimo (50%)
  const maxPrice = Math.ceil(ticket.originalPrice * 1.5)
  const minPrice = Math.ceil(ticket.originalPrice * 0.5)
  
  const sellSchema = z.object({
    price: z
      .number({ invalid_type_error: 'Debe ser un número' })
      .min(minPrice, `El precio mínimo es S/ ${minPrice.toFixed(2)}`)
      .max(maxPrice, `El precio máximo permitido es S/ ${maxPrice.toFixed(2)}`),
    description: z.string().max(500, 'Máximo 500 caracteres').optional(),
  })
  
  type SellFormData = z.infer<typeof sellSchema>

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
    setValue,
  } = useForm<SellFormData>({
    resolver: zodResolver(sellSchema),
    mode: 'onChange',
    defaultValues: {
      price: ticket.originalPrice,
      description: '',
    },
  })

  const watchPrice = watch('price')

  // Cálculos financieros
  const difference = watchPrice ? ((watchPrice - ticket.originalPrice) / ticket.originalPrice) * 100 : 0
  const isAboveOriginal = difference > 0
  const isBelowOriginal = difference < 0
  const commission = watchPrice ? watchPrice * 0.05 : 0 // 5% comisión
  const netEarnings = watchPrice ? watchPrice - commission : 0

  const onSubmit = async (data: SellFormData) => {
    setLoading(true)
    try {
      await MarketplaceService.createListing({
        ticketId: ticket.id,
        price: data.price,
      })
      
      toast.success('¡Ticket publicado exitosamente!')
      onSuccess()
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

  const setQuickPrice = (percentage: number) => {
    const newPrice = Math.ceil(ticket.originalPrice * percentage)
    setValue('price', newPrice, { shouldValidate: true })
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md sm:max-w-lg overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl font-bold flex items-center gap-2">
            <Store className="w-6 h-6 text-primary-600" />
            Vender en Marketplace
          </DialogTitle>
          <DialogDescription>
            Configura el precio y publica tu entrada inmediatamente.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-2">
          {/* Tarjeta Resumen */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Evento</p>
              <h3 className="font-bold text-slate-900 line-clamp-1">{ticket.eventName}</h3>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Costo Original</p>
              <p className="font-mono font-medium text-slate-700">{formatPrice(ticket.originalPrice)}</p>
            </div>
          </div>

          {/* Selector de Precio */}
          <div>
            <label htmlFor="price" className="block text-sm font-semibold text-gray-900 mb-3">
              Precio de Venta (S/)
            </label>
            
            <div className="grid grid-cols-3 gap-2 mb-4">
              <Button
                type="button"
                variant={difference < 0 ? "secondary" : "outline"}
                size="sm"
                onClick={() => setQuickPrice(0.8)}
                className={`text-xs ${isBelowOriginal ? 'bg-orange-100 text-orange-700 border-orange-200' : ''}`}
              >
                Rápido (-20%)
              </Button>
              <Button
                type="button"
                variant={difference === 0 ? "secondary" : "outline"}
                size="sm"
                onClick={() => setQuickPrice(1.0)}
                className={`text-xs font-semibold ${difference === 0 ? 'bg-blue-100 text-blue-700 border-blue-200' : ''}`}
              >
                Recuperar (100%)
              </Button>
              <Button
                type="button"
                variant={difference > 0 ? "secondary" : "outline"}
                size="sm"
                onClick={() => setQuickPrice(1.1)}
                className={`text-xs ${isAboveOriginal ? 'bg-green-100 text-green-700 border-green-200' : ''}`}
              >
                Ganancia (+10%)
              </Button>
            </div>

            <div className="relative group">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-semibold text-xl">S/</span>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="pl-12 h-16 text-2xl font-bold border-2 focus-visible:ring-0 focus-visible:border-primary-500 transition-all"
                {...register('price', { valueAsNumber: true })}
              />
            </div>
            
            {errors.price ? (
              <div className="flex items-center gap-2 mt-2 text-red-600 animate-in slide-in-from-top-1">
                <AlertCircle className="w-4 h-4" />
                <p className="text-sm font-medium">{errors.price.message}</p>
              </div>
            ) : (
              <div className="flex justify-between text-xs text-gray-500 mt-2 px-1">
                <span>Mín: {formatPrice(minPrice)}</span>
                <span>Máx: {formatPrice(maxPrice)}</span>
              </div>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
              Nota para el comprador (Opcional)
            </label>
            <Textarea
              id="description"
              placeholder="Ej: Asiento pasillo, excelente vista..."
              rows={2}
              className="resize-none bg-slate-50"
              {...register('description')}
            />
          </div>

          {/* Resumen Financiero (Lo que recibe el usuario) */}
          <div className="bg-green-50 rounded-xl p-4 border border-green-100 space-y-3">
            <div className="flex justify-between text-sm text-green-800/70">
              <span>Precio venta:</span>
              <span>{formatPrice(watchPrice || 0)}</span>
            </div>
            <div className="flex justify-between text-sm text-green-800/70">
              <span>Comisión (5%):</span>
              <span>- {formatPrice(commission)}</span>
            </div>
            <div className="border-t border-green-200 pt-2 flex justify-between items-center">
              <span className="font-bold text-green-900">Tú recibes:</span>
              <span className="text-2xl font-bold text-green-700">{formatPrice(netEarnings)}</span>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-col gap-3 !space-x-0 pt-2">
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-bold shadow-lg bg-green-600 hover:bg-green-700 text-white transition-all transform active:scale-[0.98]"
              loading={loading}
              disabled={!isValid || loading}
            >
              {loading ? 'Publicando...' : `Confirmar y Publicar`}
            </Button>
            
            <Button 
              type="button" 
              variant="ghost" 
              onClick={handleClose} 
              disabled={loading}
              className="w-full text-gray-500 hover:text-gray-700"
            >
              Cancelar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}