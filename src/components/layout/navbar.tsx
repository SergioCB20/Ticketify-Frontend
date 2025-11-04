import React from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import { Avatar } from '../ui/avatar'
import { Dropdown, DropdownItem, DropdownDivider } from '../ui/dropdown'
import { User, LogOut, ChevronDown } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { SearchWithFilters } from '../ui/search-with-filters'

interface NavbarProps {
  className?: string
  showSearch?: boolean
  categories?: Array<{ id: string; name: string; icon?: string }>
}

/**
 * Navbar Component
 * Barra de navegación principal con logo, búsqueda avanzada y autenticación
 */
const Navbar: React.FC<NavbarProps> = ({ 
  className,
  showSearch = false,
  categories = []
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const router = useRouter();

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/events', label: 'Eventos' },
    { href: '/marketplace', label: 'Marketplace' },
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

  const handleSearch = (query: string, filters: any) => {
    console.log('Search:', query, filters)
    // Construir parámetros de URL
    const params = new URLSearchParams()
    
    if (query) params.set('q', query)
    if (filters.categories && filters.categories.length > 0) {
      params.set('categories', filters.categories.join(','))
    }
    if (filters.price?.min !== undefined) {
      params.set('minPrice', filters.price.min.toString())
    }
    if (filters.price?.max !== undefined) {
      params.set('maxPrice', filters.price.max.toString())
    }
    if (filters.date?.start) {
      params.set('startDate', filters.date.start)
    }
    if (filters.date?.end) {
      params.set('endDate', filters.date.end)
    }
    if (filters.location) {
      params.set('location', filters.location)
    }
    if (filters.venue) {
      params.set('venue', filters.venue)
    }
    
    router.push(`/events?${params.toString()}`)
  }

  return (
    <nav className={cn('sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm', className)}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group flex-shrink-0">
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
           {/* Search Bar - Desktop */}
          {showSearch && (
            <div className="hidden lg:block flex-1 max-w-2xl mx-8">
              <SearchWithFilters 
                onSearch={handleSearch}
                categories={categories.map(cat => ({
                  label: cat.name,
                  value: cat.id
                }))}
              />
            </div>
          )}
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
                 <Dropdown
                  align="right"
                  trigger={
                    <div className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                      <Avatar
                        src={user.profilePhoto || undefined}
                        alt={`${user.firstName} ${user.lastName}`}
                        fallback={`${user.firstName} ${user.lastName}`}
                        size="md"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {user.email}
                        </span>
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                  }
                >
                  <DropdownItem
                    icon={<User className="w-4 h-4" />}
                    onClick={() => router.push('/panel/profile')}
                  >
                    Mi perfil
                  </DropdownItem>
                  <DropdownDivider />
                  <DropdownItem
                    icon={<LogOut className="w-4 h-4" />}
                    onClick={logout}
                    danger
                  >
                    Cerrar sesión
                  </DropdownItem>
                </Dropdown>
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

         {/* Search Bar - Mobile */}
        {showSearch && (
          <div className="lg:hidden pb-4">
            <SearchWithFilters 
              onSearch={handleSearch}
              categories={categories.map(cat => ({
                label: cat.name,
                value: cat.id
              }))}
            />
          </div>
        )}

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
                        router.push('/profile')
                        setMobileMenuOpen(false)
                      }}
                    >
                      Mi perfil
                    </Button>
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
                        onLogin()
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
