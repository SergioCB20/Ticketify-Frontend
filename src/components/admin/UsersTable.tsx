'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { User } from '@/lib/types'
import { Ban, CheckCircle, Eye, Mail, Phone, IdCard, Calendar } from 'lucide-react'
import { AdminService } from '@/services/api/admin'

interface UsersTableProps {
  users: User[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onUserUpdated: () => void
}

export function UsersTable({ users, currentPage, totalPages, onPageChange, onUserUpdated }: UsersTableProps) {
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const handleBanToggle = async (user: User) => {
    if (loadingUserId) return

    const confirmed = confirm(
      user.isActive 
        ? `¿Estás seguro de banear a ${user.firstName} ${user.lastName}?`
        : `¿Estás seguro de desbanear a ${user.firstName} ${user.lastName}?`
    )

    if (!confirmed) return

    setLoadingUserId(user.id)

    try {
      await AdminService.banUser(user.id, {
        isActive: !user.isActive,
        reason: user.isActive ? 'Baneado por administrador' : 'Desbaneado por administrador'
      })

      onUserUpdated()
    } catch (error) {
      console.error('Error updating user:', error)
      alert('Error al actualizar el usuario')
    } finally {
      setLoadingUserId(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <div className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Usuarios Registrados</h3>
        <p className="text-sm text-gray-500 mt-1">Gestiona y modera usuarios de la plataforma</p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contacto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Documento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Registro
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-violet-100 flex items-center justify-center">
                        <span className="text-violet-600 font-semibold text-sm">
                          {user.firstName[0]}{user.lastName[0]}
                        </span>
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {user.firstName} {user.lastName}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-gray-400" />
                    {user.phoneNumber || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 flex items-center gap-1">
                    <IdCard className="w-3 h-3 text-gray-400" />
                    {user.documentId || 'N/A'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(user.createdAt)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.isActive ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3" />
                      Activo
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <Ban className="w-3 h-3" />
                      Baneado
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="text-violet-600 hover:text-violet-900 transition-colors"
                      title="Ver detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <Button
                      variant={user.isActive ? 'destructive' : 'success'}
                      size="sm"
                      onClick={() => handleBanToggle(user)}
                      loading={loadingUserId === user.id}
                      disabled={loadingUserId !== null}
                      className="text-xs"
                    >
                      {user.isActive ? 'Banear' : 'Desbanear'}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Página <span className="font-medium">{currentPage}</span> de{' '}
            <span className="font-medium">{totalPages}</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}

      {/* Modal de detalles - simplificado */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6">
            <h3 className="text-xl font-bold mb-4">Detalles del Usuario</h3>
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Nombre:</span>
                <p className="text-gray-900">{selectedUser.firstName} {selectedUser.lastName}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Email:</span>
                <p className="text-gray-900">{selectedUser.email}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Teléfono:</span>
                <p className="text-gray-900">{selectedUser.phoneNumber || 'N/A'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Documento:</span>
                <p className="text-gray-900">{selectedUser.documentId || 'N/A'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Fecha de registro:</span>
                <p className="text-gray-900">{formatDate(selectedUser.createdAt)}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500">Último acceso:</span>
                <p className="text-gray-900">
                  {selectedUser.lastLogin ? formatDate(selectedUser.lastLogin) : 'Nunca'}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setSelectedUser(null)}
              className="mt-6 w-full"
            >
              Cerrar
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
