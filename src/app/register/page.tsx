'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    country: 'Perú',
    city: '',
    documentType: 'DNI',
    documentNumber: '',
    gender: '',
    acceptTerms: false,
    acceptMarketing: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Validación de contraseña
  const validatePassword = (password: string) => {
    const hasMinLength = password.length >= 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    
    return {
      isValid: hasMinLength && hasUpperCase && hasLowerCase && hasNumber,
      checks: {
        minLength: hasMinLength,
        upperCase: hasUpperCase,
        lowerCase: hasLowerCase,
        number: hasNumber,
      }
    }
  }

  const passwordValidation = validatePassword(formData.password)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))

    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = 'El correo electrónico es requerido'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Ingresa un correo electrónico válido'
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida'
    } else if (!passwordValidation.isValid) {
      newErrors.password = 'La contraseña no cumple los requisitos'
    }

    if (!formData.firstName) {
      newErrors.firstName = 'El nombre es requerido'
    }

    if (!formData.lastName) {
      newErrors.lastName = 'Los apellidos son requeridos'
    }

    if (!formData.city) {
      newErrors.city = 'La ciudad es requerida'
    }

    if (!formData.documentNumber) {
      newErrors.documentNumber = 'El número de documento es requerido'
    }

    if (!formData.gender) {
      newErrors.gender = 'Selecciona una opción'
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Debes aceptar los términos y condiciones'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Aquí iría la llamada al API
      console.log('Registrando usuario:', formData)
      
      // Simular llamada API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Redirigir o mostrar mensaje de éxito
      alert('Registro exitoso!')
    } catch (error) {
      console.error('Error al registrar:', error)
      setErrors({ general: 'Ocurrió un error al registrar. Intenta nuevamente.' })
    } finally {
      setLoading(false)
    }
  }

  const getPasswordStrength = () => {
    if (!formData.password) return 0
    
    const checks = Object.values(passwordValidation.checks).filter(Boolean).length
    return (checks / 4) * 100
  }

  const getPasswordStrengthColor = () => {
    const strength = getPasswordStrength()
    if (strength <= 25) return 'bg-red-500'
    if (strength <= 50) return 'bg-orange-500'
    if (strength <= 75) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <div className="min-h-screen flex">
      {/* Sección izquierda - Hero */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white p-12 flex-col justify-center items-center relative overflow-hidden">
        {/* Decoración de fondo */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="relative z-10 max-w-md text-center">
          <div className="mb-8">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm mb-6">
              <svg
                className="h-10 w-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                />
              </svg>
            </div>
          </div>
          
          <h1 className="text-5xl font-bold mb-6">
            ¡Crea y vende<br />tu evento con IA!
          </h1>
          <p className="text-xl text-white/90 mb-8">
            +800 organizadores venden en Ticketify
          </p>

          {/* Ejemplo de evento visual */}
          <div className="mt-12 bg-white/10 backdrop-blur-md rounded-2xl p-6 text-left">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl h-48 mb-4 flex items-center justify-center">
              <span className="text-6xl">🎸</span>
            </div>
            <p className="text-sm text-white/60 mb-1">06 NOV</p>
            <h3 className="text-lg font-bold">Rock & Soul</h3>
            <p className="text-sm text-white/80">Explanada Plaza Norte</p>
          </div>
        </div>
      </div>

      {/* Sección derecha - Formulario */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                  />
                </svg>
              </div>
            </Link>

            <div className="text-sm text-gray-600">
              ¿Ya tienes una cuenta?{' '}
              <Link href="/login" className="text-primary-600 font-semibold hover:text-primary-700">
                Inicia Sesión
              </Link>
            </div>
          </div>

          {/* Título del formulario */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Regístrate</h2>
            <p className="text-gray-600">Por favor, ingresa tus datos.</p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Correo electrónico
              </label>
              <Input
                type="email"
                name="email"
                placeholder="ejemplo@gmail.com"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
              />
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="••••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Indicador de fortaleza de contraseña */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-2">
                    <div className={`h-1 flex-1 rounded ${getPasswordStrength() >= 25 ? getPasswordStrengthColor() : 'bg-gray-200'}`} />
                    <div className={`h-1 flex-1 rounded ${getPasswordStrength() >= 50 ? getPasswordStrengthColor() : 'bg-gray-200'}`} />
                    <div className={`h-1 flex-1 rounded ${getPasswordStrength() >= 75 ? getPasswordStrengthColor() : 'bg-gray-200'}`} />
                    <div className={`h-1 flex-1 rounded ${getPasswordStrength() === 100 ? getPasswordStrengthColor() : 'bg-gray-200'}`} />
                  </div>
                  <p className="text-xs text-gray-600">
                    {getPasswordStrength() < 50 && '⚠️ Contraseña débil'}
                    {getPasswordStrength() >= 50 && getPasswordStrength() < 100 && '✓ Contraseña aceptable'}
                    {getPasswordStrength() === 100 && '✓ Contraseña fuerte'}
                  </p>
                </div>
              )}
            </div>

            {/* Nombre y Apellidos */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre
                </label>
                <Input
                  type="text"
                  name="firstName"
                  placeholder="Nombre"
                  value={formData.firstName}
                  onChange={handleChange}
                  error={errors.firstName}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apellidos
                </label>
                <Input
                  type="text"
                  name="lastName"
                  placeholder="Apellidos"
                  value={formData.lastName}
                  onChange={handleChange}
                  error={errors.lastName}
                />
              </div>
            </div>

            {/* País y Ciudad */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  País
                </label>
                <Select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                >
                  <option value="Perú">Perú</option>
                  <option value="Argentina">Argentina</option>
                  <option value="Chile">Chile</option>
                  <option value="Colombia">Colombia</option>
                  <option value="México">México</option>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ciudad
                </label>
                <Input
                  type="text"
                  name="city"
                  placeholder="Ciudad"
                  value={formData.city}
                  onChange={handleChange}
                  error={errors.city}
                />
              </div>
            </div>

            {/* Tipo y Número de Documento */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  DNI
                </label>
                <Select
                  name="documentType"
                  value={formData.documentType}
                  onChange={handleChange}
                >
                  <option value="DNI">DNI</option>
                  <option value="CE">CE</option>
                  <option value="Pasaporte">Pasaporte</option>
                </Select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nro. Documento
                </label>
                <Input
                  type="text"
                  name="documentNumber"
                  placeholder="12345678"
                  value={formData.documentNumber}
                  onChange={handleChange}
                  error={errors.documentNumber}
                  maxLength={formData.documentType === 'DNI' ? 8 : undefined}
                />
              </div>
            </div>

            {/* Género */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Género
              </label>
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                error={errors.gender}
              >
                <option value="">Seleccione una opción</option>
                <option value="masculino">Masculino</option>
                <option value="femenino">Femenino</option>
                <option value="otro">Otro</option>
                <option value="prefiero-no-decir">Prefiero no decir</option>
              </Select>
            </div>

            {/* Términos y condiciones */}
            <div className="space-y-3">
              <Checkbox
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                label={
                  <span className="text-sm text-gray-600">
                    Al continuar, acepto los{' '}
                    <Link href="/terms" className="text-primary-600 hover:underline">
                      Términos y Condiciones
                    </Link>{' '}
                    y la{' '}
                    <Link href="/privacy" className="text-primary-600 hover:underline">
                      Política de Privacidad
                    </Link>
                    *
                  </span>
                }
                error={errors.acceptTerms}
              />

              <Checkbox
                name="acceptMarketing"
                checked={formData.acceptMarketing}
                onChange={handleChange}
                label={
                  <span className="text-sm text-gray-600">
                    Doy mi{' '}
                    <span className="font-medium">consentimiento para usos adicionales</span> y
                    disfrutar de los beneficios, promociones y descuentos creados para mí.
                  </span>
                }
              />

              <p className="text-xs text-gray-500">* Campos obligatorios</p>
            </div>

            {/* Error general */}
            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errors.general}</p>
              </div>
            )}

            {/* Botón de submit */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              disabled={loading}
            >
              Continuar
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>¿Necesitas ayuda? <Link href="/support" className="text-primary-600 hover:underline">Contáctanos</Link></p>
          </div>
        </div>
      </div>
    </div>
  )
}
