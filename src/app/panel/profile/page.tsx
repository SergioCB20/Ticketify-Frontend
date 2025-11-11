'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
// Componentes UI básicos
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input } from '@/components/ui'
// Dialog se importa por separado
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { AuthService } from '@/services/api/auth'
import { MercadoPagoService, type MercadoPagoStatus } from '@/services/api/mercadopago'
import { StorageService } from '@/services/storage'
import { AlertTriangle, Calendar, Camera, CheckCircle2, CreditCard, Edit2, Eye, EyeOff, FileText, Link2, Loader2, Mail, MapPin, Phone, Save, Shield, Unlink, User, X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { user, loading, isAuthenticated, updateUser } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  // MercadoPago states
  const [mpStatus, setMpStatus] = useState<MercadoPagoStatus | null>(null)
  const [mpLoading, setMpLoading] = useState(true)
  const [showDisconnectDialog, setShowDisconnectDialog] = useState(false)
  const [isDisconnecting, setIsDisconnecting] = useState(false)

  // Form states
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    country: '',
    city: '',
    gender: ''
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login')
    }
  }, [loading, isAuthenticated, router])

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        country: user.country || '',
        city: user.city || '',
        gender: user.gender || ''
      })
      setPreviewImage(user.profilePhoto || null)
    }
  }, [user])

  // Cargar estado de MercadoPago
  useEffect(() => {
    const loadMercadoPagoStatus = async () => {
      try {
        const status = await MercadoPagoService.getStatus()
        setMpStatus(status)
      } catch (error) {
        console.error('Error loading MercadoPago status:', error)
      } finally {
        setMpLoading(false)
      }
    }

    if (isAuthenticated) {
      loadMercadoPagoStatus()
    }
  }, [isAuthenticated])

  // Manejar resultado del callback de MercadoPago
  useEffect(() => {
    const mpResult = searchParams.get('mp')
    const mpEmail = searchParams.get('email')
    const mpReason = searchParams.get('reason')

    // Solo procesar si hay parámetros de MP
    if (!mpResult) return

    // Flag para evitar ejecución duplicada (React 18 StrictMode)
    let hasShownToast = false

    if (!hasShownToast) {
      if (mpResult === 'success') {
        toast.success(`¡Cuenta de MercadoPago vinculada exitosamente! ${mpEmail ? `(${mpEmail})` : ''}`, {
          duration: 5000,
          icon: '🎉',
          id: 'mp-success' // ID único para evitar duplicados
        })
        // Recargar estado de MercadoPago
        MercadoPagoService.getStatus().then(setMpStatus)
      } else if (mpResult === 'error') {
        const errorMessages: Record<string, string> = {
          'invalid_state': 'Error en el proceso de autorización. Por favor, intenta nuevamente.',
          'already_connected': 'Ya tienes una cuenta de MercadoPago vinculada. Desvincúlala primero si deseas vincular otra.',
          'account_already_linked': 'Esta cuenta de MercadoPago ya está vinculada a otro usuario. Por favor, usa otra cuenta.',
          'unknown': 'Ocurrió un error inesperado. Por favor, intenta nuevamente.'
        }
        toast.error(errorMessages[mpReason || 'unknown'] || 'Error al vincular cuenta de MercadoPago', {
          duration: 6000,
          id: 'mp-error' // ID único para evitar duplicados
        })
      }
      hasShownToast = true
    }
    
    // Limpiar parámetros de URL después de un breve delay
    const timer = setTimeout(() => {
      router.replace('/panel/profile')
    }, 100)

    return () => clearTimeout(timer)
  }, [searchParams, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Cargando...</div>
      </div>
    )
  }

  if (!user) return null

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0]
  if (!file) return

  if (!file.type.startsWith('image/')) {
    toast.error('Solo se permiten imágenes')
    return
  }

  // Crear un canvas para redimensionar/comprimir
  const img = new Image()
  img.src = URL.createObjectURL(file)
  img.onload = () => {
    const canvas = document.createElement('canvas')
    const maxSize = 256 // ancho y alto máximo
    let width = img.width
    let height = img.height

    if (width > height) {
      if (width > maxSize) {
        height = Math.round((height * maxSize) / width)
        width = maxSize
      }
    } else {
      if (height > maxSize) {
        width = Math.round((width * maxSize) / height)
        height = maxSize
      }
    }

    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')
    ctx?.drawImage(img, 0, 0, width, height)

    // Convertir a base64 con calidad reducida y formato WebP
    const compressedBase64 = canvas.toDataURL('image/webp', 0.6) // calidad 60%
    setPreviewImage(compressedBase64)
    toast.success('Imagen comprimida lista (pendiente de guardar)')
  }
}
  const handleSaveProfile = async () => {
    // Validaciones
    if (!formData.firstName.trim() || formData.firstName.length < 2) {
      toast.error('El nombre debe tener al menos 2 caracteres')
      return
    }

    if (!formData.lastName.trim() || formData.lastName.length < 2) {
      toast.error('El apellido debe tener al menos 2 caracteres')
      return
    }

    if (!formData.email.trim()) {
      toast.error('El email es requerido')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Ingresa un email válido')
      return
    }

    if (formData.phoneNumber && formData.phoneNumber.trim()) {
      const phoneRegex = /^[+]?[0-9\s-]{8,20}$/
      if (!phoneRegex.test(formData.phoneNumber)) {
        toast.error('Ingresa un número de teléfono válido')
        return
      }
    }

    setIsSaving(true)
    try {
      const dataToUpdate: any = { ...formData }
      if (previewImage && previewImage !== user.profilePhoto) {
        dataToUpdate.profilePhoto = previewImage
      }
      
      const updatedUser = await AuthService.updateProfile(dataToUpdate)
      updateUser(updatedUser)
      toast.success('Perfil actualizado correctamente')
      setIsEditing(false)
    } catch (error: any) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Error al actualizar el perfil'
      toast.error(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Las contraseñas no coinciden')
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres')
      return
    }

    const hasUpper = /[A-Z]/.test(passwordData.newPassword)
    const hasLower = /[a-z]/.test(passwordData.newPassword)
    const hasNumber = /[0-9]/.test(passwordData.newPassword)

    if (!hasUpper || !hasLower || !hasNumber) {
      toast.error('La contraseña debe contener mayúsculas, minúsculas y números')
      return
    }

    setIsSaving(true)
    try {
      await AuthService.changePassword(passwordData.currentPassword, passwordData.newPassword)
      toast.success('Contraseña cambiada correctamente')
      setIsChangingPassword(false)
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setShowCurrentPassword(false)
      setShowNewPassword(false)
      setShowConfirmPassword(false)
    } catch (error: any) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Error al cambiar la contraseña'
      toast.error(errorMessage)
    } finally {
      setIsSaving(false)
    }
  }

  const handleConnectMercadoPago = () => {
    // Obtener el token de acceso
    const token = StorageService.getAccessToken()
    if (!token) {
      toast.error('No se encontró sesión activa. Por favor, inicia sesión nuevamente.')
      return
    }
    
    // Redirigir a la URL de OAuth (con token en desarrollo)
    const connectUrl = MercadoPagoService.getConnectUrl(token)
    window.location.href = connectUrl
  }

  const handleDisconnectMercadoPago = async () => {
    setIsDisconnecting(true)
    try {
      await MercadoPagoService.disconnect()
      toast.success('Cuenta de MercadoPago desvinculada correctamente')
      // Actualizar estado
      setMpStatus({
        isConnected: false,
        email: null,
        connectedAt: null,
        tokenExpired: null
      })
      setShowDisconnectDialog(false)
    } catch (error: any) {
      const errorMessage = typeof error === 'string' ? error : error?.message || 'Error al desvincular cuenta'
      toast.error(errorMessage)
    } finally {
      setIsDisconnecting(false)
    }
  }

  const getRoleBadge = () => {
    return 'Asistente'
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Mi Perfil</h1>
          <Button variant="outline" onClick={() => router.push('/')}>
            Volver al inicio
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sidebar con foto y info básica */}
          {/* Añadido 'space-y-6' para separar las cards */}
          <div className="lg:col-span-1 space-y-6"> 
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  {/* Avatar grande */}
                  <div className="relative group mb-4">
                    <div className="w-40 h-40 rounded-full overflow-hidden ring-4 ring-primary-100 bg-gradient-to-br from-primary-400 to-secondary-400">
                      {previewImage ? (
                        <img
                          src={previewImage}
                          alt={`${user.firstName} ${user.lastName}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                          {`${user.firstName[0]}${user.lastName[0]}`.toUpperCase()}
                        </div>
                      )}
                    </div>
                    
                    {/* Overlay para cambiar foto (solo en modo edición) */}
                    {isEditing && (
                      <div 
                        className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Camera size={36} className="text-white mb-2" />
                        <span className="text-white text-sm font-medium">Cambiar foto</span>
                      </div>
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>

                  {/* Nombre y rol */}
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {user.firstName} {user.lastName}
                  </h2>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="blue">{getRoleBadge()}</Badge>
                    {user.isActive && (
                      <Badge variant="success">Activo</Badge>
                    )}
                  </div>

                  {/* Botón de editar */}
                  {!isEditing ? (
                    <Button 
                      variant="primary" 
                      size="lg"
                      className="w-full"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit2 size={18} className="mr-2" />
                      Editar Perfil
                    </Button>
                  ) : (
                    <div className="w-full space-y-2">
                      <Button 
                        variant="primary" 
                        size="lg"
                        className="w-full"
                        onClick={handleSaveProfile}
                        disabled={isSaving}
                      >
                        <Save size={18} className="mr-2" />
                        {isSaving ? 'Guardando...' : 'Guardar'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="lg"
                        className="w-full"
                        onClick={() => {
                          setIsEditing(false)
                          setFormData({
                            firstName: user.firstName || '',
                            lastName: user.lastName || '',
                            email: user.email || '',
                            phoneNumber: user.phoneNumber || '',
                            country: user.country || '',
                            city: user.city || '',
                            gender: user.gender || ''
                          })
                          setPreviewImage(user.profilePhoto || null)
                        }}
                        disabled={isSaving}
                      >
                        <X size={18} className="mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  )} 
                </div>
              </CardContent>
            </Card>

          </div> {/* Este </div> AHORA CIERRA la columna izquierda correctamente */}
              
          {/* Contenido principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información Personal */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Información Personal</CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nombre <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        placeholder="Nombre"
                        required
                      />
                      {formData.firstName.trim() && formData.firstName.length < 2 && (
                        <p className="text-xs text-red-500 mt-1">Mínimo 2 caracteres</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Apellido <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        placeholder="Apellido"
                        required
                      />
                      {formData.lastName.trim() && formData.lastName.length < 2 && (
                        <p className="text-xs text-red-500 mt-1">Mínimo 2 caracteres</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="correo@ejemplo.com"
                        required
                      />
                      <p className="text-xs text-gray-500 mt-1">El email debe ser único en el sistema</p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Teléfono
                      </label>
                      <Input
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="+51 999 999 999"
                      />
                      {formData.phoneNumber && formData.phoneNumber.trim() && !/^[+]?[0-9\s-]{8,20}$/.test(formData.phoneNumber) && (
                        <p className="text-xs text-red-500 mt-1">Formato de teléfono inválido</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        País
                      </label>
                      <Input
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        placeholder="Perú"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Ciudad
                      </label>
                      <Input
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="Lima"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Género
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                      >
                        <option value="">Seleccionar</option>
                        <option value="masculino">Masculino</option>
                        <option value="femenino">Femenino</option>
                        <option value="otro">Otro</option>
                        <option value="prefiero-no-decir">Prefiero no decir</option>
                      </select>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-primary-100 rounded-lg">
                        <Mail size={24} className="text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
                        <p className="font-semibold text-gray-900 break-all">{user.email}</p>
                      </div>
                    </div>
                    
                    {user.phoneNumber && (
                      <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="p-2 bg-secondary-100 rounded-lg">
                          <Phone size={24} className="text-secondary-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">Teléfono</p>
                          <p className="font-semibold text-gray-900">{user.phoneNumber}</p>
                        </div>
                      </div>
                    )}

                    {(user.country || user.city) && (
                      <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <MapPin size={24} className="text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">Ubicación</p>
                          <p className="font-semibold text-gray-900">
                            {user.city && user.country 
                              ? `${user.city}, ${user.country}`
                              : user.city || user.country}
                          </p>
                        </div>
                      </div>
                    )}

                    {user.gender && (
                      <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <User size={24} className="text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">Género</p>
                          <p className="font-semibold text-gray-900 capitalize">{user.gender.replace('-', ' ')}</p>
                        </div>
                      </div>
                    )}

                    {user.documentType && user.documentId && (
                      <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <FileText size={24} className="text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 mb-1">Documento de identidad</p>
                          <p className="font-semibold text-gray-900">{user.documentType}: {user.documentId}</p>
                          <p className="text-xs text-gray-500 mt-1">No editable por seguridad</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Calendar size={24} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-1">Miembro desde</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(user.createdAt).toLocaleDateString('es-ES', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Seguridad */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl">Seguridad</CardTitle>
                    <p className="text-gray-500 mt-1">Gestiona la seguridad de tu cuenta</p>
                  </div>
                  {!isChangingPassword && (
                    <Button 
                      variant="primary" 
                      size="lg"
                      onClick={() => setIsChangingPassword(true)}
                    >
                      <Shield size={18} className="mr-2" />
                      Cambiar contraseña
                    </Button>
                  )}
                </div>
              </CardHeader>
              {isChangingPassword && (
                <CardContent className="pt-6">
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Contraseña actual <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Input
                          type={showCurrentPassword ? 'text' : 'password'}
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          placeholder="Ingresa tu contraseña actual"
                          className="pr-12"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nueva contraseña <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Input
                          type={showNewPassword ? 'text' : 'password'}
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          placeholder="Mínimo 8 caracteres"
                          className="pr-12"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Debe contener mayúsculas, minúsculas y números
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Confirmar nueva contraseña <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Input
                          type={showConfirmPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          placeholder="Repite la nueva contraseña"
                          className="pr-12"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-6 border-t">
                      <Button 
                        variant="primary" 
                        size="lg"
                        onClick={handleChangePassword}
                        disabled={isSaving}
                      >
                        <Save size={18} className="mr-2" />
                        {isSaving ? 'Guardando...' : 'Cambiar contraseña'}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="lg"
                        onClick={() => {
                          setIsChangingPassword(false)
                          setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
                          setShowCurrentPassword(false)
                          setShowNewPassword(false)
                          setShowConfirmPassword(false)
                        }}
                        disabled={isSaving}
                      >
                        <X size={18} className="mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* MercadoPago */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl flex items-center gap-2">
                      <CreditCard size={24} className="text-blue-500" />
                      Cuenta de MercadoPago
                    </CardTitle>
                    <p className="text-gray-500 mt-1 text-sm">
                      Vincula tu cuenta para recibir/enviar pagos
                    </p>
                  </div>
                  <img 
                    src="/images/MercadoPagoLogo.png" 
                    alt="MercadoPago" 
                    className="h-12 w-auto object-contain shrink-0"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {mpLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="animate-spin text-primary-600" size={32} />
                  </div>
                ) : mpStatus?.isConnected ? (
                  // Cuenta conectada
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-5 bg-green-50 border border-green-200 rounded-lg">
                      <div className="p-2 bg-green-100 rounded-lg shrink-0">
                        <CheckCircle2 size={24} className="text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-green-900 mb-1">
                          Cuenta vinculada
                        </p>
                        <p className="text-sm text-green-700 break-all">
                          <strong>Email:</strong> {mpStatus.email}
                        </p>
                        {mpStatus.connectedAt && (
                          <p className="text-xs text-green-600 mt-1">
                            Vinculada el {new Date(mpStatus.connectedAt).toLocaleDateString('es-ES', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        )}
                        {mpStatus.tokenExpired && (
                          <div className="mt-3 flex items-center gap-2 text-amber-700">
                            <AlertTriangle size={16} />
                            <span className="text-xs">
                              Tu token ha expirado. Vuelve a vincular tu cuenta.
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                      onClick={() => setShowDisconnectDialog(true)}
                    >
                      <Unlink size={18} className="mr-2" />
                      Desvincular cuenta
                    </Button>
                  </div>
                ) : (
                  // Sin cuenta vinculada
                  <div className="space-y-4">
                    <div className="flex items-start gap-4 p-5 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="p-2 bg-blue-100 rounded-lg shrink-0">
                        <CreditCard size={24} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-900 mb-2">
                          ¿Por qué vincular tu cuenta?
                        </p>
                        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                          <li>Recibe pagos de forma segura</li>
                          <li>Gestiona tus ventas desde MercadoPago</li>
                          <li>Procesa pagos con tarjeta, transferencia y más</li>
                        </ul>
                      </div>
                    </div>

                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full bg-blue-500 hover:bg-blue-600"
                      onClick={handleConnectMercadoPago}
                    >
                      <Link2 size={18} className="mr-2" />
                      Vincular cuenta de MercadoPago
                    </Button>

                    <div className="space-y-2">
                      <p className="text-xs text-center text-gray-500">
                        Serás redirigido a MercadoPago para autorizar la conexión de forma segura
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Modal de confirmación para desvincular */}
      <Dialog open={showDisconnectDialog} onOpenChange={setShowDisconnectDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle size={24} className="text-red-600" />
              </div>
              <DialogTitle className="text-xl">¿Estás seguro?</DialogTitle>
            </div>
            <DialogDescription className="text-base pt-2">
              Estás a punto de desvincular tu cuenta de MercadoPago.
              <br />
              <br />
              <strong className="text-gray-900">Esto significa que:</strong>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li>No podrás recibir/enviar pagos</li>
                <li>Deberás volver a vincular tu cuenta para activar pagos</li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowDisconnectDialog(false)}
              disabled={isDisconnecting}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              className="bg-red-600 hover:bg-red-700"
              onClick={handleDisconnectMercadoPago}
              disabled={isDisconnecting}
            >
              {isDisconnecting ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={18} />
                  Desvinculando...
                </>
              ) : (
                <>
                  <Unlink size={18} className="mr-2" />
                  Sí, desvincular
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
