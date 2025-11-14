'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Container } from '@/components/ui/container'
import { Select } from '@/components/ui/select'
import { getCategories } from '@/services/api/categories'
import type { Category } from '@/lib/types/event'
import { EventService } from '@/services/api/events'
import type { EventDetail, EventUpdate, EventStatus } from '@/lib/types'
import {
  Calendar,
  MapPin,
  Users,
  AlertCircle,
  Save,
  ArrowLeft,
  Image as ImageIcon,
  Trash2,
  Eye,
  Ban,
  CheckCircle,
  Edit3
} from 'lucide-react'

export default function EditEventPage() {
  const router = useRouter()
  const params = useParams()
  const eventId = params?.id as string

  const [event, setEvent] = useState<EventDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState<EventUpdate>({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    venue: '',
    totalCapacity: 0,
    multimedia: [],
    category_id: undefined
  })

  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [newImageUrl, setNewImageUrl] = useState('')

  // 🔐 Helper robusto para convertir cualquier error del backend a string
  const showError = (err: any, fallback: string) => {
    console.error(err)
    let msg = fallback

    try {
      const data = err?.response?.data ?? err

      if (typeof data === 'string') {
        msg = data
      } else if (typeof data?.detail === 'string') {
        msg = data.detail
      } else if (Array.isArray(data?.detail)) {
        msg =
          data.detail
            .map((e: any) => e?.msg ?? '')
            .filter(Boolean)
            .join(' | ') || fallback
      } else if (typeof data?.msg === 'string') {
        msg = data.msg
      } else if (typeof err?.message === 'string') {
        msg = err.message
      }
    } catch {
      // si algo falla, usamos el fallback
    }

    setError(msg)
  }

  useEffect(() => {
    if (eventId) {
      loadEvent()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId])

  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true)
        const response = await getCategories(true)
        setCategories(response.categories || [])
      } catch (err) {
        console.error('Error al cargar categorías:', err)
        setCategories([])
      } finally {
        setLoadingCategories(false)
      }
    }

    loadCategories()
  }, [])

  const loadEvent = async () => {
    try {
      setLoading(true)
      const data = await EventService.getEventById(eventId)
      setEvent(data)

      setFormData({
        title: data.title,
        description: data.description || '',
        startDate: data.startDate.substring(0, 16),
        endDate: data.endDate.substring(0, 16),
        venue: data.venue,
        totalCapacity: data.totalCapacity,
        multimedia: data.multimedia || [],
        category_id: (data as any).categoryId || (data as any).category?.id || undefined
      })
    } catch (err: any) {
      showError(err, 'Error al cargar el evento')
    } finally {
      setLoading(false)
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

  try {
    setSaving(true)

    const payload: any = {
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
      multimedia:
        formData.multimedia && formData.multimedia.length > 0
          ? formData.multimedia
          : undefined,
    }

    // solo mandamos categoría si existe; la clave va como espera el backend
    if (formData.category_id) {
      payload.category_id = formData.category_id
    }

    await EventService.updateEvent(eventId, payload)

    alert('Evento actualizado exitosamente')
    router.push('/panel/my-events')
  } catch (err: any) {
    showError(err, 'Error al actualizar el evento')
  } finally {
    setSaving(false)
  }
}
  const handleStatusChange = async (newStatus: EventStatus) => {
    const confirmMessages: Record<EventStatus, string> = {
      DRAFT: '¿Regresar el evento a borrador?',
      PUBLISHED: '¿Publicar este evento?',
      CANCELLED: '¿Cancelar este evento?',
      COMPLETED: '¿Marcar este evento como completado?'
    }

    if (!confirm(confirmMessages[newStatus])) return

    try {
      switch (newStatus) {
        case 'PUBLISHED':
          await EventService.publishEvent(eventId)
          break
        case 'CANCELLED':
          await EventService.cancelEvent(eventId)
          break
        case 'DRAFT':
          await EventService.markEventAsDraft(eventId)
          break
        case 'COMPLETED':
          await EventService.completeEvent(eventId)
          break
        default:
          throw new Error('Acción de estado no soportada')
      }
      await loadEvent()
      alert('Estado actualizado exitosamente')
    } catch (err: any) {
      showError(err, 'Error al actualizar el estado')
    }
  }

  const handleDeleteEvent = async () => {
    if (!confirm('¿Estás seguro de eliminar este evento? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      await EventService.deleteEvent(eventId)
      alert('Evento eliminado exitosamente')
      router.push('/panel/my-events')
    } catch (err: any) {
      showError(err, 'Error al eliminar el evento')
    }
  }

  const addImage = () => {
    if (newImageUrl && formData.multimedia) {
      setFormData({
        ...formData,
        multimedia: [...formData.multimedia, newImageUrl]
      })
      setNewImageUrl('')
    }
  }

  const removeImage = (index: number) => {
    if (formData.multimedia) {
      setFormData({
        ...formData,
        multimedia: formData.multimedia.filter((_, i) => i !== index)
      })
    }
  }

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando evento...</p>
          </div>
        </div>
      </Container>
    )
  }

  if (!event) {
    return (
      <Container>
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Evento no encontrado</h2>
          <Button onClick={() => router.push('/panel/my-events')} className="mt-4">
            Volver a eventos
          </Button>
        </div>
      </Container>
    )
  }

  const getStatusBadgeColor = (status: EventStatus) => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'DRAFT':
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusText = (status: EventStatus) => {
    switch (status) {
      case 'PUBLISHED':
        return 'Publicado'
      case 'CANCELLED':
        return 'Cancelado'
      case 'COMPLETED':
        return 'Completado'
      case 'DRAFT':
      default:
        return 'Borrador'
    }
  }

  return (
    <Container>
      <div className="max-w-4xl mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Editar Evento</h1>
              <p className="text-gray-600">Actualiza la información de tu evento</p>
            </div>

            <div className={`px-3 py-1 rounded-full text-sm border ${getStatusBadgeColor(event.status)}`}>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-current"></span>
                <span className="font-medium">{getStatusText(event.status)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Estado y acciones rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl border-2 border-gray-100 p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Estado del evento</h3>
            <p className="text-xs text-gray-500 mb-3">
              Controla la visibilidad y disponibilidad del evento.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant={event.status === 'DRAFT' ? 'primary' : 'outline'}
                onClick={() => handleStatusChange('DRAFT')}
              >
                <Edit3 className="w-4 h-4 mr-1" />
                Borrador
              </Button>
              <Button
                type="button"
                size="sm"
                variant={event.status === 'PUBLISHED' ? 'primary' : 'outline'}
                onClick={() => handleStatusChange('PUBLISHED')}
              >
                <Eye className="w-4 h-4 mr-1" />
                Publicar
              </Button>
              <Button
                type="button"
                size="sm"
                variant={event.status === 'CANCELLED' ? 'destructive' : 'outline'}
                onClick={() => handleStatusChange('CANCELLED')}
              >
                <Ban className="w-4 h-4 mr-1" />
                Cancelar
              </Button>
              <Button
                type="button"
                size="sm"
                variant={event.status === 'COMPLETED' ? 'success' : 'outline'}
                onClick={() => handleStatusChange('COMPLETED')}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Finalizado
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-xl border-2 border-gray-100 p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Resumen rápido</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Capacidad total:</span>
                <span className="font-medium text-gray-900">{event.totalCapacity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tickets disponibles:</span>
                <span className="font-medium text-gray-900">{event.availableTickets}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Multimedia cargada:</span>
                <span className="font-medium text-gray-900">
                  {formData.multimedia ? formData.multimedia.length : 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Error global */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-xl border-2 border-gray-100 p-6 space-y-6">
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título del evento *
              </label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ej: Concierto de Rock 2024"
                required
              />
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe tu evento..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <Select
                value={formData.category_id || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category_id: e.target.value || undefined,
                  })
                }
                disabled={loadingCategories}
              >
                <option value="">
                  {loadingCategories ? 'Cargando categorías...' : 'Sin categoría'}
                </option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </Select>
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Fecha y hora de inicio *
                </label>
                <Input
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Fecha y hora de fin *
                </label>
                <Input
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Ubicación */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Ubicación *
              </label>
              <Input
                type="text"
                value={formData.venue}
                onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                placeholder="Ej: Estadio Nacional, Lima"
                required
              />
            </div>

            {/* Capacidad */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Users className="w-4 h-4" />
                Capacidad total *
              </label>
              <Input
                type="number"
                min="1"
                value={formData.totalCapacity}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    totalCapacity: parseInt(e.target.value || '0', 10),
                  })
                }
                placeholder="1000"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Tickets disponibles: {event.availableTickets}
              </p>
            </div>

            {/* Multimedia */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contenido visual</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Imagen principal si existe */}
                <div className="md:col-span-1">
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-3 flex flex-col items-center justify-center text-center h-full">
                    <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm font-medium text-gray-700">Imagen principal</p>
                    {event && (event as any).photoUrl && (
                      <img
                        src={(event as any).photoUrl}
                        alt={event.title}
                        className="mt-2 w-full h-32 object-cover rounded-md"
                      />
                    )}
                  </div>
                </div>

                {/* URLs multimedia extra */}
                <div className="md:col-span-2 space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      URLs de imágenes / videos
                    </label>
                    <div className="space-y-2">
                      {formData.multimedia && formData.multimedia.length > 0 ? (
                        formData.multimedia.map((url, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              type="url"
                              value={url}
                              onChange={(e) => {
                                const newMultimedia = [...(formData.multimedia || [])]
                                newMultimedia[index] = e.target.value
                                setFormData({ ...formData, multimedia: newMultimedia })
                              }}
                              placeholder="https://ejemplo.com/imagen.jpg"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeImage(index)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-gray-500">
                          Aún no has agregado contenido multimedia adicional.
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2">
                      Agregar nueva URL
                    </label>
                    <div className="flex gap-2">
                      <Input
                        type="url"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="https://ejemplo.com/video.mp4 o .gif"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addImage}
                      >
                        + Agregar
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      🎬 Videos, GIFs o imágenes adicionales del evento
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-wrap gap-3">
            <Button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Guardando...' : 'Guardar cambios'}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>

            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteEvent}
              className="ml-auto"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar evento
            </Button>
          </div>
        </form>
      </div>
    </Container>
  )
}
