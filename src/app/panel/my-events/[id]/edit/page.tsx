'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Container } from '@/components/ui/container'
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
  CheckCircle
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
    multimedia: []
  })

  const [newImageUrl, setNewImageUrl] = useState('')

  useEffect(() => {
    if (eventId) {
      loadEvent()
    }
  }, [eventId])

  const loadEvent = async () => {
    try {
      setLoading(true)
      const data = await EventService.getEventById(eventId)
      setEvent(data)
      
      // Llenar el formulario con los datos del evento
      setFormData({
        title: data.title,
        description: data.description || '',
        startDate: data.startDate.substring(0, 16), // Format for datetime-local
        endDate: data.endDate.substring(0, 16),
        venue: data.venue,
        totalCapacity: data.totalCapacity,
        multimedia: data.multimedia || []
      })
    } catch (err: any) {
      setError(err.message || 'Error al cargar el evento')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
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
      setError(null)

      await EventService.updateEvent(eventId, {
        ...formData,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
        endDate: formData.endDate ? new Date(formData.endDate).toISOString() : undefined
      })

      alert('Evento actualizado exitosamente')
      router.push('/events')
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el evento')
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
        // Agregar otros casos si es necesario
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
      setError(err.message || 'Error al actualizar el estado')
    }
  }

  const handleDeleteEvent = async () => {
    if (!confirm('¿Estás seguro de eliminar este evento? Esta acción no se puede deshacer.')) {
      return
    }

    try {
      await EventService.deleteEvent(eventId)
      alert('Evento eliminado exitosamente')
      router.push('/events')
    } catch (err: any) {
      setError(err.message || 'Error al eliminar el evento')
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
          <Button onClick={() => router.push('/events')} className="mt-4">
            Volver a eventos
          </Button>
        </div>
      </Container>
    )
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
            
            {/* Estado actual */}
            <div className="flex items-center gap-2">
              {event.status === 'DRAFT' && (
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                  Borrador
                </span>
              )}
              {event.status === 'PUBLISHED' && (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Publicado
                </span>
              )}
              {event.status === 'CANCELLED' && (
                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium flex items-center gap-1">
                  <Ban className="w-4 h-4" />
                  Cancelado
                </span>
              )}
              {event.status === 'COMPLETED' && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  Completado
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Card principal */}
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              />
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
                onChange={(e) => setFormData({ ...formData, totalCapacity: parseInt(e.target.value) })}
                placeholder="1000"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Tickets disponibles: {event.availableTickets}
              </p>
            </div>

            {/* Sección de Multimedia */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contenido Visual</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Imagen Principal */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Imagen Principal (URL)
                  </label>
                  <Input
                    type="url"
                    value={formData.multimedia?.[0] || ''}
                    onChange={(e) => {
                      const newMultimedia = [...(formData.multimedia || [])]
                      if (e.target.value) {
                        newMultimedia[0] = e.target.value
                      } else {
                        newMultimedia.shift()
                      }
                      setFormData({ ...formData, multimedia: newMultimedia })
                    }}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    💡 Imagen destacada que se mostrará en la portada del evento
                  </p>
                  {formData.multimedia?.[0] && (
                    <div className="mt-3 border rounded-lg p-2 bg-gray-50">
                      <img 
                        src={formData.multimedia[0]} 
                        alt="Vista previa" 
                        className="w-full h-40 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Error+al+cargar+imagen'
                        }}
                      />
                    </div>
                  )}
                </div>

                {/* Contenido Multimedia */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Contenido Multimedia (URLs)
                  </label>
                  
                  <div className="space-y-2">
                    {(formData.multimedia || []).slice(1).map((url, index) => (
                      <div key={index + 1} className="flex gap-2">
                        <Input
                          type="url"
                          value={url}
                          onChange={(e) => {
                            const newMultimedia = [...(formData.multimedia || [])]
                            newMultimedia[index + 1] = e.target.value
                            setFormData({ ...formData, multimedia: newMultimedia })
                          }}
                          placeholder="https://ejemplo.com/video.mp4 o .gif"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeImage(index + 1)}
                        >
                          ✕
                        </Button>
                      </div>
                    ))}
                    
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
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    🎬 Videos, GIFs o imágenes adicionales del evento
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-wrap gap-3">
            {/* Guardar cambios */}
            <Button
              type="submit"
              loading={saving}
              disabled={saving}
              className="flex-1 md:flex-none"
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar cambios
            </Button>

            {/* Cambiar estado */}
            {event.status === 'DRAFT' && (
              <Button
                type="button"
                variant="success"
                onClick={() => handleStatusChange('PUBLISHED')}
              >
                <Eye className="w-4 h-4 mr-2" />
                Publicar evento
              </Button>
            )}

            {event.status === 'PUBLISHED' && (
              <Button
                type="button"
                variant="outline"
                onClick={() => handleStatusChange('CANCELLED')}
              >
                <Ban className="w-4 h-4 mr-2" />
                Cancelar evento
              </Button>
            )}

            {/* Eliminar evento */}
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