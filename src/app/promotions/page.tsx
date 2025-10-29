'use client'

import { useEffect, useState } from 'react'
import { PromotionService } from '@/services/api/promotions'
import type { Promotion } from '@/lib/types'
import { Button } from '@/components/ui/button'

export default function PromotionsPage() {
  const [promos, setPromos] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPromotions = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await PromotionService.getAll()
      setPromos(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPromotions()
  }, [])

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">🎟️ Promociones</h1>
      {loading && <p>Cargando promociones...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promos.map((promo) => (
          <div key={promo.id} className="border rounded-xl p-4 shadow-sm hover:shadow-lg transition">
            <h2 className="text-xl font-semibold text-violet-600">{promo.name}</h2>
            <p className="text-gray-600">{promo.description}</p>
            <p className="text-sm text-gray-500 mt-2">Código: {promo.code}</p>
            <p className="text-sm text-gray-500">Descuento: {promo.discountValue}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <Button onClick={fetchPromotions} variant="primary">
          🔄 Recargar Promociones
        </Button>
      </div>
    </div>
  )
}
