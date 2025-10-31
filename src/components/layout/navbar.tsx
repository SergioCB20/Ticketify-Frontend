import React from 'react'
import Link from 'next/link'
import { cn } from '../../lib/utils'
import { Button } from '../ui/button'
import { Avatar } from '../ui/avatar'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

interface NavbarProps {
  className?: string
}

/**
 * Navbar Component
 * Barra de navegación principal con logo, links y autenticación
 */
const Navbar: React.FC<NavbarProps> = ({ 
  className 
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const router = useRouter();

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/events', label: 'Eventos' },
    { href: '/about', label: 'Nosotros' },
    { href: '/contact', label: 'Contacto' },
  ]

  const { user, logout } = useAuth();

  const onLogin = () => {
    router.push('/login');
  }

  const onRegister = () => {
    router.push('/register');
  }

  return (
    <nav className={cn('sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm', className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 transition-transform group-hover:scale-105">
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
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
              Ticketify
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-primary-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="hidden md:flex items-center space-x-3">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    {user.firstName} {user.lastName.slice(0, 1)}
                  </span>
                  <button
                    onClick={logout}
                    className="text-xs text-gray-500 hover:text-primary-600 text-left"
                  >
                    Cerrar sesión
                  </button>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" size="md" onClick={onLogin}>
                  Iniciar sesión
                </Button>
                <Button variant="primary" size="md" onClick={onRegister}>
                  Registrarse
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Abrir menú</span>
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-slide-down">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-base font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-primary-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="pt-4 border-t border-gray-200">
                {user ? (
                  <div className="px-4 space-y-3">
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName.slice(0, 1)}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="md"
                      fullWidth
                      onClick={() => {
                        logout()
                        setMobileMenuOpen(false)
                      }}
                    >
                      Cerrar sesión
                    </Button>
                  </div>
                ) : (
                  <div className="px-4 space-y-2">
                    <Button
                      variant="outline"
                      size="md"
                      fullWidth
                      onClick={() => {
                        onLogin?.()
                        setMobileMenuOpen(false)
                      }}
                    >
                      Iniciar sesión
                    </Button>
                    <Button
                      variant="primary"
                      size="md"
                      fullWidth
                      onClick={() => {
                        onLogin?.()
                        setMobileMenuOpen(false)
                      }}
                    >
                      Registrarse
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

Navbar.displayName = 'Navbar'

export { Navbar }
export type { NavbarProps }
