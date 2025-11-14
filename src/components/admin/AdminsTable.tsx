'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { AdminUser } from '@/lib/types'
import { Shield, ShieldCheck, ShieldAlert, ShieldOff, CheckCircle, XCircle, Mail, UserPlus, X } from 'lucide-react'
import { AdminService } from '@/services/api/admin'
import toast from 'react-hot-toast'

interface AdminsTableProps {
  admins: AdminUser[]
  currentUserId: string
  onAdminUpdated: () => void
}

interface CreateAdminForm {
  email: string
  password: string
  confirmPassword: string
  firstName: string
  lastName: string
  phoneNumber: string
  role: string
  documentType: 'DNI' | 'CE' | 'Pasaporte'
  documentId: string
}

export function AdminsTable({ admins, currentUserId, onAdminUpdated }: AdminsTableProps) {
  const [loadingAdminId, setLoadingAdminId] = useState<string | null>(null)
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedRole, setSelectedRole] = useState<string>('')
  const [creating, setCreating] = useState(false)
  
  const [formData, setFormData] = useState<CreateAdminForm>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: 'SUPPORT_ADMIN',
    documentType: 'DNI',
    documentId: ''
  })

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof CreateAdminForm, string>>>({})

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
      toast.error('No puedes desactivar tu propia cuenta')
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
        toast.success('Administrador desactivado')
      } else {
        await AdminService.activateAdmin(admin.id)
        toast.success('Administrador reactivado')
      }
      onAdminUpdated()
    } catch (error: any) {
      console.error('Error updating admin:', error)
      toast.error(error.message || 'Error al actualizar el administrador')
    } finally {
      setLoadingAdminId(null)
    }
  }

  const handleOpenRoleModal = (admin: AdminUser) => {
    if (admin.id === currentUserId) {
      toast.error('No puedes cambiar tu propio rol')
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
      toast.success('Rol actualizado correctamente')
      onAdminUpdated()
    } catch (error: any) {
      console.error('Error changing role:', error)
      toast.error(error.message || 'Error al cambiar el rol')
    } finally {
      setLoadingAdminId(null)
    }
  }

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof CreateAdminForm, string>> = {}

    if (!formData.email) {
      errors.email = 'El email es requerido'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email inválido'
    }

    if (!formData.password) {
      errors.password = 'La contraseña es requerida'
    } else if (formData.password.length < 8) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres'
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Las contraseñas no coinciden'
    }

    if (!formData.firstName) errors.firstName = 'El nombre es requerido'
    if (!formData.lastName) errors.lastName = 'El apellido es requerido'
    if (!formData.documentId) errors.documentId = 'El documento es requerido'

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCreateAdmin = async () => {
    if (!validateForm()) {
      toast.error('Por favor completa todos los campos correctamente')
      return
    }

    setCreating(true)

    try {
      await AdminService.createAdmin({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber || undefined,
        role: formData.role as any,
        documentType: formData.documentType,
        documentId: formData.documentId,
      })

      toast.success('Administrador creado exitosamente')
      setShowCreateModal(false)
      resetForm()
      onAdminUpdated()
    } catch (error: any) {
      console.error('Error creating admin:', error)
      toast.error(error.message || 'Error al crear el administrador')
    } finally {
      setCreating(false)
    }
  }

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phoneNumber: '',
      role: 'SUPPORT_ADMIN',
      documentType: 'DNI',
      documentId: ''
    })
    setFormErrors({})
  }

  const handleOpenCreateModal = () => {
    resetForm()
    setShowCreateModal(true)
  }

  return (
    <>
      <div className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Administradores del Sistema</h3>
            <p className="text-sm text-gray-500 mt-1">Gestiona roles y permisos de administradores</p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenCreateModal}
            className="flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Crear Administrador
          </Button>
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

      {/* Modal de crear administrador */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 my-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold">Crear Nuevo Administrador</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[70vh] overflow-y-auto px-1">
              {/* Información Personal */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Información Personal</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre *
                    </label>
                    <Input
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="Juan"
                      className={formErrors.firstName ? 'border-red-500' : ''}
                    />
                    {formErrors.firstName && (
                      <p className="text-xs text-red-600 mt-1">{formErrors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellido *
                    </label>
                    <Input
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      placeholder="Pérez"
                      className={formErrors.lastName ? 'border-red-500' : ''}
                    />
                    {formErrors.lastName && (
                      <p className="text-xs text-red-600 mt-1">{formErrors.lastName}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Documento */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Documento de Identidad</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Documento *
                    </label>
                    <select
                      value={formData.documentType}
                      onChange={(e) => setFormData({ ...formData, documentType: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                    >
                      <option value="DNI">DNI</option>
                      <option value="CE">Carnet de Extranjería</option>
                      <option value="Pasaporte">Pasaporte</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de Documento *
                    </label>
                    <Input
                      value={formData.documentId}
                      onChange={(e) => setFormData({ ...formData, documentId: e.target.value })}
                      placeholder="12345678"
                      className={formErrors.documentId ? 'border-red-500' : ''}
                    />
                    {formErrors.documentId && (
                      <p className="text-xs text-red-600 mt-1">{formErrors.documentId}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contacto */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Información de Contacto</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="admin@ticketify.com"
                      className={formErrors.email ? 'border-red-500' : ''}
                    />
                    {formErrors.email && (
                      <p className="text-xs text-red-600 mt-1">{formErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Teléfono
                    </label>
                    <Input
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      placeholder="+51 999 999 999"
                    />
                  </div>
                </div>
              </div>

              {/* Contraseña */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Credenciales de Acceso</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contraseña *
                    </label>
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="••••••••"
                      className={formErrors.password ? 'border-red-500' : ''}
                    />
                    {formErrors.password && (
                      <p className="text-xs text-red-600 mt-1">{formErrors.password}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirmar Contraseña *
                    </label>
                    <Input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="••••••••"
                      className={formErrors.confirmPassword ? 'border-red-500' : ''}
                    />
                    {formErrors.confirmPassword && (
                      <p className="text-xs text-red-600 mt-1">{formErrors.confirmPassword}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Rol */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Rol y Permisos</h4>
                <div className="space-y-3">
                  {Object.entries(roleInfo).map(([roleKey, roleData]) => (
                    <label
                      key={roleKey}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.role === roleKey
                          ? 'border-violet-500 bg-violet-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="createRole"
                        value={roleKey}
                        checked={formData.role === roleKey}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
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
              </div>
            </div>

            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
                className="flex-1"
                disabled={creating}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleCreateAdmin}
                className="flex-1"
                loading={creating}
                disabled={creating}
              >
                Crear Administrador
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
