'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { AdminUser } from '@/lib/types'
import { Shield, ShieldCheck, ShieldAlert, ShieldOff, CheckCircle, XCircle, Mail } from 'lucide-react'
import { AdminService } from '@/services/api/admin'

interface AdminsTableProps {
  admins: AdminUser[]
  currentUserId: string
  onAdminUpdated: () => void
}

export function AdminsTable({ admins, currentUserId, onAdminUpdated }: AdminsTableProps) {
  const [loadingAdminId, setLoadingAdminId] = useState<string | null>(null)
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string>('')

  const roleInfo = {
    SUPER_ADMIN: {
      label: 'Super Admin',
      icon: <ShieldCheck className="w-4 h-4" />,
      color: 'text-purple-600 bg-purple-100',
      description: 'Acceso total al sistema'
    },
    SUPPORT_ADMIN: {
      label: 'Soporte',
      icon: <Shield className="w-4 h-4" />,
      color: 'text-blue-600 bg-blue-100',
      description: 'Gestión de tickets y soporte'
    },
    SECURITY_ADMIN: {
      label: 'Seguridad',
      icon: <ShieldAlert className="w-4 h-4" />,
      color: 'text-red-600 bg-red-100',
      description: 'Monitoreo y seguridad'
    },
    CONTENT_ADMIN: {
      label: 'Contenido',
      icon: <ShieldOff className="w-4 h-4" />,
      color: 'text-green-600 bg-green-100',
      description: 'Gestión de eventos y contenido'
    }
  }

  const handleToggleActive = async (admin: AdminUser) => {
    if (admin.id === currentUserId) {
      alert('No puedes desactivar tu propia cuenta')
      return
    }

    const confirmed = confirm(
      admin.isActive
        ? `¿Desactivar a ${admin.firstName} ${admin.lastName}?`
        : `¿Reactivar a ${admin.firstName} ${admin.lastName}?`
    )

    if (!confirmed) return

    setLoadingAdminId(admin.id)

    try {
      if (admin.isActive) {
        await AdminService.deactivateAdmin(admin.id)
      } else {
        await AdminService.activateAdmin(admin.id)
      }
      onAdminUpdated()
    } catch (error) {
      console.error('Error updating admin:', error)
      alert('Error al actualizar el administrador')
    } finally {
      setLoadingAdminId(null)
    }
  }

  const handleOpenRoleModal = (admin: AdminUser) => {
    if (admin.id === currentUserId) {
      alert('No puedes cambiar tu propio rol')
      return
    }
    setSelectedAdmin(admin)
    setSelectedRole(admin.roles[0] || '')
    setShowRoleModal(true)
  }

  const handleChangeRole = async () => {
    if (!selectedAdmin || !selectedRole) return

    setLoadingAdminId(selectedAdmin.id)

    try {
      await AdminService.updateAdminRole(selectedAdmin.id, { role: selectedRole as any })
      setShowRoleModal(false)
      setSelectedAdmin(null)
      onAdminUpdated()
    } catch (error) {
      console.error('Error changing role:', error)
      alert('Error al cambiar el rol')
    } finally {
      setLoadingAdminId(null)
    }
  }

  return (
    <>
      <div className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Administradores del Sistema</h3>
          <p className="text-sm text-gray-500 mt-1">Gestiona roles y permisos de administradores</p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Administrador
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rol
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
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
              {admins.map((admin) => {
                const role = admin.roles[0] || 'SUPER_ADMIN'
                const roleData = roleInfo[role as keyof typeof roleInfo] || roleInfo.SUPER_ADMIN
                const isCurrentUser = admin.id === currentUserId

                return (
                  <tr key={admin.id} className={`hover:bg-gray-50 transition-colors ${isCurrentUser ? 'bg-violet-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {admin.firstName[0]}{admin.lastName[0]}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                            {admin.firstName} {admin.lastName}
                            {isCurrentUser && (
                              <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">
                                Tú
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {admin.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${roleData.color}`}>
                        {roleData.icon}
                        {roleData.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {admin.phoneNumber || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {admin.isActive ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3" />
                          Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          <XCircle className="w-3 h-3" />
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenRoleModal(admin)}
                          disabled={isCurrentUser || loadingAdminId !== null}
                          className="text-xs"
                        >
                          Cambiar Rol
                        </Button>
                        <Button
                          variant={admin.isActive ? 'destructive' : 'success'}
                          size="sm"
                          onClick={() => handleToggleActive(admin)}
                          loading={loadingAdminId === admin.id}
                          disabled={isCurrentUser || loadingAdminId !== null}
                          className="text-xs"
                        >
                          {admin.isActive ? 'Desactivar' : 'Activar'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de cambio de rol */}
      {showRoleModal && selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Cambiar Rol de Administrador</h3>
            <p className="text-sm text-gray-600 mb-4">
              Administrador: <span className="font-medium">{selectedAdmin.firstName} {selectedAdmin.lastName}</span>
            </p>

            <div className="space-y-3 mb-6">
              {Object.entries(roleInfo).map(([roleKey, roleData]) => (
                <label
                  key={roleKey}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedRole === roleKey
                      ? 'border-violet-500 bg-violet-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={roleKey}
                    checked={selectedRole === roleKey}
                    onChange={(e) => setSelectedRole(e.target.value)}
                    className="w-4 h-4 text-violet-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`p-1.5 rounded ${roleData.color}`}>
                        {roleData.icon}
                      </span>
                      <span className="font-medium text-gray-900">{roleData.label}</span>
                    </div>
                    <p className="text-xs text-gray-500">{roleData.description}</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRoleModal(false)
                  setSelectedAdmin(null)
                }}
                className="flex-1"
                disabled={loadingAdminId !== null}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleChangeRole}
                className="flex-1"
                loading={loadingAdminId === selectedAdmin.id}
                disabled={!selectedRole || loadingAdminId !== null}
              >
                Cambiar Rol
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
