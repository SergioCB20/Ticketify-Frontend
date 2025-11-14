'use client'

import React, { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { TicketTypeManager } from '@/components/events/ticket-type-manager'
import { EventService } from '@/services/api/events'
import { getCategories } from '@/services/api/categories'
import type { Category } from '@/lib/types/event'
import type { TicketTypeFormData } from '@/lib/types/ticketType'

const Textarea = React.forwardRef<HTMLTextAreaElement, any>(
  ({ label, error, className = '', required, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-2 block text-sm font-semibold text-gray-800">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <textarea
          className={`flex w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed ${
            error ? 'border-red-500' : ''
          } ${className}`}
          ref={ref}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

const Alert = ({ 
  children, 
  variant = 'info' 
}: { 
  children: React.ReactNode
  variant?: 'success' | 'error' | 'warning' | 'info'
}) => {
  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  }
  
  const icons = {
    success: <CheckCircle className="h-5 w-5" />,
    error: <AlertCircle className="h-5 w-5" />,
    warning: <AlertCircle className="h-5 w-5" />,
    info: <AlertCircle className="h-5 w-5" />
  }
  
  return (
    <div className={`border rounded-lg p-4 flex items-start space-x-3 mb-6 ${styles[variant]}`}>
      {icons[variant]}
      <div className="flex-1">{children}</div>
    </div>
  )
}

const ProgressStep = ({ 
  step, 
  label, 
  currentStep, 
  isLast = false 
}: { 
  step: number
  label: string
  currentStep: number
  isLast?: boolean
}) => {
  const isActive = currentStep >= step
  const isCompleted = currentStep > step
  
  return (
    <>
      <div className="flex items-center space-x-2">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
            isActive ? 'bg-primary-600 text-white scale-110' : 'bg-gray-200 text-gray-500'
          }`}
        >
          {isCompleted ? <CheckCircle size={20} /> : step}
        </div>
        <span className={`font-medium hidden sm:inline ${isActive ? 'text-primary-600' : 'text-gray-400'}`}>
          {label}
        </span>
      </div>
      {!isLast && (
        <div className={`w-16 h-1 transition-all ${isActive ? 'bg-primary-600' : 'bg-gray-300'}`} />
      )}
    </>
  )
}

export default function CrearEventoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [currentStep, setCurrentStep] = useState(1)
  
  // Estados para archivos
  const [imagenPrincipalFile, setImagenPrincipalFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  
  const [formData, setFormData] = useState({
    nombre: '',
    categoria: '',
    descripcion: '',
    ubicacion: '',
    capacidad: '',
    fechaInicio: '',
    fechaFin: '',
    imagenPrincipal: ''
  })

  const [ticketTypes, setTicketTypes] = useState<TicketTypeFormData[]>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Manejo de imagen principal
  const handleImagenPrincipalChange = (file: File | null) => {
    if (file) {
      setImagenPrincipalFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
      // Aquí podrías subir el archivo a un servidor y obtener la URL
      // Por ahora, simulamos guardando el nombre del archivo
      handleInputChange('imagenPrincipal', `url-de-${file.name}`)
    } else {
      setImagenPrincipalFile(null)
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
      setPreviewUrl('')
      handleInputChange('imagenPrincipal', '')
    }
  }



  // Limpiar URLs cuando el componente se desmonte
  React.useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  // Cargar categorías
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoadingCategories(true)
        const response = await getCategories(true)
        setCategories(response.categories || [])
      } catch (err) {
        console.error('Error loading categories:', err)
        setCategories([])
      } finally {
        setLoadingCategories(false)
      }
    }

    loadCategories()
  }, [])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
    setError(null)
  }

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre del evento es requerido'
    } else if (formData.nombre.trim().length < 5) {
      newErrors.nombre = 'El nombre debe tener al menos 5 caracteres'
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida'
    } else if (formData.descripcion.trim().length < 20) {
      newErrors.descripcion = 'La descripción debe tener al menos 20 caracteres'
    }

    if (!formData.ubicacion.trim()) {
      newErrors.ubicacion = 'La ubicación es requerida'
    }

    const capacity = parseInt(formData.capacidad)
    if (!formData.capacidad || isNaN(capacity) || capacity <= 0) {
      newErrors.capacidad = 'La capacidad debe ser un número mayor a 0'
    } else if (capacity > 100000) {
      newErrors.capacidad = 'La capacidad no puede exceder 100,000 personas'
    }

    if (!formData.fechaInicio) {
      newErrors.fechaInicio = 'La fecha de inicio es requerida'
    } else {
      const now = new Date()
      const startDate = new Date(formData.fechaInicio)
      if (startDate < now) {
        newErrors.fechaInicio = 'La fecha de inicio no puede ser en el pasado'
      }
    }

    if (!formData.fechaFin) {
      newErrors.fechaFin = 'La fecha de fin es requerida'
    }
    
    if (formData.fechaInicio && formData.fechaFin) {
      const startDate = new Date(formData.fechaInicio)
      const endDate = new Date(formData.fechaFin)
      
      if (endDate <= startDate) {
        newErrors.fechaFin = 'La fecha de fin debe ser posterior a la fecha de inicio'
      }
      
      const duration = endDate.getTime() - startDate.getTime()
      const maxDuration = 30 * 24 * 60 * 60 * 1000 // 30 días
      
      if (duration > maxDuration) {
        newErrors.fechaFin = 'El evento no puede durar más de 30 días'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (ticketTypes.length === 0) {
      newErrors.ticketTypes = 'Debes agregar al menos un tipo de entrada'
      setErrors(newErrors)
      return false
    }

    const totalCapacity = parseInt(formData.capacidad)
    let totalTickets = 0

    ticketTypes.forEach(tt => {
      const quantity = parseInt(tt.quantity)
      if (!isNaN(quantity)) {
        totalTickets += quantity
      }
    })

    if (totalTickets > totalCapacity) {
      newErrors.ticketTypes = `El total de entradas (${totalTickets}) excede la capacidad del evento (${totalCapacity})`
    }

    if (totalTickets === 0) {
      newErrors.ticketTypes = 'Debes asignar al menos una entrada'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep1()) {
      setCurrentStep(2)
      setError(null)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      setError('Por favor corrige los errores en el formulario')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePreviousStep = () => {
    setCurrentStep(1)
    setError(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async () => {
    if (!validateStep2()) {
      setError('Por favor corrige los errores en los tipos de entrada')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setLoading(true)
    setError(null)

    try {
      const eventWithTicketTypes = {
        event: {
          title: formData.nombre.trim(),
          description: formData.descripcion.trim(),
          startDate: new Date(formData.fechaInicio).toISOString(),
          endDate: new Date(formData.fechaFin).toISOString(),
          venue: formData.ubicacion.trim(),
          totalCapacity: parseInt(formData.capacidad),
          category_id: formData.categoria || undefined
        },
        ticketTypes: ticketTypes.map(tt => ({
          name: tt.name.trim(),
          description: tt.description.trim() || undefined,
          price: parseFloat(tt.price),
          quantity: parseInt(tt.quantity),
          maxPerPurchase: tt.maxPerPurchase ? parseInt(tt.maxPerPurchase) : undefined,
          salesStartDate: undefined,
          salesEndDate: undefined
        }))
      }

      const result = await EventService.createEventWithTicketTypes(eventWithTicketTypes)
      
      // Si hay imagen principal, subirla
      if (imagenPrincipalFile) {
        try {
          await EventService.uploadEventPhoto(result.event.id, imagenPrincipalFile)
        } catch (photoError) {
          console.error('Error al subir la foto:', photoError)
          // No fallar si la foto no se sube, el evento ya fue creado
        }
      }
      
      setSuccess(true)
      
      setTimeout(() => {
        router.push('/panel/my-events')
      }, 2000)
    } catch (err: any) {
      console.error('Error al crear evento:', err)
      
      const errorMessage = 
        err.response?.data?.detail || 
        err.response?.data?.message || 
        err.message || 
        'Error al crear el evento. Por favor intenta nuevamente.'
      
      setError(errorMessage)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } finally {
      setLoading(false)
    }
  }

  const totalTicketsCapacity = ticketTypes.reduce(
    (sum, tt) => sum + (parseInt(tt.quantity) || 0), 
    0
  )
  const totalEventCapacity = parseInt(formData.capacidad) || 0
  const remainingCapacity = totalEventCapacity - totalTicketsCapacity

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="flex-grow">
        <Container className="py-8 max-w-5xl">
          {/* Header */}
          <div className="mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="mb-4"
            >
              <ArrowLeft size={16} className="mr-2" />
              Volver
            </Button>
            
            <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Evento</h1>
            <p className="text-gray-600 mt-2">
              Completa la información para publicar tu evento
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <Alert variant="error">
              <p className="font-medium">{error}</p>
            </Alert>
          )}
          
          {success && (
            <Alert variant="success">
              <div>
                <p className="font-medium">¡Evento creado exitosamente!</p>
                <p className="text-sm mt-1">Redirigiendo a tus eventos...</p>
              </div>
            </Alert>
          )}

          {/* Progress Indicator */}
          <div className="mb-8 flex items-center justify-center space-x-4 bg-white rounded-lg p-6 shadow-sm">
            <ProgressStep step={1} label="Detalles del Evento" currentStep={currentStep} />
            <ProgressStep step={2} label="Tipos de Entrada" currentStep={currentStep} isLast />
          </div>

          {/* STEP 1: Event Details */}
          {currentStep === 1 && (
            <Card variant="default" className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary-50 to-blue-50">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-600 text-white text-sm font-bold">
                    1
                  </span>
                  Detalles del Evento
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Información básica sobre tu evento
                </p>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="Nombre del Evento"
                    placeholder="Ej: Concierto de Rock"
                    value={formData.nombre}
                    onChange={(e) => handleInputChange('nombre', e.target.value)}
                    error={errors.nombre}
                    required
                    disabled={loading}
                  />

                  <Select
                    label="Categoría"
                    value={formData.categoria}
                    onChange={(e) => handleInputChange('categoria', e.target.value)}
                    disabled={loadingCategories || loading}
                  >
                    <option value="">
                      {loadingCategories ? 'Cargando...' : 'Selecciona una categoría (opcional)'}
                    </option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </option>
                    ))}
                  </Select>

                  <div className="md:col-span-2">
                    <Textarea
                      label="Descripción"
                      placeholder="Describe tu evento en detalle..."
                      rows={5}
                      value={formData.descripcion}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('descripcion', e.target.value)}
                      error={errors.descripcion}
                      required
                      disabled={loading}
                    />
                  </div>

                  <Input
                    label="Ubicación"
                    placeholder="Ej: Estadio Nacional, Lima"
                    value={formData.ubicacion}
                    onChange={(e) => handleInputChange('ubicacion', e.target.value)}
                    error={errors.ubicacion}
                    required
                    disabled={loading}
                  />

                  <Input
                    label="Capacidad Total"
                    type="number"
                    min="1"
                    placeholder="Ej: 1000"
                    value={formData.capacidad}
                    onChange={(e) => handleInputChange('capacidad', e.target.value)}
                    error={errors.capacidad}
                    required
                    disabled={loading}
                  />

                  <Input
                    label="Fecha y Hora de Inicio"
                    type="datetime-local"
                    value={formData.fechaInicio}
                    onChange={(e) => handleInputChange('fechaInicio', e.target.value)}
                    error={errors.fechaInicio}
                    required
                    disabled={loading}
                  />

                  <Input
                    label="Fecha y Hora de Fin"
                    type="datetime-local"
                    value={formData.fechaFin}
                    onChange={(e) => handleInputChange('fechaFin', e.target.value)}
                    error={errors.fechaFin}
                    required
                    disabled={loading}
                  />
                </div>

                {/* Sección de Imagen Principal */}
                <div className="md:col-span-2 mt-6">
                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Imagen del Evento</h3>
          
                    <div className="max-w-md">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white hover:border-primary-400 transition-colors">
                        <label className="mb-2 block text-sm font-semibold text-gray-800">
                          📸 Imagen Principal
                        </label>
                        
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImagenPrincipalChange(e.target.files ? e.target.files[0] : null)}
                          disabled={loading}
                          className="mb-2"
                        />
                        
                        <p className="text-xs text-gray-500 mt-1">
                          💡 Imagen destacada que se mostrará en la portada del evento
                        </p>
                        
                        {/* Vista Previa de la Imagen Principal */}
                        {previewUrl ? (
                          <div className="mt-3 relative group">
                            <img 
                              src={previewUrl} 
                              alt="Vista previa" 
                              className="w-full h-48 object-cover rounded-lg shadow-sm"
                              onError={(e) => {
                                e.currentTarget.src = 'https://placehold.co/400x300/f87171/white?text=Error+de+Carga'
                                e.currentTarget.onerror = null
                              }}
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleImagenPrincipalChange(null)}
                              disabled={loading}
                              type="button"
                              className="absolute top-2 right-2 bg-red-500 text-white hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              ✕
                            </Button>
                          </div>
                        ) : (
                          <div className="mt-3 flex items-center justify-center h-48 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="text-center text-gray-400">
                              <svg className="mx-auto h-12 w-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <p className="text-sm">No hay imagen seleccionada</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-4 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={() => router.back()}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={handleNextStep}
                    disabled={loading}
                  >
                    Siguiente: Tipos de Entrada
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* STEP 2: Ticket Types */}
          {currentStep === 2 && (
            <Card variant="default" className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-primary-50 to-blue-50">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-600 text-white text-sm font-bold">
                    2
                  </span>
                  Tipos de Entrada
                </CardTitle>
                <p className="text-gray-600 mt-2">
                  Configura los diferentes tipos de entradas y sus precios
                </p>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Capacity Summary */}
                <div
                  className={`p-5 rounded-xl border-2 transition-all ${
                    remainingCapacity < 0
                      ? 'bg-red-50 border-red-300'
                      : remainingCapacity === 0
                      ? 'bg-green-50 border-green-300'
                      : 'bg-blue-50 border-blue-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between gap-3 text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700">📊 Capacidad Total:</span>
                      <span className="font-bold text-gray-900">{totalEventCapacity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700">🎟️ Asignado:</span>
                      <span className="font-bold text-gray-900">{totalTicketsCapacity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-700">✨ Disponible:</span>
                      <span
                        className={`font-bold ${
                          remainingCapacity < 0
                            ? 'text-red-600'
                            : remainingCapacity === 0
                            ? 'text-green-600'
                            : 'text-blue-600'
                        }`}
                      >
                        {remainingCapacity}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ticket Types Manager */}
                <TicketTypeManager
                  ticketTypes={ticketTypes}
                  onChange={setTicketTypes}
                  errors={errors}
                />

                <div className="flex justify-between gap-4 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    onClick={handlePreviousStep}
                    disabled={loading}
                  >
                    Atrás
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleSubmit}
                    loading={loading}
                    disabled={loading || ticketTypes.length === 0}
                  >
                    {loading ? 'Creando Evento...' : 'Crear Evento'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </Container>
      </main>
    </div>
  )
}