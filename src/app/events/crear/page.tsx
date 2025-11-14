'use client'

import React, { useState, useEffect } from 'react'
import { Upload, Repeat, AlertCircle, CheckCircle, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { createEvent, type EventCreateData } from '@/services/api/events'
import { getCategories, type Category } from '@/services/api/categories'
import { TicketTypeService } from '@/services/api/ticketTypes'
import { TicketTypeManager } from '@/components/events/ticket-type-manager'
import type { TicketTypeFormData, TicketTypeCreate } from '@/lib/types'
import { uploadImage, uploadVideo, getFileUrl } from '@/services/api/upload'

// Componente Textarea personalizado (basado en Input)
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    const textareaId = `textarea-${Math.random().toString(36).substr(2, 9)}`
    
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="mb-2 block text-sm font-semibold text-gray-800">
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          className={`flex w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-transparent placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-50 resize-none transition-all ${error ? 'border-red-500 focus-visible:ring-red-500' : ''} ${className}`}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

// Alert Component
const Alert = ({ children, variant = 'info' }: { children: React.ReactNode, variant?: 'success' | 'error' | 'info' }) => {
  const variants = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  }
  
  const icons = {
    success: <CheckCircle className="h-5 w-5 text-green-600" />,
    error: <AlertCircle className="h-5 w-5 text-red-600" />,
    info: <AlertCircle className="h-5 w-5 text-blue-600" />
  }
  
  return (
    <div className={`border rounded-lg p-4 flex items-start space-x-3 ${variants[variant]}`}>
      {icons[variant]}
      <div className="flex-1">{children}</div>
    </div>
  )
}

export default function CrearEventoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [ticketTypes, setTicketTypes] = useState<TicketTypeFormData[]>([])
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    descripcion: '',
    informacionAdicional: '',
    ubicacion: '',
    capacidad: '',
    video: null as File | null,
    imagen: null as File | null,
    seRepite: false,
    fechaInicio: {
      dia: '25',
      mes: 'octubre',
      año: '2025',
      hora: '20',
      minuto: '00'
    },
    fechaFin: {
      dia: '25',
      mes: 'octubre',
      año: '2025',
      hora: '23',
      minuto: '00'
    }
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories()
        setCategories(data.categories)
      } catch (err) {
        console.error('Error loading categories:', err)
      } finally {
        setLoadingCategories(false)
      }
    }
    
    loadCategories()
  }, [])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleDateChange = (type: 'fechaInicio' | 'fechaFin', field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [type]: { ...prev[type], [field]: value }
    }))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, imagen: 'La imagen no debe superar los 5MB' }))
        return
      }
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      
      setFormData(prev => ({ ...prev, imagen: file }))
      setErrors(prev => ({ ...prev, imagen: '' }))
    }
  }

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, imagen: null }))
    setImagePreview(null)
    setErrors(prev => ({ ...prev, imagen: '' }))
  }

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0]
    if (file) {
      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, video: 'El video no debe superar los 50MB' }))
        return
      }
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setVideoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      
      setFormData(prev => ({ ...prev, video: file }))
      setErrors(prev => ({ ...prev, video: '' }))
    }
  }

  const handleRemoveVideo = () => {
    setFormData(prev => ({ ...prev, video: null }))
    setVideoPreview(null)
    setErrors(prev => ({ ...prev, video: '' }))
  }

  // Convert date parts to ISO string
  const constructDateISO = (dateObj: typeof formData.fechaInicio): string => {
    const mesesMap: Record<string, string> = {
      'enero': '01', 'febrero': '02', 'marzo': '03', 'abril': '04',
      'mayo': '05', 'junio': '06', 'julio': '07', 'agosto': '08',
      'septiembre': '09', 'octubre': '10', 'noviembre': '11', 'diciembre': '12'
    }
    
    const mes = mesesMap[dateObj.mes]
    const dia = dateObj.dia.padStart(2, '0')
    const hora = dateObj.hora.padStart(2, '0')
    const minuto = dateObj.minuto.padStart(2, '0')
    
    return `${dateObj.año}-${mes}-${dia}T${hora}:${minuto}:00`
  }

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre del evento es requerido'
    } else if (formData.nombre.length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres'
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida'
    }

    if (!formData.ubicacion.trim()) {
      newErrors.ubicacion = 'La ubicación es requerida'
    }

    if (!formData.capacidad) {
      newErrors.capacidad = 'La capacidad es requerida'
    } else if (parseInt(formData.capacidad) <= 0) {
      newErrors.capacidad = 'La capacidad debe ser mayor a 0'
    }

    // Validate ticket types
    if (ticketTypes.length === 0) {
      newErrors.ticketTypes = 'Debes agregar al menos un tipo de entrada'
    } else {
      // Validate total capacity
      const totalTicketCapacity = ticketTypes.reduce((sum, tt) => sum + parseInt(tt.quantity || '0'), 0)
      const eventCapacity = parseInt(formData.capacidad)
      
      if (totalTicketCapacity > eventCapacity) {
        newErrors.ticketTypes = `La suma de las cantidades de los tipos de entrada (${totalTicketCapacity}) no puede superar la capacidad total del evento (${eventCapacity})`
      }
    }

    // Validate dates
    const startDate = new Date(constructDateISO(formData.fechaInicio))
    const endDate = new Date(constructDateISO(formData.fechaFin))
    const now = new Date()

    if (startDate <= now) {
      newErrors.fechaInicio = 'La fecha de inicio debe ser en el futuro'
    }

    if (endDate <= startDate) {
      newErrors.fechaFin = 'La fecha de fin debe ser posterior a la fecha de inicio'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    setError(null)
    setSuccess(false)

    // Validate form
    if (!validateForm()) {
      setError('Por favor, corrige los errores en el formulario')
      return
    }

    setLoading(true)

    try {
      // Upload multimedia files first and get URLs
      const multimediaUrls: string[] = []
      
      // Upload image if exists
      if (formData.imagen) {
        try {
          setUploadingImage(true)
          const imageResponse = await uploadImage(formData.imagen)
          multimediaUrls.push(imageResponse.url)
        } catch (err: any) {
          console.error('Error uploading image:', err)
          setError('Error al subir la imagen. ' + (err.message || 'Intenta de nuevo.'))
          setLoading(false)
          setUploadingImage(false)
          return
        } finally {
          setUploadingImage(false)
        }
      }
      
      // Upload video if exists
      if (formData.video) {
        try {
          setUploadingVideo(true)
          const videoResponse = await uploadVideo(formData.video)
          multimediaUrls.push(videoResponse.url)
        } catch (err: any) {
          console.error('Error uploading video:', err)
          setError('Error al subir el video. ' + (err.message || 'Intenta de nuevo.'))
          setLoading(false)
          setUploadingVideo(false)
          return
        } finally {
          setUploadingVideo(false)
        }
      }

      // Prepare event data
      const eventData: EventCreateData = {
        title: formData.nombre,
        description: formData.descripcion,
        startDate: constructDateISO(formData.fechaInicio),
        endDate: constructDateISO(formData.fechaFin),
        venue: formData.ubicacion,
        totalCapacity: parseInt(formData.capacidad),
        multimedia: multimediaUrls,
        category_id: formData.categoria || undefined
      }

      // Create event
      const response = await createEvent(eventData)

      // Create ticket types
      const ticketTypesData: TicketTypeCreate[] = ticketTypes.map(tt => ({
        name: tt.name,
        description: tt.description || undefined,
        price: parseFloat(tt.price),
        quantity: parseInt(tt.quantity),
        maxPerPurchase: tt.maxPerPurchase ? parseInt(tt.maxPerPurchase) : undefined
      }))

      await TicketTypeService.createTicketTypes(response.id, ticketTypesData)

      setSuccess(true)
      
      // Redirect to event detail or my events after 2 seconds
      setTimeout(() => {
        router.push(`/events/${response.id}`)
      }, 2000)

    } catch (err: any) {
      console.error('Error creating event:', err)
      setError(err.message || 'Error al crear el evento. Por favor, intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const meses = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar onLogin={() => router.push('/login')} />
      
      <main className="flex-grow">
        <Container className="py-8">
          {/* Alerts */}
          {error && (
            <Alert variant="error">
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </Alert>
          )}

          {success && (
            <Alert variant="success">
              <p className="font-medium">¡Evento creado exitosamente!</p>
              <p className="text-sm">Redirigiendo...</p>
            </Alert>
          )}

          {/* Header */}
          <Card variant="default" className="mb-6 mt-4">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-xl flex items-center justify-center text-2xl font-bold shadow-md">
                  1
                </div>
                <CardTitle className="text-3xl bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
                  Detalles del Evento
                </CardTitle>
              </div>
            </CardHeader>
          </Card>

          {/* Formulario */}
          <Card variant="default">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Columna izquierda */}
                <div className="space-y-6">
                  <Input
                    label={
                      <>
                        Nombre del Evento <span className="text-red-500">*</span>
                      </>
                    }
                    placeholder="Dale un nombre corto y llamativo."
                    value={formData.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    error={errors.nombre}
                  />

                  <Select
                    label="Elige una Categoría"
                    value={formData.categoria}
                    onChange={(e) => handleInputChange('categoria', e.target.value)}
                    disabled={loadingCategories}
                  >
                    <option value="">{loadingCategories ? 'Cargando categorías...' : 'Elige una categoría'}</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </option>
                    ))}
                  </Select>

                  <Textarea
                    label={
                      <>
                        Descripción del Evento <span className="text-red-500">*</span>
                      </>
                    }
                    placeholder="Escribe un párrafo corto pero potente que describa tu evento (Punchline)"
                    rows={4}
                    value={formData.descripcion}
                    onChange={(e) => handleInputChange('descripcion', e.target.value)}
                    error={errors.descripcion}
                  />

                  <Input
                    label={
                      <>
                        Ubicación / Venue <span className="text-red-500">*</span>
                      </>
                    }
                    placeholder="Ej: Estadio Nacional, Lima"
                    value={formData.ubicacion}
                    onChange={(e) => handleInputChange('ubicacion', e.target.value)}
                    error={errors.ubicacion}
                  />

                  <div>
                    <Input
                      label={
                        <>
                          Capacidad Total <span className="text-red-500">*</span>
                        </>
                      }
                      type="number"
                      min="1"
                      placeholder="Ej: 5000"
                      value={formData.capacidad}
                      onChange={(e) => handleInputChange('capacidad', e.target.value)}
                      error={errors.capacidad}
                    />
                    {ticketTypes.length > 0 && formData.capacidad && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Aforo configurado: {ticketTypes.reduce((sum, tt) => sum + parseInt(tt.quantity || '0'), 0)} / {formData.capacidad}</span>
                          <span className={ticketTypes.reduce((sum, tt) => sum + parseInt(tt.quantity || '0'), 0) > parseInt(formData.capacidad) ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'}>
                            {((ticketTypes.reduce((sum, tt) => sum + parseInt(tt.quantity || '0'), 0) / parseInt(formData.capacidad)) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all ${
                              ticketTypes.reduce((sum, tt) => sum + parseInt(tt.quantity || '0'), 0) > parseInt(formData.capacidad) 
                                ? 'bg-red-500' 
                                : 'bg-green-500'
                            }`}
                            style={{ 
                              width: `${Math.min(
                                100, 
                                (ticketTypes.reduce((sum, tt) => sum + parseInt(tt.quantity || '0'), 0) / parseInt(formData.capacidad)) * 100
                              )}%` 
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <Textarea
                    label="Información adicional"
                    placeholder="Dale a los usuarios más información: detalles del evento, panelistas, links relacionados, cronograma del evento, etc."
                    rows={5}
                    value={formData.informacionAdicional}
                    onChange={(e) => handleInputChange('informacionAdicional', e.target.value)}
                  />
                </div>

                {/* Columna derecha */}
                <div className="space-y-6">
                  {/* Imagen */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Imagen <span className="text-red-500">*</span>{' '}
                      <span className="text-gray-500 font-normal">( Recomendado: 836px x 522px )</span>
                    </label>
                    {imagePreview ? (
                      <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden">
                        <img 
                          src={imagePreview} 
                          alt="Vista previa" 
                          className="w-full h-64 object-cover"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors"
                          title="Eliminar imagen"
                        >
                          <X size={20} />
                        </button>
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            id="image-upload"
                            disabled={uploadingImage}
                          />
                          <label htmlFor="image-upload" className="cursor-pointer">
                            <Button variant="primary" size="sm" type="button">
                              <Upload size={16} className="mr-2" />
                              Cambiar Imagen
                            </Button>
                          </label>
                        </div>
                        {formData.imagen && (
                          <div className="absolute bottom-2 left-2 bg-white px-3 py-1 rounded-full text-xs font-medium text-gray-700 shadow">
                            ✓ {formData.imagen.name}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-16 text-center hover:border-primary-500 hover:bg-primary-50 transition-all cursor-pointer bg-gray-50">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                          disabled={uploadingImage}
                        />
                        <label htmlFor="image-upload" className="cursor-pointer block">
                          <div className="text-7xl text-gray-300 mb-4 font-bold">📷</div>
                          <div className="flex items-center justify-center space-x-2 text-primary-600 font-medium">
                            <Upload size={20} />
                            <span>Cargar Imagen</span>
                          </div>
                          <p className="mt-2 text-xs text-gray-500">JPG, PNG, GIF o WEBP (Max. 5MB)</p>
                        </label>
                      </div>
                    )}
                    {errors.imagen && (
                      <p className="mt-1 text-sm text-red-600">{errors.imagen}</p>
                    )}
                    {uploadingImage && (
                      <p className="mt-2 text-sm text-primary-600 flex items-center">
                        <span className="animate-spin mr-2">⏳</span> Subiendo imagen...
                      </p>
                    )}
                  </div>

                  {/* Video */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Video (Opcional)
                    </label>
                    {videoPreview ? (
                      <div className="relative border-2 border-gray-300 rounded-lg overflow-hidden">
                        <video 
                          src={videoPreview} 
                          className="w-full h-48 object-cover"
                          controls
                        />
                        <div className="absolute top-2 right-2 flex gap-2">
                          <button
                            type="button"
                            onClick={handleRemoveVideo}
                            className="bg-red-500 hover:bg-red-600 text-white rounded-full p-2 shadow-lg transition-colors"
                            title="Eliminar video"
                          >
                            <X size={20} />
                          </button>
                          <input
                            type="file"
                            accept="video/*"
                            onChange={handleVideoUpload}
                            className="hidden"
                            id="video-upload"
                            disabled={uploadingVideo}
                          />
                          <label htmlFor="video-upload" className="cursor-pointer">
                            <Button variant="primary" size="sm" type="button">
                              <Upload size={16} className="mr-2" />
                              Cambiar
                            </Button>
                          </label>
                        </div>
                        {formData.video && (
                          <div className="mt-2 px-3 py-1 bg-gray-100 rounded text-xs font-medium text-gray-700 inline-block">
                            ✓ {formData.video.name}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-primary-500 hover:bg-primary-50 transition-all cursor-pointer bg-gray-50">
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleVideoUpload}
                          className="hidden"
                          id="video-upload"
                          disabled={uploadingVideo}
                        />
                        <label htmlFor="video-upload" className="cursor-pointer block">
                          <div className="text-5xl text-gray-300 mb-3">🎥</div>
                          <div className="flex items-center justify-center space-x-2 text-primary-600 font-medium">
                            <Upload size={20} />
                            <span>Cargar Video</span>
                          </div>
                          <p className="mt-2 text-xs text-gray-500">MP4, AVI, MOV, WMV o WEBM (Max. 50MB)</p>
                        </label>
                      </div>
                    )}
                    {errors.video && (
                      <p className="mt-1 text-sm text-red-600">{errors.video}</p>
                    )}
                    {uploadingVideo && (
                      <p className="mt-2 text-sm text-primary-600 flex items-center">
                        <span className="animate-spin mr-2">⏳</span> Subiendo video...
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Checkbox evento se repite */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <Checkbox
                  label={
                    <span className="flex items-center space-x-2">
                      <Repeat size={20} />
                      <span>Este evento se repite (próximamente)</span>
                    </span>
                  }
                  checked={formData.seRepite}
                  onChange={(e) => handleInputChange('seRepite', e.target.checked)}
                  disabled
                />
              </div>

              {/* Selectores de fecha */}
              <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Fecha de inicio */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    Fecha de inicio del evento <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={formData.fechaInicio.dia}
                      onChange={(e) => handleDateChange('fechaInicio', 'dia', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    <span className="text-gray-500">de</span>
                    <select
                      value={formData.fechaInicio.mes}
                      onChange={(e) => handleDateChange('fechaInicio', 'mes', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                      {meses.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <span className="text-gray-500">de</span>
                    <select
                      value={formData.fechaInicio.año}
                      onChange={(e) => handleDateChange('fechaInicio', 'año', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                      {Array.from({ length: 10 }, (_, i) => 2025 + i).map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                    <span className="text-gray-500">,</span>
                    <select
                      value={formData.fechaInicio.hora}
                      onChange={(e) => handleDateChange('fechaInicio', 'hora', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                      {Array.from({ length: 24 }, (_, i) => i).map(h => (
                        <option key={h} value={h}>{h.toString().padStart(2, '0')}</option>
                      ))}
                    </select>
                    <span className="text-gray-500">:</span>
                    <select
                      value={formData.fechaInicio.minuto}
                      onChange={(e) => handleDateChange('fechaInicio', 'minuto', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                      {Array.from({ length: 60 }, (_, i) => i).map(m => (
                        <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>
                      ))}
                    </select>
                  </div>
                  {errors.fechaInicio && (
                    <p className="mt-1 text-sm text-red-600">{errors.fechaInicio}</p>
                  )}
                </div>

                {/* Fecha de fin */}
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-3">
                    El evento finaliza <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    <select
                      value={formData.fechaFin.dia}
                      onChange={(e) => handleDateChange('fechaFin', 'dia', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    <span className="text-gray-500">de</span>
                    <select
                      value={formData.fechaFin.mes}
                      onChange={(e) => handleDateChange('fechaFin', 'mes', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                      {meses.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                    <span className="text-gray-500">de</span>
                    <select
                      value={formData.fechaFin.año}
                      onChange={(e) => handleDateChange('fechaFin', 'año', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                      {Array.from({ length: 10 }, (_, i) => 2025 + i).map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                    <span className="text-gray-500">,</span>
                    <select
                      value={formData.fechaFin.hora}
                      onChange={(e) => handleDateChange('fechaFin', 'hora', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                      {Array.from({ length: 24 }, (_, i) => i).map(h => (
                        <option key={h} value={h}>{h.toString().padStart(2, '0')}</option>
                      ))}
                    </select>
                    <span className="text-gray-500">:</span>
                    <select
                      value={formData.fechaFin.minuto}
                      onChange={(e) => handleDateChange('fechaFin', 'minuto', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                      {Array.from({ length: 60 }, (_, i) => i).map(m => (
                        <option key={m} value={m}>{m.toString().padStart(2, '0')}</option>
                      ))}
                    </select>
                  </div>
                  {errors.fechaFin && (
                    <p className="mt-1 text-sm text-red-600">{errors.fechaFin}</p>
                  )}
                </div>
              </div>

              {/* Sección de Tipos de Entrada */}
              <div className="mt-8 pt-6 border-t-2 border-gray-300">
                <TicketTypeManager
                  ticketTypes={ticketTypes}
                  onChange={setTicketTypes}
                  errors={errors}
                />
              </div>

              {/* Botones de acción */}
              <div className="mt-10 flex flex-col sm:flex-row justify-end gap-4">
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button 
                  variant="primary" 
                  size="lg" 
                  onClick={handleSubmit}
                  loading={loading}
                  disabled={loading}
                >
                  {loading ? 'Creando...' : 'Crear Evento'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </Container>
      </main>

      <Footer />
    </div>
  )
}
