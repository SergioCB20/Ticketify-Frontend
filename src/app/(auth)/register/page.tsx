'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff, ArrowRight, ArrowLeft, User, Building } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter, useSearchParams } from 'next/navigation'
import type { ApiError } from '@/lib/types'

type UserType = 'ATTENDEE' | 'ORGANIZER' | null

type DocumentType = 'DNI' | 'CE' | 'Pasaporte'
type Gender = 'masculino' | 'femenino' | 'otro' | 'prefiero-no-decir'

export default function RegisterPage() {
  // Estados del formulario
  const [step, setStep] = useState(1) // 1: Datos personales, 2: Tipo de usuario
  const [userType, setUserType] = useState<UserType>(null)
  
  // Datos personales (Step 1)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [documentType, setDocumentType] = useState<DocumentType>('DNI')
  const [documentId, setDocumentId] = useState('')
  const [country, setCountry] = useState('Perú')
  const [city, setCity] = useState('')
  const [gender, setGender] = useState<Gender>('prefiero-no-decir')
  
  // UI states
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [acceptMarketing, setAcceptMarketing] = useState(false)
  
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [apiError, setApiError] = useState<string | null>(null)
  
  const { register: registerUser } = useAuth()
  const router = useRouter()

  // Validación de la primera sección
  const validateStep1 = () => {
    const newErrors: {[key: string]: string} = {}
    
    // Email
    if (!email.trim()) newErrors.email = 'El email es requerido'
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email inválido'
    
    // Password
    if (!password) {
      newErrors.password = 'La contraseña es requerida'
    } else if (password.length < 8) {
      newErrors.password = 'Mínimo 8 caracteres'
    } else {
      const hasUpper = /[A-Z]/.test(password)
      const hasLower = /[a-z]/.test(password)
      const hasDigit = /[0-9]/.test(password)
      
      if (!hasUpper || !hasLower || !hasDigit) {
        newErrors.password = 'Debe contener mayúscula, minúscula y número'
      }
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }
    
    // Nombres
    if (!firstName.trim()) newErrors.firstName = 'El nombre es requerido'
    if (!lastName.trim()) newErrors.lastName = 'El apellido es requerido'
    
    // Documento
    if (!documentId.trim()) {
      newErrors.documentId = 'El número de documento es requerido'
    } else if (documentType === 'DNI') {
      if (!/^\d{8}$/.test(documentId)) {
        newErrors.documentId = 'El DNI debe tener 8 dígitos'
      }
    }
    
    // Ubicación
    if (!country.trim()) newErrors.country = 'El país es requerido'
    if (!city.trim()) newErrors.city = 'La ciudad es requerida'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Validación de la segunda sección
  const validateStep2 = () => {
    const newErrors: {[key: string]: string} = {}
    
    if (!userType) newErrors.userType = 'Selecciona un tipo de usuario'
    if (!acceptTerms) newErrors.acceptTerms = 'Debes aceptar los términos y condiciones'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateStep2()) return
    
    setLoading(true)
    setApiError(null)
    
    try {
      // Datos según el schema del backend
      const userData = {
        email,
        password,
        firstName,
        lastName,
        userType: userType as 'ATTENDEE' | 'ORGANIZER',
        phoneNumber: phoneNumber || undefined,
        documentType,
        documentId,
        country,
        city,
        gender,
        acceptTerms,
        acceptMarketing,
      }
      
      console.log('Register data:', userData)
      
      // Llamar al servicio de registro
      await registerUser(userData)
      
      // Redirigir al home después del registro exitoso
      router.push('/')
      
    } catch (error) {
      const err = error as ApiError
      setApiError(err.message || 'Error al registrar usuario. Intenta nuevamente.')
      console.error('Register error:', error)
      
      // Volver al step 1 si hay errores de validación del backend
      if (err.status === 400) {
        setStep(1)
      }
    } finally {
      setLoading(false)
    }
  }

  const searchParams = useSearchParams();
  const [showGoogleMessage, setShowGoogleMessage] = useState(false);

  useEffect(() => {
    const error = searchParams.get('error');
    if (error === 'not-registered') {
      // Rellena los campos con los datos de Google
      setEmail(searchParams.get('email') || '');
      setFirstName(searchParams.get('firstName') || '');
      setLastName(searchParams.get('lastName') || '');
      // Muestra un mensaje amigable
      setShowGoogleMessage(true);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex">
      {/* Lado izquierdo - Banner fijo */}
      <div className="hidden lg:block lg:w-1/2 fixed left-0 top-0 h-screen">
        <Image
          src="/images/Banner-Register.jpg"
          alt="Banner de Registro"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Lado derecho - Formulario de Registro con scroll */}
      <div className="w-full lg:w-1/2 lg:ml-[50%] min-h-screen flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md py-8">
          {/* Logo/Avatar */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-violet-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              TK
            </div>
          </div>

          {/* Título */}
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Únete a Ticketify
          </h2>

          {/* Link a login */}
          <p className="text-center text-gray-600 mb-8">
            ¿Ya tienes cuenta?{' '}
            <Link 
              href="/login" 
              className="text-violet-500 font-semibold hover:text-violet-600 transition-colors"
            >
              Inicia sesión
            </Link>
          </p>

          {/* Error message */}
          {apiError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{apiError}</p>
            </div>
          )}

          {/* Indicador de progreso */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className={`h-2 w-20 rounded-full transition-all duration-300 ${step === 1 ? 'bg-violet-500' : 'bg-violet-200'}`} />
            <div className={`h-2 w-20 rounded-full transition-all duration-300 ${step === 2 ? 'bg-violet-500' : 'bg-gray-200'}`} />
          </div>

          {/* Sección 1: Datos Personales */}
          {step === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); handleNextStep(); }} className="space-y-5">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Datos Personales</h3>
                <p className="text-sm text-gray-500 mt-1">Información básica para tu cuenta</p>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Correo electrónico *
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tucorreo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={errors.email}
                  className="h-11 rounded-lg"
                />
              </div>

              {/* Nombres */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Juan"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    error={errors.firstName}
                    className="h-11 rounded-lg"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido *
                  </label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Pérez"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    error={errors.lastName}
                    className="h-11 rounded-lg"
                  />
                </div>
              </div>

              {/* Contraseñas */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña *
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Mínimo 8 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={errors.password}
                    className="h-11 rounded-lg pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar contraseña *
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Repite tu contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    error={errors.confirmPassword}
                    className="h-11 rounded-lg pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Documento */}
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo *
                  </label>
                  <select
                    id="documentType"
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value as DocumentType)}
                    className="h-11 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                  >
                    <option value="DNI">DNI</option>
                    <option value="CE">CE</option>
                    <option value="Pasaporte">Pasaporte</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label htmlFor="documentId" className="block text-sm font-medium text-gray-700 mb-2">
                    Número *
                  </label>
                  <Input
                    id="documentId"
                    type="text"
                    placeholder={documentType === 'DNI' ? '12345678' : 'Número de documento'}
                    value={documentId}
                    onChange={(e) => setDocumentId(e.target.value)}
                    error={errors.documentId}
                    className="h-11 rounded-lg"
                  />
                </div>
              </div>

              {/* Teléfono (opcional) */}
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono (opcional)
                </label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+51 999 999 999"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="h-11 rounded-lg"
                />
              </div>

              {/* Ubicación */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                    País *
                  </label>
                  <Input
                    id="country"
                    type="text"
                    placeholder="Perú"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    error={errors.country}
                    className="h-11 rounded-lg"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad *
                  </label>
                  <Input
                    id="city"
                    type="text"
                    placeholder="Lima"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    error={errors.city}
                    className="h-11 rounded-lg"
                  />
                </div>
              </div>

              {/* Género */}
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                  Género *
                </label>
                <select
                  id="gender"
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="h-11 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-violet-500 focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                >
                  <option value="masculino">Masculino</option>
                  <option value="femenino">Femenino</option>
                  <option value="otro">Otro</option>
                  <option value="prefiero-no-decir">Prefiero no decir</option>
                </select>
              </div>

              {/* Botón siguiente */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                className="h-12 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 mt-6"
              >
                Siguiente
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </form>
          )}

          {/* Sección 2: Tipo de Usuario */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-800">Tipo de Usuario</h3>
                <p className="text-sm text-gray-500 mt-1">¿Cómo usarás Ticketify?</p>
              </div>

              {/* Selección de tipo de usuario */}
              <div className="space-y-4">
                {/* Usuario Individual (ATTENDEE) */}
                <button
                  type="button"
                  onClick={() => setUserType('ATTENDEE')}
                  className={`w-full p-6 rounded-xl border-2 transition-all duration-200 ${
                    userType === 'ATTENDEE'
                      ? 'border-violet-500 bg-violet-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full ${
                      userType === 'ATTENDEE' ? 'bg-violet-500' : 'bg-gray-200'
                    }`}>
                      <User className={`w-6 h-6 ${
                        userType === 'ATTENDEE' ? 'text-white' : 'text-gray-500'
                      }`} />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="font-semibold text-gray-900 mb-1">Asistente</h4>
                      <p className="text-sm text-gray-600">
                        Compra tickets, descubre eventos y disfruta de experiencias únicas
                      </p>
                    </div>
                  </div>
                </button>

                {/* Organizador de Eventos (ORGANIZER) */}
                <button
                  type="button"
                  onClick={() => setUserType('ORGANIZER')}
                  className={`w-full p-6 rounded-xl border-2 transition-all duration-200 ${
                    userType === 'ORGANIZER'
                      ? 'border-violet-500 bg-violet-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-full ${
                      userType === 'ORGANIZER' ? 'bg-violet-500' : 'bg-gray-200'
                    }`}>
                      <Building className={`w-6 h-6 ${
                        userType === 'ORGANIZER' ? 'text-white' : 'text-gray-500'
                      }`} />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="font-semibold text-gray-900 mb-1">Organizador</h4>
                      <p className="text-sm text-gray-600">
                        Crea, gestiona y vende tickets para tus eventos
                      </p>
                    </div>
                  </div>
                </button>
              </div>

              {errors.userType && (
                <p className="text-sm text-red-600">{errors.userType}</p>
              )}

              {/* Términos y condiciones */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-violet-500 focus:ring-violet-500"
                  />
                  <label htmlFor="acceptTerms" className="text-sm text-gray-700">
                    Acepto los{' '}
                    <Link href="/terms" className="text-violet-500 hover:text-violet-600 font-medium">
                      Términos y Condiciones
                    </Link>
                    {' y la '}
                    <Link href="/privacy" className="text-violet-500 hover:text-violet-600 font-medium">
                      Política de Privacidad
                    </Link>
                  </label>
                </div>
                {errors.acceptTerms && (
                  <p className="text-sm text-red-600 ml-7">{errors.acceptTerms}</p>
                )}

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="acceptMarketing"
                    checked={acceptMarketing}
                    onChange={(e) => setAcceptMarketing(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-violet-500 focus:ring-violet-500"
                  />
                  <label htmlFor="acceptMarketing" className="text-sm text-gray-600">
                    Acepto recibir información sobre eventos y promociones
                  </label>
                </div>
              </div>

              {/* Botones de navegación */}
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={() => setStep(1)}
                  className="h-12 text-lg font-semibold rounded-xl"
                  disabled={loading}
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Atrás
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={loading}
                  className="h-12 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Crear cuenta
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
