'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
// Añadido 'CardDescription' aquí
import { Card, CardContent, CardHeader, CardTitle, CardDescription, Button, Badge, Avatar, Input } from '@/components/ui' 
import { User, Mail, Phone, Calendar, Shield, MapPin, FileText, Edit2, Save, X, Eye, EyeOff, Camera } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { AuthService } from '@/services/api/auth'
import toast from 'react-hot-toast'
import { Loader2, Ticket } from 'lucide-react' 
import Link from 'next/link'

export default function ProfilePage() {
  const { user, loading, isAuthenticated, updateUser } = useAuth()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null)

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La imagen no debe superar los 5MB')
        return
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Solo se permiten imágenes')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
      toast.success('Imagen cargada (pendiente de guardar)')
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

  const getRoleBadge = () => {
    return 'Asistente'
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

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

            {/* --- BLOQUE REUBICADO Y CORREGIDO --- */}
            {/* Card de Navegación */}
            <Card>
              <CardHeader>
                <CardTitle>Navegación</CardTitle>
                <CardDescription>
                  Accede a otras secciones de tu perfil.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full justify-start text-base">
                  <Link href="/profile/tickets">
                    <Ticket className="w-4 h-4 mr-2" />
                    Mis Tickets
                  </Link>
                </Button>
                {/* (Puedes añadir más botones aquí en el futuro) */}
              </CardContent>
            </Card>
            {/* --- FIN DEL BLOQUE CORREGIDO --- */}

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
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}