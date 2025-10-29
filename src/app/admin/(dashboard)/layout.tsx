'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading, isAuthenticated } = useAuth()
  const router = useRouter()
  const [isAdmin, setIsAdmin] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    if (!loading) {
      // Verificar si está autenticado
      if (!isAuthenticated) {
        router.push('/admin/login')
        return
      }

      // Verificar si tiene rol de admin
      const adminRoles = ['SUPER_ADMIN', 'SUPPORT_ADMIN', 'SECURITY_ADMIN', 'CONTENT_ADMIN']
      const hasAdminRole = user?.roles?.some(role => adminRoles.includes(role))

      if (!hasAdminRole) {
        router.push('/admin/login')
        return
      }

      setIsAdmin(true)
      setChecking(false)
    }
  }, [loading, isAuthenticated, user, router])

  if (loading || checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
          <p className="mt-4 text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return <>{children}</>
}
