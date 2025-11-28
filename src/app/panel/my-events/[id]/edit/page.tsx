'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Container } from '@/components/ui/container'
import { Select } from '@/components/ui/select'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { getCategories } from '@/services/api/categories'
import { Category } from '@/lib/types'
import { EventService } from '@/services/api/events'
import { TicketTypeService } from '@/services/api/ticketTypes'
import type { EventDetail, EventUpdate, EventStatus } from '@/lib/types'
import { Save, ArrowLeft } from 'lucide-react'
import { compressImage, isImageFile, validateFileSize } from '@/lib/utils/imageCompression'

type TicketTypeFormRow = {
  id?: string
  name: string
  description: string
  price: number
  quantity_available: number
  max_purchase: number | null
}

type FormData = {
  title: string
  description: string
  startDate: string
  endDate: string
  venue: string
  totalCapacity: number
  multimedia: string[]
  ticketTypes: TicketTypeFormRow[]
  category_id?: string
}

const STATUS_OPTIONS: { value: EventStatus; label: string }[] = [
  { value: 'DRAFT' as EventStatus, label: 'Borrador' },
  { value: 'PUBLISHED' as EventStatus, label: 'Publicado' },
  { value: 'CANCELLED' as EventStatus, label: 'Cancelado' },
  { value: 'COMPLETED' as EventStatus, label: 'Completado' }
]

export default function EditEventPage() {
  const router = useRouter()
  const params = useParams()
  const eventId = params?.id as string

  const [event, setEvent] = useState<EventDetail | null>(null)
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    venue: '',
    totalCapacity: 0,
    multimedia: [],
    ticketTypes: [],
    category_id: undefined
  })

  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [statusUpdating, setStatusUpdating] = useState(false)
  const [ticketCapacityError, setTicketCapacityError] = useState<string | null>(null)


  // ✅ NUEVO: índices seleccionados para eliminación masiva
  const [selectedTicketIndexes, setSelectedTicketIndexes] = useState<number[]>([])

  // Imagen
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [existingImageUrl, setExistingImageUrl] = useState<string>('')

  const showError = (err: any, fallback: string) => {
    console.error(err)
    let msg = fallback
    try {
      const data = err?.response?.data ?? err
      if (typeof data === 'string') msg = data
      else if (typeof data?.detail === 'string') msg = data.detail
      else if (Array.isArray(data?.detail)) {
        msg = data.detail.map((e: any) => e?.msg ?? '').filter(Boolean).join(' ') || fallback
      }
    } catch {
      msg = fallback
    }
    setError(msg)
    setSuccess(null)
  }

  const loadEvent = async () => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      const data = await EventService.getEventById(eventId)
      setEvent(data)

      const startDate = data.startDate
        ? new Date(data.startDate).toISOString().slice(0, 16)
        : ''
      const endDate = data.endDate
        ? new Date(data.endDate).toISOString().slice(0, 16)
        : ''

      const fixedTickets =
        (data as any).ticket_types?.map((t: any) => ({
          id: t.id,
          name: t.name,
          price: t.price,
          description: t.description ?? '',
          quantity_available: t.quantity_available ?? t.quantity ?? 0,
          max_purchase: t.max_purchase ?? null
        })) ?? []

      const photoUrl =
        (data as any).photoUrl ||
        (data as any).imageUrl ||
        ''

      setFormData({
        title: data.title ?? '',
        description: data.description ?? '',
        startDate,
        endDate,
        venue: data.venue ?? '',
        totalCapacity: data.totalCapacity ?? 0,
        multimedia: (data as any).multimedia ?? [],
        category_id: data.category?.id ?? undefined,
        ticketTypes: fixedTickets
      })

      setExistingImageUrl(photoUrl)
      setImagePreview(photoUrl || '')
      setSelectedTicketIndexes([]) // ✅ limpiar selección al cargar
    } catch (err) {
      showError(err, 'No se pudo cargar el evento')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (eventId) loadEvent()
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId])

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true)
        const response = await getCategories(true)
        setCategories(response.categories || [])
      } catch {
        setCategories([])
      } finally {
        setLoadingCategories(false)
      }
    }
    loadCategories()
  }, [])

  const handleStatusChange = async (newStatus: EventStatus) => {
    if (!event) return
    if (event.status === newStatus) return

    try {
      setStatusUpdating(true)
      setError(null)
      setSuccess(null)
      const updatedEvent = await EventService.updateEventStatus(event.id, newStatus)
      setEvent(prev => (prev ? { ...prev, status: updatedEvent.status } : prev))
      setSuccess('Estado del evento actualizado correctamente.')
    } catch (err) {
      showError(err, 'No se pudo actualizar el estado del evento')
    } finally {
      setStatusUpdating(false)
    }
  }

  const handleImageChange = async (file: File | null) => {
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview)
    }

    if (!file) {
      setImageFile(null)
      setImagePreview(existingImageUrl || '')
      return
    }

    // Validar que sea una imagen
    if (!isImageFile(file)) {
      setError('Por favor selecciona un archivo de imagen válido')
      return
    }

    // Validar tamaño (máximo 5MB)
    if (!validateFileSize(file, 5)) {
      setError('La imagen no puede superar los 5MB')
      return
    }

    try {
      // Comprimir la imagen a 256x256 con calidad 60%
      const compressedBase64 = await compressImage(file, 256, 0.6)
      
      setImageFile(file)
      setImagePreview(compressedBase64)
      
      // Limpiar error si había
      setError(null)
    } catch (error) {
      console.error('Error al comprimir imagen:', error)
      setError('Error al procesar la imagen. Por favor intenta con otra imagen.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.title || !formData.venue || !formData.startDate || !formData.endDate) {
      setError('Por favor completa todos los campos obligatorios')
      return
    }

    if (formData.totalCapacity && formData.totalCapacity <= 0) {
      setError('La capacidad debe ser mayor a 0')
      return
    }

   // ✅ Validar que la suma de tickets no supere la capacidad
    const totalTicketsConfigured = formData.ticketTypes.reduce(
      (sum, t) => sum + (t.quantity_available ?? 0),
      0
    )

    if (totalTicketsConfigured > formData.totalCapacity) {
      const msg =
        `La suma de las cantidades de todos los tipos de entrada (${totalTicketsConfigured}) ` +
        `no puede superar la capacidad total del evento (${formData.totalCapacity}).`


      //usamos el toast flotante
      setTicketCapacityError(msg)
      setTimeout(() => setTicketCapacityError(null), 3500)

      return
    }

    try {
      setSaving(true)

      const payload: EventUpdate = {
        title: formData.title,
        description: formData.description || undefined,
        startDate: formData.startDate
          ? new Date(formData.startDate).toISOString()
          : undefined,
        endDate: formData.endDate
          ? new Date(formData.endDate).toISOString()
          : undefined,
        venue: formData.venue,
        totalCapacity: formData.totalCapacity || undefined,
        multimedia: formData.multimedia?.length ? formData.multimedia : undefined,
        category_id: formData.category_id || undefined
      }

      // 1) Actualizar datos del evento
      const updatedEvent = await EventService.updateEvent(eventId, payload)

      // 2) Actualizar tipos de entrada en bloque
      const ticketTypesPayload = formData.ticketTypes.map((t: any) => ({
        id: t.id,                        // puede ser undefined para nuevos
        name: t.name,
        description: t.description || '',
        price: Number(t.price) || 0,
        quantity: Number(t.quantity_available) || 0,
        maxPerPurchase:
          t.max_purchase !== null && t.max_purchase !== undefined
            ? Number(t.max_purchase)
            : null
      }))

      if (ticketTypesPayload.length > 0) {
        await TicketTypeService.updateTicketTypesBatch(eventId, ticketTypesPayload)
      }

      // 3) Subir imagen (si se cambió)
      if (imageFile) {
        try {
          await EventService.uploadEventPhoto(updatedEvent.id, imageFile)
        } catch (photoErr) {
          console.error('Error al actualizar la foto del evento:', photoErr)
        }
      }

      setEvent(prev => (prev ? { ...prev, ...updatedEvent } : prev))

      router.push('/panel/my-events?updated=1')
    } catch (err) {
      showError(err, 'No se pudo actualizar el evento')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!eventId) return
    const confirmDelete = window.confirm(
      '¿Estás segura de que deseas eliminar este evento? Esta acción no se puede deshacer.'
    )
    if (!confirmDelete) return

    try {
      setError(null)
      setSuccess(null)
      setDeleting(true)
      await EventService.deleteEvent(eventId)
      router.push('/panel/my-events?deleted=1')
    } catch (err) {
      showError(err, 'No se pudo eliminar el evento')
    } finally {
      setDeleting(false)
    }
  }

  // ✅ NUEVO: helpers para selección y eliminación masiva de tipos
  const toggleTicketSelected = (index: number) => {
    setSelectedTicketIndexes(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const handleDeleteSelectedTicketTypes = () => {
    if (selectedTicketIndexes.length === 0) return

    const confirmDelete = window.confirm(
      '¿Eliminar los tipos de entrada seleccionados? Esta acción no se puede deshacer.'
    )
    if (!confirmDelete) return

    setFormData(prev => ({
      ...prev,
      ticketTypes: prev.ticketTypes.filter((_, i) => !selectedTicketIndexes.includes(i))
    }))
    setSelectedTicketIndexes([])
  }

  if (loading) {
    return <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" />
  }

  if (!event) {
    return <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="flex-grow">
        <Container className="py-8 max-w-5xl">
          <div className="max-w-4xl mx-auto">
            {/* HEADER */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={() => router.back()}
                  className="mb-3"
                >
                  <ArrowLeft size={16} className="mr-2" />
                  Volver
                </Button>
                <h1 className="text-3xl font-bold text-gray-900">Editar Evento</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Actualiza la información de tu evento y los tipos de entrada
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* DETALLES DEL EVENTO */}
              <Card variant="default" className="shadow-lg">
                <CardHeader className="bg-gradient-to-r from-primary-50 to-blue-50">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-600 text-white text-sm font-bold">
                      1
                    </span>
                    Detalles del Evento
                  </CardTitle>
                  <p className="text-gray-600 mt-2 text-sm">
                    Información básica sobre tu evento
                  </p>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* Estado del evento */}
                  <div className="border-t pt-6 mt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Estado del Evento
                    </h3>
                    <p className="text-xs text-gray-500 mb-3">
                      Selecciona el estado actual del evento.
                    </p>

                    <div className="flex flex-wrap gap-3">
                      {STATUS_OPTIONS.map((opt) => {
                        const isActive = event.status === opt.value
                        return (
                          <Button
                            key={opt.value}
                            type="button"
                            variant={isActive ? 'primary' : 'outline'}
                            size="sm"
                            className={
                              'rounded-full px-4 ' +
                              (isActive ? 'shadow-sm' : 'border-gray-300 text-gray-700')
                            }
                            onClick={() => handleStatusChange(opt.value)}
                            disabled={statusUpdating || saving || deleting}
                          >
                            {opt.label}
                          </Button>
                        )
                      })}
                    </div>

                    {statusUpdating && (
                      <p className="mt-2 text-xs text-gray-500">
                        Actualizando estado del evento...
                      </p>
                    )}
                  </div>

                  {/* Campos del evento */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Nombre del Evento"
                      placeholder="Ej: Concierto de Rock"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                    />

                    <Select
                      label="Categoría"
                      value={formData.category_id ?? ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          category_id: e.target.value || undefined
                        })
                      }
                      disabled={loadingCategories || saving || deleting}
                    >
                      <option value="">
                        {loadingCategories
                          ? 'Cargando...'
                          : 'Selecciona una categoría (opcional)'}
                      </option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name}
                        </option>
                      ))}
                    </Select>

                    <div className="md:col-span-2">
                      <label className="mb-1 block text-sm font-semibold text-gray-800">
                        Descripción
                      </label>
                      <textarea
                        className="w-full rounded-lg border border-gray-300 p-3 text-sm"
                        placeholder="Describe tu evento en detalle..."
                        rows={5}
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        required
                      />
                    </div>

                    <Input
                      label="Ubicación"
                      placeholder="Ej: Estadio Nacional, Lima"
                      value={formData.venue}
                      onChange={(e) =>
                        setFormData({ ...formData, venue: e.target.value })
                      }
                      required
                    />

                    <Input
                      label="Capacidad Total"
                      type="number"
                      min="1"
                      placeholder="Ej: 1000"
                      value={formData.totalCapacity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          totalCapacity: Number(e.target.value)
                        })
                      }
                      required
                    />

                    <Input
                      label="Fecha y Hora de Inicio"
                      type="datetime-local"
                      value={formData.startDate}
                      onChange={(e) =>
                        setFormData({ ...formData, startDate: e.target.value })
                      }
                      required
                    />

                    <Input
                      label="Fecha y Hora de Fin"
                      type="datetime-local"
                      value={formData.endDate}
                      onChange={(e) =>
                        setFormData({ ...formData, endDate: e.target.value })
                      }
                      required
                    />
                  </div>

                  {/* Imagen del evento */}
                  <div className="border-t pt-6 mt-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Imagen del Evento
                    </h3>
                    <p className="text-xs text-gray-500 mb-3">
                      Esta imagen se mostrará como portada en la ficha del evento.
                    </p>

                    <div className="max-w-md">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white hover:border-primary-400 transition-colors">
                        <label className="mb-2 block text-sm font-semibold text-gray-800">
                          📸 Imagen principal
                        </label>

                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleImageChange(e.target.files ? e.target.files[0] : null)
                          }
                          disabled={saving || deleting}
                          className="mb-2"
                        />

                        <p className="text-xs text-gray-500 mt-1">
                          💡 Imagen destacada que se mostrará en la portada del evento
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          📏 La imagen se redimensionará a 256x256px y se optimizará (máx. 5MB)
                        </p>

                        <div className="mt-3">
                          {imagePreview ? (
                            <div className="relative group">
                              <img
                                src={imagePreview}
                                alt="Vista previa"
                                className="w-full h-48 object-cover rounded-lg shadow-sm"
                                onError={(e) => {
                                  e.currentTarget.src =
                                    'https://placehold.co/400x300/e5e7eb/6b7280?text=Vista+previa'
                                  e.currentTarget.onerror = null
                                }}
                              />
                              {imageFile && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  type="button"
                                  onClick={() => handleImageChange(null)}
                                  className="absolute top-2 right-2 bg-red-500 text-white hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity rounded-full px-2 py-1 text-xs"
                                >
                                  Quitar
                                </Button>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-40 bg-gray-50 rounded-lg border border-gray-200">
                              <span className="text-sm text-gray-400">
                                No hay imagen seleccionada
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* TIPOS DE ENTRADA */}
              <Card variant="default" className="shadow-lg mt-6">
                <CardHeader className="bg-gradient-to-r from-primary-50 to-blue-50">
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-600 text-white text-sm font-bold">
                      2
                    </span>
                    Tipos de Entrada
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <p className="text-xs text-gray-500 mb-2">
                    Edita los tipos de entrada existentes o agrega nuevos. Selecciona varios para eliminarlos en conjunto.
                  </p>

                  {formData.ticketTypes?.map((t: any, index: number) => (
                    <div
                      key={t.id ?? index}
                      className="border border-gray-200 p-4 rounded-lg space-y-4 bg-gray-50"
                    >
                      {/* ✅ cabecera con checkbox de selección */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-500">
                          Tipo #{index + 1}
                        </span>
                        <label className="inline-flex items-center gap-2 text-xs text-gray-600">
                          <input
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300"
                            checked={selectedTicketIndexes.includes(index)}
                            onChange={() => toggleTicketSelected(index)}
                          />
                          Seleccionar para eliminar
                        </label>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="mb-1 block text-xs font-semibold text-gray-700">
                            Nombre del tipo
                          </label>
                          <Input
                            placeholder="Ej: General, VIP"
                            value={t.name}
                            onChange={(e) => {
                              const updated = [...formData.ticketTypes]
                              updated[index].name = e.target.value
                              setFormData({ ...formData, ticketTypes: updated })
                            }}
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-xs font-semibold text-gray-700">
                            Precio (S/.)
                          </label>
                          <Input
                            type="number"
                            min="0"
                            step="0.1"
                            placeholder="Ej: 50.00"
                            value={t.price ?? ''}
                            onChange={(e) => {
                              const updated = [...formData.ticketTypes]
                              updated[index].price = Number(e.target.value)
                              setFormData({ ...formData, ticketTypes: updated })
                            }}
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-xs font-semibold text-gray-700">
                            Máximo por compra
                          </label>
                          <Input
                            type="number"
                            min="1"
                            placeholder="Ej: 4"
                            value={t.max_purchase ?? ''}
                            onChange={(e) => {
                              const updated = [...formData.ticketTypes]
                              updated[index].max_purchase = e.target.value
                                ? Number(e.target.value)
                                : null
                              setFormData({ ...formData, ticketTypes: updated })
                            }}
                          />
                        </div>

                        <div>
                          <label className="mb-1 block text-xs font-semibold text-gray-700">
                            Cantidad disponible
                          </label>
                          <Input
                            type="number"
                            min="0"
                            placeholder="Ej: 100"
                            value={t.quantity_available ?? ''}
                            onChange={(e) => {
                              const updated = [...formData.ticketTypes]
                              updated[index].quantity_available = Number(e.target.value)
                              setFormData({ ...formData, ticketTypes: updated })
                            }}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-semibold text-gray-700">
                          Descripción
                        </label>
                        <textarea
                          placeholder="Descripción breve del tipo de entrada"
                          className="w-full rounded-lg border border-gray-300 p-2 text-sm"
                          value={t.description ?? ''}
                          onChange={(e) => {
                            const updated = [...formData.ticketTypes]
                            updated[index].description = e.target.value
                            setFormData({ ...formData, ticketTypes: updated })
                          }}
                        />
                      </div>

                      {/* ❌ aquí quitamos el botón "Eliminar tipo" individual */}
                    </div>
                  ))}

                  {/* ✅ Botón de eliminación masiva */}
                  {formData.ticketTypes.length > 0 && (
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-500">
                        Marca los tipos que desees eliminar y luego usa el botón.
                      </p>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        disabled={selectedTicketIndexes.length === 0}
                        onClick={handleDeleteSelectedTicketTypes}
                      >
                        Eliminar tipos seleccionados
                      </Button>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        ticketTypes: [
                          ...formData.ticketTypes,
                          {
                            id: undefined,
                            name: '',
                            price: 0,
                            description: '',
                            quantity_available: 0,
                            max_purchase: null
                          }
                        ]
                      })
                    }
                  >
                    + Agregar nuevo tipo de entrada
                  </Button>
                </CardContent>
              </Card>

              {/* ACCIONES */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => router.back()}
                    disabled={saving || deleting}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={saving || deleting}
                  >
                    {deleting ? 'Eliminando...' : 'Eliminar evento'}
                  </Button>
                </div>
                <Button type="submit" variant="primary" disabled={saving || deleting}>
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </Button>
              </div>
            </form>
          </div>
        </Container>
       </main>

      {/* 🔔 Toast flotante para error de capacidad de tickets */}
      {ticketCapacityError && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="rounded-lg bg-red-600 text-white px-4 py-3 shadow-lg text-sm max-w-xs">
            {ticketCapacityError}
          </div>
        </div>
      )}
    </div>
  )
}