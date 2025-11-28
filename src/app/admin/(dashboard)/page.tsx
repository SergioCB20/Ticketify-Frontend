'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { AdminService } from '@/services/api/admin'
import { AdminCategoriesService } from '@/services/api/adminCategories'
import { UsersTable } from '@/components/admin/UsersTable'
import { AdminsTable } from '@/components/admin/AdminsTable'
import { CategoriesTable } from '@/components/admin/CategoriesTable'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { AdminStats, PaginatedUsers, AdminUser, Category } from '@/lib/types'
import {
  LayoutDashboard,
  Users,
  Shield,
  Search,
  RefreshCw,
  LogOut,
  Menu,
  X,
  FolderOpen
} from 'lucide-react'

function AdminStatsGrid({ stats }: { stats: AdminStats }) {
  const entries = Object.entries(stats as unknown as Record<string, any>)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {entries.map(([key, value]) => (
        <div key={key} className="p-4 bg-white rounded-lg shadow-sm border">
          <p className="text-sm text-gray-500">
            {key.replace(/([A-Z])/g, ' $1')}
          </p>
          <p className="text-2xl font-bold text-gray-900">{String(value)}</p>
        </div>
      ))}
    </div>
  )
}

export default function AdminDashboard() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<PaginatedUsers | null>(null)
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'admins' | 'categories'>('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [filterActive, setFilterActive] = useState<boolean | undefined>(undefined)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    loadData()
  }, [currentPage, searchTerm, filterActive])

  const loadData = async () => {
    setLoading(true)

    // Cargar cada recurso por separado para que los permisos no bloqueen todo
    try {
      const statsData = await AdminService.getStats()
      setStats(statsData)
    } catch (error) {
      console.error('Error loading stats:', error)
    }

    try {
      const usersData = await AdminService.getUsers(currentPage, 8, searchTerm, filterActive)
      setUsers(usersData)
    } catch (error) {
      console.error('Error loading users:', error)
    }

    try {
      const adminsData = await AdminService.getAdmins()
      setAdmins(adminsData)
    } catch (error) {
      console.error('Error loading admins:', error)
    }

    try {
      const categoriesData = await AdminCategoriesService.getCategories()
      setCategories(categoriesData)
    } catch (error) {
      console.error('Error loading categories:', error)
    }

    setLoading(false)
  }

  const handleRefresh = () => {
    loadData()
  }

  const handleLogout = async () => {
    if (confirm('¿Estás seguro de cerrar sesión?')) {
      await logout()
      router.push('/admin/login')
    }
  }

  if (loading && !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500"></div>
          <p className="mt-4 text-gray-600">Cargando panel de administración...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Panel de Administración</h1>
                  <p className="text-xs text-gray-500">Ticketify Admin</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={handleRefresh}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Actualizar"
              >
                <RefreshCw className={`w-5 h-5 text-gray-600 ${loading ? 'animate-spin' : ''}`} />
              </button>

              <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-violet-50 rounded-lg">
                <div className="w-8 h-8 bg-violet-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">
                    {user?.firstName[0]}{user?.lastName[0]}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-gray-500">{user?.roles?.[0] || 'Admin'}</p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 
          transform transition-transform duration-200 ease-in-out z-30
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <nav className="p-4 space-y-2">
            <button
              onClick={() => { setActiveTab('overview'); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'overview'
                  ? 'bg-violet-50 text-violet-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="font-medium">Vista General</span>
            </button>

            <button
              onClick={() => { setActiveTab('users'); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'users'
                  ? 'bg-violet-50 text-violet-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Users className="w-5 h-5" />
              <span className="font-medium">Usuarios</span>
              {users && (
                <span className="ml-auto bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                  {users.total}
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('admins'); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'admins'
                  ? 'bg-violet-50 text-violet-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Shield className="w-5 h-5" />
              <span className="font-medium">Administradores</span>
              {admins && (
                <span className="ml-auto bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                  {admins.length}
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('categories'); setSidebarOpen(false) }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'categories'
                  ? 'bg-violet-50 text-violet-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <FolderOpen className="w-5 h-5" />
              <span className="font-medium">Categorías</span>
              {categories && (
                <span className="ml-auto bg-gray-200 text-gray-700 text-xs px-2 py-0.5 rounded-full">
                  {categories.length}
                </span>
              )}
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Vista General */}
          {activeTab === 'overview' && stats && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Vista General</h2>
                <p className="text-gray-600">Estadísticas y métricas del sistema</p>
              </div>
              <AdminStatsGrid stats={stats} />
            </div>
          )}

          {/* Usuarios */}
          {activeTab === 'users' && users && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Gestión de Usuarios</h2>
                <p className="text-gray-600">Administra y modera usuarios de la plataforma</p>
              </div>

              {/* Filtros */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Buscar por nombre, email o documento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <select
                  value={filterActive === undefined ? 'all' : filterActive ? 'active' : 'inactive'}
                  onChange={(e) => {
                    const value = e.target.value
                    setFilterActive(value === 'all' ? undefined : value === 'active')
                    setCurrentPage(1)
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                >
                  <option value="all">Todos los usuarios</option>
                  <option value="active">Solo activos</option>
                  <option value="inactive">Solo baneados</option>
                </select>
              </div>

              <UsersTable
                users={users.users}
                currentPage={users.page}
                totalPages={users.totalPages}
                onPageChange={setCurrentPage}
                onUserUpdated={loadData}
              />
            </div>
          )}

          {/* Administradores */}
          {activeTab === 'admins' && admins && user && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Gestión de Administradores</h2>
                <p className="text-gray-600">Administra roles y permisos del equipo</p>
              </div>

              <AdminsTable
                admins={admins}
                currentUserId={user.id}
                onAdminUpdated={loadData}
              />
            </div>
          )}

          {/* Categorías */}
          {activeTab === 'categories' && categories && (
            <div className="space-y-6">
              <CategoriesTable
                categories={categories}
                onCategoryUpdated={loadData}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
