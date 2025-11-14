'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'
import { toast } from 'react-hot-toast'
import { api } from '@/lib/api'
import { useParams } from 'next/navigation'

export default function CheckoutPage() {
  const router = useRouter()
  const { id: eventId } = useParams()
  const [loading, setLoading] = useState(false)
  const [tickets, setTickets] = useState<any[]>([])
  const [total, setTotal] = useState<number>(0)
  const [promo, setPromo] = useState<any>(null)
  const [card, setCard] = useState({
    name: '',
    number: '',
    exp: '',
    cvv: ''
  })

  // 🧾 Cargar tickets y promo
  useEffect(() => {
    try {
      const t = JSON.parse(localStorage.getItem('selectedTickets') || '[]')
      const promoData = JSON.parse(localStorage.getItem('appliedPromo') || 'null')
      setTickets(t)
      setPromo(promoData)

      const subtotal = t.reduce((acc: number, item: any) => acc + item.price * item.quantity, 0)
      let finalTotal = subtotal

      if (promoData) {
        if (promoData.promotion_type === 'PERCENTAGE') {
          finalTotal -= subtotal * (promoData.discount_value / 100)
        } else if (promoData.promotion_type === 'FIXED_AMOUNT') {
          finalTotal -= promoData.discount_value
        }
      }

      setTotal(Math.max(finalTotal, 0))
    } catch (e) {
      console.error(e)
    }
  }, [])

  // ✨ Formateo de tarjeta en tiempo real
  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name === 'number') {
      const formatted = value
        .replace(/\D/g, '')
        .slice(0, 16)
        .replace(/(.{4})/g, '$1-')
        .replace(/-$/, '')
      setCard((prev) => ({ ...prev, number: formatted }))
    } else if (name === 'exp') {
      const clean = value.replace(/\D/g, '').slice(0, 4)
      const formatted = clean.replace(/(\d{2})(\d{1,2})/, '$1/$2')
      setCard((prev) => ({ ...prev, exp: formatted }))
    } else if (name === 'cvv') {
      const clean = value.replace(/\D/g, '').slice(0, 4)
      setCard((prev) => ({ ...prev, cvv: clean }))
    } else {
      setCard((prev) => ({ ...prev, [name]: value }))
    }
  }

    // 💳 Confirmar compra (nueva versión)
    const handleConfirm = async () => {
    if (!card.name || card.number.length < 19 || card.exp.length < 5 || card.cvv.length < 3) {
        toast.error('Completa correctamente los datos de la tarjeta')
        return
    }

    if (tickets.length === 0) {
        toast.error('No hay tickets seleccionados')
        return
    }

    setLoading(true)
    try {
        const eventData = JSON.parse(localStorage.getItem('selectedEvent') || '{}')

        // 🟢 Validar IDs
        if (!eventData?.id) {
        toast.error('No se encontró el evento seleccionado')
        setLoading(false)
        return
        }

        // 🔁 Crear todos los tickets (uno por unidad seleccionada)
        const createPromises: Promise<any>[] = []

        for (const t of tickets) {
        const ticketTypeId = t.ticket_type_id || t.id
        for (let i = 0; i < (t.quantity || 1); i++) {
            const payload = {
            event_id: eventData.id,
            ticket_type_id: ticketTypeId,
            price: Math.max(t.price, 0), // ya incluye descuento
            promo_code: promo?.code || null,
            }
            console.log('[DEBUG] creando ticket:', payload)
            createPromises.push(api.post('/tickets', payload))
        }
        }

        // ⏳ Esperar que todos se creen
        await Promise.all(createPromises)

        toast.success('🎟️ Todos los tickets se generaron exitosamente ✅')

        // 🧹 Limpieza y redirección
        localStorage.removeItem('selectedTickets')
        localStorage.removeItem('appliedPromo')

        setTimeout(() => {
        router.push('/')
        }, 1000)
    } catch (err: any) {
        console.error('[DEBUG] Error creando tickets:', err)
        toast.error(err.message || 'Error al generar los tickets')
    } finally {
        setLoading(false)
    }
    }





  return (
    <Container className="max-w-3xl py-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">💳 Confirmar compra</h1>

      {/* 🧾 Resumen de tickets */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Entradas seleccionadas</h2>
        {tickets.map((t, i) => (
          <div key={i} className="flex justify-between mb-2">
            <span>
              {t.name} × {t.quantity}
            </span>
            <span>S/ {(t.price * t.quantity).toFixed(2)}</span>
          </div>
        ))}

        {promo && (
          <div className="flex justify-between text-green-600 font-semibold mt-2">
            <span>Descuento ({promo.code})</span>
            <span>
              {promo.promotion_type === 'PERCENTAGE'
                ? `-${promo.discount_value}%`
                : `-S/ ${promo.discount_value}`}
            </span>
          </div>
        )}

        <hr className="my-3" />
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>S/ {total.toFixed(2)}</span>
        </div>
      </div>

      {/* 💳 Datos de tarjeta */}
      <div className="bg-white shadow-md rounded-xl p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Datos de la tarjeta</h2>
        <div className="space-y-4">
          <input
            className="border p-3 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Nombre completo"
            name="name"
            value={card.name}
            onChange={handleCardChange}
          />

          <input
            className="border p-3 w-full rounded-lg tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="1234-5678-9012-3456"
            name="number"
            value={card.number}
            onChange={handleCardChange}
            maxLength={19} // Incluye guiones
          />

          <div className="flex gap-4">
            <input
              className="border p-3 flex-1 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="MM/AA"
              name="exp"
              value={card.exp}
              onChange={handleCardChange}
              maxLength={5}
            />
            <input
              className="border p-3 flex-1 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="CVV"
              name="cvv"
              value={card.cvv}
              onChange={handleCardChange}
              maxLength={4}
            />
          </div>
        </div>
      </div>

      {/* Botón */}
      <Button
        size="lg"
        variant="primary"
        disabled={loading}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white text-lg font-semibold rounded-xl py-3"
        onClick={handleConfirm}
      >
        {loading ? 'Procesando...' : 'Confirmar compra'}
      </Button>
    </Container>
  )
}
