'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card'

const errorMessages = {
  Configuration: 'Hay un problema con la configuración del servidor.',
  AccessDenied: 'No tienes permisos para acceder a esta aplicación.',
  Verification: 'El token de verificación ha expirado o ya fue usado.',
  Default: 'Ha ocurrido un error inesperado. Inténtalo de nuevo.',
  CredentialsSignin: 'Las credenciales proporcionadas son incorrectas.',
  EmailSignin: 'No se pudo enviar el email de verificación.',
  OAuthSignin: 'Error al iniciar sesión con el proveedor OAuth.',
  OAuthCallback: 'Error en el callback de OAuth.',
  OAuthCreateAccount: 'No se pudo crear la cuenta con OAuth.',
  EmailCreateAccount: 'No se pudo crear la cuenta con email.',
  Callback: 'Error en el callback de autenticación.',
  OAuthAccountNotLinked: 'Esta cuenta ya está vinculada con otro método de inicio de sesión.',
  SessionRequired: 'Debes iniciar sesión para acceder a esta página.',
}

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error') as keyof typeof errorMessages

  useEffect(() => {
    // Log del error para debugging
    if (error) {
      console.error('Auth Error:', error)
    }
  }, [error])

  const errorMessage = errorMessages[error] || errorMessages.Default

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600">
            Error de Autenticación
          </CardTitle>
          <CardDescription>
            {errorMessage}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {error === 'CredentialsSignin' && (
            <div className="rounded-lg bg-yellow-50 p-4 text-sm text-yellow-800">
              <p className="font-medium">Consejos:</p>
              <ul className="mt-1 list-disc list-inside space-y-1">
                <li>Verifica que tu email sea correcto</li>
                <li>Asegúrate de escribir bien tu contraseña</li>
                <li>Si olvidaste tu contraseña, puedes restablecerla</li>
              </ul>
            </div>
          )}

          {error === 'OAuthAccountNotLinked' && (
            <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
              <p>
                Ya existe una cuenta con este email usando un método diferente de inicio de sesión.
                Intenta iniciar sesión con el método que usaste originalmente.
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button asChild className="w-full">
              <Link href="/login">
                Volver al Login
              </Link>
            </Button>
            
            <Button variant="outline" asChild className="w-full">
              <Link href="/">
                Ir al Inicio
              </Link>
            </Button>

            {(error === 'CredentialsSignin') && (
              <Button variant="link" asChild className="w-full">
                <Link href="/forgot-password">
                  ¿Olvidaste tu contraseña?
                </Link>
              </Button>
            )}
          </div>

          {process.env.NODE_ENV === 'development' && error && (
            <div className="mt-4 rounded-lg bg-gray-100 p-3">
              <p className="text-xs font-mono text-gray-600">
                Error Code: {error}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
