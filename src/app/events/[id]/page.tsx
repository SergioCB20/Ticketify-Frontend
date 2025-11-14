'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { EventService } from '@/services/api/events'
import { PromotionService } from '@/services/api/promotions'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { toast } from 'react-hot-toast'
import { StorageService } from '@/services/storage'

export default function EventDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [event, setEvent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTickets, setSelectedTickets] = useState<Record<string, number>>({})
  const [promoCode, setPromoCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<any>(null)

  // 🔹 Cargar evento
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await EventService.getEventById(id as string)
        setEvent(data)
      } catch (err) {
        toast.error('Error al cargar el evento')
      } finally {
        setLoading(false)
      }
    }
    fetchEvent()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Cargando evento...
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <p className="text-xl text-gray-700 mb-4">Evento no encontrado</p>
        <Button onClick={() => router.push('/events')}>⬅ Volver</Button>
      </div>
    )
  }

  // 🔹 Aplicar código promocional
  const handleApplyPromo = async () => {
    if (!promoCode.trim()) {
      toast.error('Ingresa un código promocional')
      return
    }

    try {
      const promo = await PromotionService.validate(promoCode.trim(), event.id)
      setAppliedPromo(promo)
      toast.success(`Código ${promo.code} aplicado correctamente 🎉`)
    } catch (error: any) {
      setAppliedPromo(null)
      toast.error(error.message || 'Código inválido o expirado')
    }
  }

  // 🔹 Calcular precio con descuento
  const getDiscountedPrice = (basePrice: number) => {
    if (!appliedPromo) return basePrice
    if (appliedPromo.promotion_type === 'PERCENTAGE') {
      const discountAmount = (basePrice * appliedPromo.discount_value) / 100
      return Math.max(basePrice - discountAmount, 0)
    }
    if (appliedPromo.promotion_type === 'FIXED_AMOUNT') {
      return Math.max(basePrice - appliedPromo.discount_value, 0)
    }
    return basePrice
  }

  // 🔹 Controlar selección
  const handleSelect = (ticketId: string, delta: number) => {
    setSelectedTickets(prev => {
      const current = prev[ticketId] || 0
      const newValue = Math.max(0, current + delta)
      return { ...prev, [ticketId]: newValue }
    })
  }

  // 🔹 Calcular total con descuento
  const total =
    event.ticket_types?.reduce((acc: number, t: any) => {
      const qty = selectedTickets[t.id] || 0
      const price = getDiscountedPrice(t.price)
      return acc + qty * price
    }, 0) || 0

  const hasSelection = Object.values(selectedTickets).some(qty => qty > 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🔙 Botón volver */}
      <div className="p-4 bg-white shadow-sm sticky top-0 z-10 flex items-center gap-3">
        <Button variant="outline" onClick={() => router.push('/events')}>
          ⬅ Volver
        </Button>
        <h1 className="text-xl font-bold text-gray-800">{event.title}</h1>
      </div>

      {/* 🖼️ Galería superior */}
      {event.multimedia && event.multimedia.length > 0 && (
        <div className="w-full overflow-x-auto flex snap-x snap-mandatory scrollbar-hide">
          {event.multimedia.map((img: string, i: number) => (
            <img
              key={i}
              src={img}
              alt={`${event.title} ${i + 1}`}
              className="snap-center flex-shrink-0 w-full h-[400px] object-cover"
            />
          ))}
        </div>
      )}

      <Container className="py-10 max-w-4xl">
        {/* 🧾 Detalles del evento */}
        <div className="bg-white shadow-md rounded-xl p-6 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h2>
          <p className="text-gray-600 mb-4 whitespace-pre-line">{event.description}</p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-gray-700 mb-6">
            <span>📍 {event.venue}</span>
            <span>🗓️ {new Date(event.startDate).toLocaleDateString('es-PE')}</span>
            <span>
              ⏰{' '}
              {new Date(event.startDate).toLocaleTimeString('es-PE', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>

        {/* 🎟️ Tipos de tickets */}
        <div className="bg-white shadow-sm rounded-xl p-6">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Entradas disponibles
          </h2>

          {(!event.ticket_types || event.ticket_types.length === 0) && (
            <p className="text-gray-500">No hay tipos de tickets configurados aún.</p>
          )}

          <div className="space-y-4">
            {event.ticket_types?.map((ticket: any) => {
              const qty = selectedTickets[ticket.id] || 0
              const soldOut = ticket.remaining_quantity <= 0
              const discountedPrice = getDiscountedPrice(ticket.price)
              return (
                <div
                  key={ticket.id}
                  className={`border rounded-lg p-4 flex justify-between items-center ${
                    soldOut ? 'opacity-50' : ''
                  }`}
                >
                  <div>
                    <h3 className="font-bold text-gray-800">{ticket.name}</h3>
                    <p className="text-sm text-gray-500">
                      S/ {discountedPrice.toFixed(2)} — {ticket.remaining_quantity} disponibles
                    </p>
                    {appliedPromo && (
                      <p className="text-xs text-green-600 mt-1">
                        Descuento aplicado (
                        {appliedPromo.promotion_type === 'PERCENTAGE'
                          ? `-${appliedPromo.discount_value}%`
                          : `-S/ ${appliedPromo.discount_value}`}
                        )
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSelect(ticket.id, -1)}
                      disabled={qty === 0 || soldOut}
                    >
                      −
                    </Button>
                    <span className="font-semibold w-6 text-center">{qty}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSelect(ticket.id, +1)}
                      disabled={qty >= ticket.remaining_quantity || soldOut}
                    >
                      +
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* 💳 Código promocional */}
          <div className="flex gap-3 mt-8">
            <input
              type="text"
              placeholder="Código promocional"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="border rounded-lg px-4 py-2 flex-grow"
            />
            <Button variant="outline" onClick={handleApplyPromo}>
              Aplicar
            </Button>
          </div>

          {/* 💰 Total + comprar */}
          <div className="flex justify-between items-center mt-8">
            <span className="text-lg font-semibold text-gray-800">
              Total: S/ {total.toFixed(2)}
            </span>
            <Button
              variant="primary"
              size="lg"
              disabled={!hasSelection}
              onClick={() => {
                if (!hasSelection) {
                  toast.error('Selecciona al menos un ticket antes de continuar')
                  return
                }

                const token = StorageService.getAccessToken()
                if (!token) {
                  toast.error('Debes iniciar sesión antes de comprar')
                  router.push('/login')
                  return
                }

                // 🟢 Guardar evento y tickets seleccionados en localStorage
                localStorage.setItem('selectedEvent', JSON.stringify(event))
                const selectedTicketsData = event.ticket_types
                  .filter((t: any) => selectedTickets[t.id] > 0)
                  .map((t: any) => ({
                    id: t.id,
                    name: t.name,
                    price: getDiscountedPrice(t.price),
                    quantity: selectedTickets[t.id],
                    ticket_type_id: t.id,
                  }))
                localStorage.setItem('selectedTickets', JSON.stringify(selectedTicketsData))

                if (appliedPromo) {
                  localStorage.setItem('appliedPromo', JSON.stringify(appliedPromo))
                } else {
                  localStorage.removeItem('appliedPromo')
                }

                // 🚀 Ir al checkout
                router.push('/events/${id}/checkout')
              }}
            >
              Comprar entradas
            </Button>
          </div>
        </div>
      </Container>
    </div>
  )
}
