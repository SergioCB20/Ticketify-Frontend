'use client'

import { useEffect, useState } from 'react'
import { EventService } from '@/services/api/events'
import { PromotionService } from '@/services/api/promotions'
import { StorageService } from '@/services/storage'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/layout/navbar'
import { toast } from 'react-hot-toast'
import type { User } from '@/lib/types'

interface Event {
  id: string
  title: string
  venue: string
  startDate: string
}

interface Promotion {
  id: string
  name: string
  description?: string
  code: string
  promotion_type?: 'PERCENTAGE' | 'FIXED_AMOUNT'   // ✅ nuevo campo
  discountValue: number
  max_discount_amount?: number
  min_purchase_amount?: number
  startDate: string
  endDate: string
}


interface PromotionsListProps {
  promotions: Promotion[]
  selectedEvent: Event
  fetchPromotions: (eventId: string) => Promise<void>
  handleDelete: (id: string) => Promise<void>
  handleAddPromotion: () => Promise<void>
}

export default function PromotionsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [promotions, setPromotions] = useState<Promotion[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ========================================
  // 🔹 Cargar eventos del organizador
  // ========================================
  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      setError(null)

      const user = StorageService.getUser<User>()
      if (!user || !user.id) {
        toast.error('Usuario no encontrado o inválido')
        return
      }

      console.log('📡 Solicitando eventos del usuario:', user.id)
      const data = await EventService.getAllByUser(user.id)
      console.log('✅ Eventos recibidos:', data)

      setEvents(data)
      if (data.length === 0) toast('No hay eventos disponibles')
    } catch (err: any) {
      console.error('❌ Error al cargar eventos:', err)
      setError('Error al cargar eventos')
      toast.error('Error al cargar eventos')
    } finally {
      setLoading(false)
    }
  }

  // ========================================
  // 🔹 Cargar promociones del evento seleccionado
  // ========================================
  const fetchPromotions = async (eventId: string) => {
    try {
      setLoading(true)
      setError(null)

      const data = await PromotionService.getByEvent(eventId)
      setPromotions(data)
      console.log('🎟️ Promociones recibidas:', data)
    } catch (err: any) {
      const msg = err?.response?.data?.detail || 'Error al obtener promociones'
      console.error('❌', msg)
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  // ========================================
  // 🔹 Crear promoción temporal (dummy)
  // ========================================
  const handleAddPromotion = async () => {
    try {
      if (!selectedEvent) {
        toast.error('Selecciona un evento primero')
        return
      }

      const user = StorageService.getUser<User>()
      if (!user || !user.id) {
        toast.error('Usuario no autenticado')
        return
      }

      const newPromo = {
        name: 'Nueva Promo Test',
        description: 'Descripción temporal',
        code: `PROMO-${Math.floor(Math.random() * 1000)}`,
        promotion_type: 'PERCENTAGE',
        discount_value: 10,
        max_discount_amount: 0,
        min_purchase_amount: 0,
        start_date: '2025-11-01T00:00:00Z',
        end_date: '2025-11-30T00:00:00Z',
        event_id: selectedEvent.id,
        created_by_id: user.id,
      }

      toast.loading('Creando promoción...', { id: 'promo' })
      await PromotionService.create(newPromo)
      toast.success('Promoción creada correctamente', { id: 'promo' })

      fetchPromotions(selectedEvent.id)
    } catch (err: any) {
      const msg = err?.response?.data?.detail || 'Error al crear promoción'
      toast.error(msg, { id: 'promo' })
    }
  }

  // ========================================
  // 🔹 Eliminar promoción
  // ========================================
  const handleDelete = async (id: string) => {
    try {
      const confirm = window.confirm('¿Seguro que quieres eliminar esta promoción?')
      if (!confirm) return

      toast.loading('Eliminando promoción...', { id: 'promo' })
      await PromotionService.delete(id)
      toast.success('Promoción eliminada', { id: 'promo' })
      if (selectedEvent) fetchPromotions(selectedEvent.id)
    } catch (err: any) {
      toast.error('No se pudo eliminar la promoción', { id: 'promo' })
    }
  }

  return (
    <>
      <Navbar />
      <div className="p-10 min-h-screen bg-gray-50">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8">
          🎟️ Promociones por Evento
        </h1>

        {loading && <p className="text-gray-600">Cargando...</p>}
        {error && <p className="text-red-600 font-medium mb-4">{error}</p>}

        {/* === LISTA DE EVENTOS === */}
        <div className="flex flex-wrap gap-4 mb-10">
          {events.map((ev) => (
            <Button
              key={ev.id}
              onClick={() => {
                setSelectedEvent(ev)
                fetchPromotions(ev.id)
              }}
              variant={selectedEvent?.id === ev.id ? 'primary' : 'outline'}
              className="px-5 py-2"
            >
              {ev.title}
            </Button>
          ))}
        </div>

        {/* === PROMOCIONES DEL EVENTO SELECCIONADO === */}
        {selectedEvent && (
          <PromotionsList
            promotions={promotions}
            selectedEvent={selectedEvent}
            fetchPromotions={fetchPromotions}
            handleDelete={handleDelete}
            handleAddPromotion={handleAddPromotion}
          />
        )}
      </div>
    </>
  )
}

// =========================================================
// 🧩 SUBCOMPONENTE: LISTADO + EDICIÓN DE PROMOCIONES
// =========================================================
function PromotionsList({
  promotions,
  selectedEvent,
  fetchPromotions,
  handleDelete,
  handleAddPromotion,
}: PromotionsListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editedPromo, setEditedPromo] = useState<Promotion | null>(null)

  const handleEditClick = (promo: Promotion) => {
    setEditingId(promo.id)
    setEditedPromo({ ...promo })
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditedPromo(null)
  }

  const handleSave = async () => {
    if (!editedPromo) return
    try {
      toast.loading('Guardando cambios...', { id: 'edit' })
      await PromotionService.update(editedPromo.id, {
        name: editedPromo.name,
        description: editedPromo.description,
        code: editedPromo.code,
        promotion_type: (editedPromo as any).promotion_type,
        discount_value: (editedPromo as any).discountValue,
        start_date: (editedPromo as any).startDate,
        end_date: (editedPromo as any).endDate,
      })
      toast.success('Promoción actualizada ✅', { id: 'edit' })
      setEditingId(null)
      fetchPromotions(selectedEvent.id)
    } catch {
      toast.error('Error al actualizar promoción', { id: 'edit' })
    }
  }

  if (!promotions.length) {
    <p className="text-gray-500 italic">No hay promociones disponibles.</p>
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">
        Promociones de {selectedEvent.title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promotions.map((promo: any) => (
          <div
            key={promo.id}
            className={`border rounded-xl p-5 transition ${
              editingId === promo.id
                ? 'bg-yellow-50 border-yellow-300'
                : 'bg-white border-gray-200 hover:shadow-md'
            }`}
          >
            {editingId === promo.id ? (
              <>
                {/* 🧾 Nombre */}
                <label className="text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  type="text"
                  value={editedPromo?.name || ''}
                  onChange={(e) =>
                    setEditedPromo({ ...editedPromo!, name: e.target.value })
                  }
                  className="w-full mb-2 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500"
                />

                {/* 📝 Descripción */}
                <label className="text-sm font-medium text-gray-700">
                  Descripción
                </label>
                <textarea
                  value={editedPromo?.description || ''}
                  onChange={(e) =>
                    setEditedPromo({ ...editedPromo!, description: e.target.value })
                  }
                  className="w-full mb-2 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500"
                />

                {/* 🧾 Código */}
                <label className="text-sm font-medium text-gray-700">Código</label>
                <input
                  type="text"
                  value={editedPromo?.code || ''}
                  onChange={(e) =>
                    setEditedPromo({ ...editedPromo!, code: e.target.value })
                  }
                  className="w-full mb-2 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500"
                />

                {/* 🔢 Tipo */}
                <label className="text-sm font-medium text-gray-700">Tipo</label>
                <select
                  value={(editedPromo as any).promotion_type || 'PERCENTAGE'}
                  onChange={(e) =>
                    setEditedPromo({
                      ...editedPromo!,
                      promotion_type: e.target.value as 'PERCENTAGE' | 'FIXED_AMOUNT',
                    })
                  }
                  className="w-full mb-2 border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="PERCENTAGE">Porcentaje (%)</option>
                  <option value="FIXED_AMOUNT">Monto fijo (S/)</option>
                </select>

                {/* 💰 Valor */}
                <label className="text-sm font-medium text-gray-700">
                  {((editedPromo as any).promotion_type || 'PERCENTAGE') ===
                  'PERCENTAGE'
                    ? 'Porcentaje de descuento (%)'
                    : 'Monto de descuento (S/)'}

                </label>
                <input
                  type="number"
                  value={(editedPromo as any).discountValue || 0}
                  onChange={(e) =>
                    setEditedPromo({
                      ...editedPromo!,
                      discountValue: Number(e.target.value),
                    })
                  }
                  className="w-full mb-2 border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-primary-500"
                />

                {/* 🗓️ Fecha inicio */}
                <label className="text-sm font-medium text-gray-700">
                  Fecha inicio
                </label>
                <input
                  type="datetime-local"
                  value={
                    (editedPromo as any).startDate
                      ? new Date((editedPromo as any).startDate)
                          .toISOString()
                          .slice(0, 16)
                      : ''
                  }
                  onChange={(e) =>
                    setEditedPromo({
                      ...editedPromo!,
                      startDate: new Date(e.target.value).toISOString(),
                    })
                  }
                  className="w-full mb-2 border border-gray-300 rounded-md px-3 py-2"
                />

                {/* 🗓️ Fecha fin */}
                <label className="text-sm font-medium text-gray-700">
                  Fecha fin
                </label>
                <input
                  type="datetime-local"
                  value={
                    (editedPromo as any).endDate
                      ? new Date((editedPromo as any).endDate)
                          .toISOString()
                          .slice(0, 16)
                      : ''
                  }
                  onChange={(e) =>
                    setEditedPromo({
                      ...editedPromo!,
                      endDate: new Date(e.target.value).toISOString(),
                    })
                  }
                  className="w-full mb-4 border border-gray-300 rounded-md px-3 py-2"
                />

                <div className="flex justify-end gap-2">
                  <Button variant="success" onClick={handleSave}>
                    💾 Guardar
                  </Button>
                  <Button variant="ghost" onClick={handleCancel}>
                    ✖️ Cancelar
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-bold text-violet-600 mb-1">
                  {promo.name}
                </h3>
                <p className="text-gray-600 mb-2">{promo.description}</p>
                <p className="text-sm text-gray-500">
                  Código: <b>{promo.code}</b>
                </p>
                <p className="text-sm text-gray-500">
                  Tipo:{' '}
                  <b>
                    {promo.promotion_type === 'PERCENTAGE'
                      ? 'Porcentaje (%)'
                      : 'Monto fijo (S/.)'}
                  </b>
                </p>
                <p className="text-sm text-gray-500">
                  Valor: <b>{promo.discountValue}</b>
                </p>
                <p className="text-sm text-gray-500">
                  Inicio:{' '}
                  <b>
                    {new Date(promo.startDate).toLocaleDateString('es-PE', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </b>
                </p>
                <p className="text-sm text-gray-500">
                  Fin:{' '}
                  <b>
                    {new Date(promo.endDate).toLocaleDateString('es-PE', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                    })}
                  </b>
                </p>

                <div className="flex justify-end mt-4 gap-2">
                  <Button variant="outline" onClick={() => handleEditClick(promo)}>
                    ✏️ Editar
                  </Button>
                  <Button variant="destructive" onClick={() => handleDelete(promo.id)}>
                    🗑️ Eliminar
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* === BOTONES DE ACCIÓN (siempre visibles al tener un evento seleccionado) === */}
      {selectedEvent && (
        <div className="mt-8 flex gap-4">
          <Button
            onClick={() => fetchPromotions(selectedEvent.id)}
            variant="secondary"
            size="md"
          >
            🔄 Recargar promociones
          </Button>

          <Button onClick={handleAddPromotion} variant="success" size="md">
            ➕ Nueva promoción
          </Button>
        </div>
      )}
    </div>
  )
}