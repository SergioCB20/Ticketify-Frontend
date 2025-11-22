'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import type { ApiError } from '@/lib/types'
import { Shield, AlertCircle } from 'lucide-react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    
    try {
      const response = await login({ email, password })

      // Log detallado para debugging
      console.log('=== ADMIN LOGIN DEBUG ===')
      console.log('Response completo:', response)
      console.log('Usuario:', response.user)
      console.log('Roles del usuario:', response.user.roles)
      console.log('Tipo de roles:', typeof response.user.roles)
      console.log('Es array?:', Array.isArray(response.user.roles))

      // Verificar que tenga rol de admin
      const adminRoles = ['SUPER_ADMIN', 'SUPPORT_ADMIN', 'SECURITY_ADMIN', 'CONTENT_ADMIN']
      const userRoles = response.user.roles || []
      console.log('Roles de usuario (con fallback):', userRoles)

      const hasAdminRole = userRoles.some(role => adminRoles.includes(role))
      console.log('Tiene rol de admin?:', hasAdminRole)

      if (!hasAdminRole) {
        console.error('❌ Usuario sin privilegios de admin')
        console.error('Roles esperados:', adminRoles)
        console.error('Roles del usuario:', userRoles)
        setError(`Este usuario no tiene privilegios de administrador. Roles: ${userRoles.join(', ') || 'ninguno'}`)
        setLoading(false)
        return
      }

      console.log('✅ Login de admin exitoso, redirigiendo...')
      // Redirigir al dashboard de admin
      router.push('/admin')
      
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError.message || 'Credenciales inválidas')
      console.error('Admin login error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 via-purple-50 to-violet-100 p-4">
      <div className="w-full max-w-md">
        {/* Card de Login */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-violet-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Título */}
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Panel de Administración
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Acceso exclusivo para administradores
          </p>

          {/* Mensaje de error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Correo Electrónico
              </label>
              <Input
                id="email"
                type="email"
                placeholder="admin@ticketify.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 rounded-lg"
                disabled={loading}
              />
            </div>

            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Contraseña
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 rounded-lg"
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
              className="h-14 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Iniciar Sesión
            </Button>
          </form>

          {/* Mensaje informativo */}
          <div className="mt-6 p-4 bg-violet-50 rounded-lg border border-violet-200">
            <p className="text-sm text-violet-800 text-center">
              <Shield className="w-4 h-4 inline mr-2" />
              Área protegida - Solo administradores autorizados
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
