'use client'

import { useEffect, useState } from 'react'
import { PromotionService } from '@/services/api/promotions'
import type { Promotion } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/layout/navbar'

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
      setError(err.message || 'Error al cargar las promociones.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPromotions()
  }, [])

  return (
    <>
      {/* ✅ Navbar visible arriba */}
      <Navbar />

      <div className="p-10 min-h-screen bg-gray-50">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
          🎟️ Promociones
        </h1>

        {loading && <p className="text-gray-600">Cargando promociones...</p>}
        {error && <p className="text-red-500 font-medium mb-4">{error}</p>}

        {!loading && !error && promos.length === 0 && (
          <p className="text-gray-500 italic">No hay promociones disponibles.</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {promos.map((promo) => (
            <div
              key={promo.id}
              className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm hover:shadow-lg transition-all"
            >
              <h2 className="text-xl font-semibold text-violet-600 mb-1">
                {promo.name}
              </h2>
              <p className="text-gray-600 mb-2">{promo.description}</p>
              <p className="text-sm text-gray-500">Código: <b>{promo.code}</b></p>
              <p className="text-sm text-gray-500">
                Descuento: <b>{promo.discountValue}%</b>
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Button
            onClick={fetchPromotions}
            variant="primary"
            className="px-6 py-3 text-lg font-semibold"
          >
            🔄 Recargar Promociones
          </Button>
        </div>
      </div>
    </>
  )
}
