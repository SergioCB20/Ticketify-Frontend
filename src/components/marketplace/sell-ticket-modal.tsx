'use client'

import React, { useState, useEffect } from 'react'
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
import { AlertCircle, TrendingUp, TrendingDown, DollarSign, Info } from 'lucide-react'

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
  const [suggestedPrice, setSuggestedPrice] = useState<number>(ticket.originalPrice)
  
  // Calcular precio máximo permitido (150% del precio original)
  const maxPrice = Math.ceil(ticket.originalPrice * 1.5)
  const minPrice = Math.ceil(ticket.originalPrice * 0.5) // 50% del original
  
  // Esquema de validación dinámico
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
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<SellFormData>({
    resolver: zodResolver(sellSchema),
    defaultValues: {
      price: ticket.originalPrice,
      description: '',
    },
  })

  const watchPrice = watch('price')

  // Calcular porcentaje de diferencia
  const calculateDifference = () => {
    if (!watchPrice) return 0
    return ((watchPrice - ticket.originalPrice) / ticket.originalPrice) * 100
  }

  const difference = calculateDifference()
  const isAboveOriginal = difference > 0
  const isBelowOriginal = difference < 0

  const onSubmit = async (data: SellFormData) => {
    setLoading(true)
    try {
      await MarketplaceService.createListing({
        ticketId: ticket.id,
        price: data.price,
        description: data.description || `Entrada para ${ticket.eventName}`,
      })
      
      toast.success('¡Ticket publicado en el marketplace!')
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Vender Ticket en Marketplace</DialogTitle>
          <DialogDescription>
            Publica tu ticket y recibe el pago automáticamente cuando alguien lo compre
          </DialogDescription>
        </DialogHeader>

        {/* Información del Ticket */}
        <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-lg p-4 border border-primary-100">
          <div className="flex items-start gap-4">
            {ticket.eventPhoto ? (
              <img
                src={ticket.eventPhoto}
                alt={ticket.eventName}
                className="w-24 h-24 rounded-lg object-cover"
              />
            ) : (
              <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <DollarSign className="w-12 h-12 text-white" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900 mb-1">{ticket.eventName}</h3>
              <p className="text-sm text-gray-600 mb-2">Precio original pagado:</p>
              <p className="text-2xl font-bold text-primary-600">
                {formatPrice(ticket.originalPrice)}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Selector de Precio */}
          <div>
            <label htmlFor="price" className="block text-sm font-semibold text-gray-900 mb-2">
              Precio de Venta
            </label>
            
            {/* Botones rápidos de precio */}
            <div className="grid grid-cols-4 gap-2 mb-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setQuickPrice(0.8)}
                className="text-xs"
              >
                <TrendingDown className="w-3 h-3 mr-1" />
                -20%
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setQuickPrice(0.9)}
                className="text-xs"
              >
                -10%
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setQuickPrice(1.0)}
                className="text-xs font-semibold"
              >
                Costo
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setQuickPrice(1.1)}
                className="text-xs"
              >
                <TrendingUp className="w-3 h-3 mr-1" />
                +10%
              </Button>
            </div>

            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                S/
              </span>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="150.00"
                className="pl-10 h-14 text-lg font-semibold"
                {...register('price', { valueAsNumber: true })}
              />
            </div>
            
            {errors.price && (
              <div className="flex items-center gap-2 mt-2 text-red-600">
                <AlertCircle className="w-4 h-4" />
                <p className="text-sm">{errors.price.message}</p>
              </div>
            )}

            {/* Indicador de diferencia */}
            {watchPrice && !errors.price && (
              <div className={`mt-3 p-3 rounded-lg ${
                isAboveOriginal 
                  ? 'bg-green-50 border border-green-200' 
                  : isBelowOriginal 
                  ? 'bg-orange-50 border border-orange-200'
                  : 'bg-blue-50 border border-blue-200'
              }`}>
                <div className="flex items-center gap-2">
                  {isAboveOriginal ? (
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  ) : isBelowOriginal ? (
                    <TrendingDown className="w-5 h-5 text-orange-600" />
                  ) : (
                    <DollarSign className="w-5 h-5 text-blue-600" />
                  )}
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${
                      isAboveOriginal 
                        ? 'text-green-700' 
                        : isBelowOriginal 
                        ? 'text-orange-700'
                        : 'text-blue-700'
                    }`}>
                      {isAboveOriginal && `+${difference.toFixed(1)}% sobre el precio original`}
                      {isBelowOriginal && `${difference.toFixed(1)}% bajo el precio original`}
                      {!isAboveOriginal && !isBelowOriginal && 'Al costo (precio original)'}
                    </p>
                    <p className="text-xs text-gray-600 mt-0.5">
                      {isAboveOriginal && 'Ganarás S/ ' + (watchPrice - ticket.originalPrice).toFixed(2)}
                      {isBelowOriginal && 'Perderás S/ ' + (ticket.originalPrice - watchPrice).toFixed(2)}
                      {!isAboveOriginal && !isBelowOriginal && 'Recuperarás tu inversión'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Información de límites */}
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-1">Límites de precio:</p>
                  <ul className="space-y-1 text-blue-700">
                    <li>• Mínimo: S/ {minPrice.toFixed(2)} (50% del original)</li>
                    <li>• Máximo: S/ {maxPrice.toFixed(2)} (150% del original)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
              Descripción (Opcional)
            </label>
            <Textarea
              id="description"
              placeholder="Ej: No podré asistir por motivos personales, vendo al costo. Ticket 100% válido."
              rows={3}
              className="resize-none"
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Máximo 500 caracteres. Sé honesto y claro sobre la venta.
            </p>
          </div>

          {/* Información de comisión */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-900">
                <p className="font-medium mb-1">Comisión de la plataforma:</p>
                <p>
                  Ticketify cobra una comisión del <strong>5%</strong> sobre el precio de venta.
                  {watchPrice && (
                    <>
                      {' '}Recibirás <strong className="text-yellow-700">
                        S/ {(watchPrice * 0.95).toFixed(2)}
                      </strong> después de la venta.
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" loading={loading} className="min-w-[120px]">
              {loading ? 'Publicando...' : 'Publicar en Marketplace'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
