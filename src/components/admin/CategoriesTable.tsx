'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import type { Category, CreateCategoryRequest, UpdateCategoryRequest } from '@/lib/types'
import { Plus, Edit2, Trash2, CheckCircle, XCircle, Image as ImageIcon, Calendar, Hash, Tag } from 'lucide-react'
import { AdminCategoriesService } from '@/services/api/adminCategories'
import toast from 'react-hot-toast'

interface CategoriesTableProps {
  categories: Category[]
  onCategoryUpdated: () => void
}

interface CategoryFormData {
  name: string
  description: string
  slug: string
  icon: string
  color: string
  imageUrl: string
  isFeatured: boolean
  sortOrder: number
}

export function CategoriesTable({ categories, onCategoryUpdated }: CategoriesTableProps) {
  const [loadingCategoryId, setLoadingCategoryId] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
  const [creating, setCreating] = useState(false)

  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    slug: '',
    icon: '',
    color: '#A855F7',
    imageUrl: '',
    isFeatured: false,
    sortOrder: 0
  })

  const [formErrors, setFormErrors] = useState<Partial<Record<keyof CategoryFormData, string>>>({})

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      slug: '',
      icon: '',
      color: '#A855F7',
      imageUrl: '',
      isFeatured: false,
      sortOrder: 0
    })
    setFormErrors({})
  }

  const handleOpenCreateModal = () => {
    resetForm()
    setShowCreateModal(true)
  }

  const handleOpenEditModal = (category: Category) => {
    setSelectedCategory(category)
    setFormData({
      name: category.name,
      description: category.description || '',
      slug: category.slug,
      icon: category.icon || '',
      color: category.color || '#A855F7',
      imageUrl: category.imageUrl || '',
      isFeatured: category.isFeatured,
      sortOrder: category.sortOrder
    })
    setFormErrors({})
    setShowEditModal(true)
  }

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof CategoryFormData, string>> = {}

    if (!formData.name.trim()) {
      errors.name = 'El nombre es requerido'
    } else if (formData.name.length < 2) {
      errors.name = 'El nombre debe tener al menos 2 caracteres'
    }

    if (!formData.slug.trim()) {
      errors.slug = 'El slug es requerido'
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      errors.slug = 'El slug solo puede contener letras minúsculas, números y guiones'
    }

    if (formData.color && !/^#[0-9A-Fa-f]{6}$/.test(formData.color)) {
      errors.color = 'El color debe estar en formato hex (#RRGGBB)'
    }

    if (formData.imageUrl && formData.imageUrl.trim()) {
      try {
        new URL(formData.imageUrl)
      } catch {
        errors.imageUrl = 'La URL de imagen no es válida'
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCreate = async () => {
    if (!validateForm()) return

    setCreating(true)

    try {
      const data: CreateCategoryRequest = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        slug: formData.slug.trim(),
        icon: formData.icon.trim() || undefined,
        color: formData.color || undefined,
        imageUrl: formData.imageUrl.trim() || undefined,
        isFeatured: formData.isFeatured,
        sortOrder: formData.sortOrder
      }

      await AdminCategoriesService.createCategory(data)
      toast.success('Categoría creada exitosamente')
      setShowCreateModal(false)
      resetForm()
      onCategoryUpdated()
    } catch (error: any) {
      console.error('Error creating category:', error)
      toast.error(error.message || 'Error al crear la categoría')
    } finally {
      setCreating(false)
    }
  }

  const handleUpdate = async () => {
    if (!selectedCategory || !validateForm()) return

    setCreating(true)

    try {
      const data: UpdateCategoryRequest = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        slug: formData.slug.trim(),
        icon: formData.icon.trim() || undefined,
        color: formData.color || undefined,
        imageUrl: formData.imageUrl.trim() || undefined,
        isFeatured: formData.isFeatured,
        sortOrder: formData.sortOrder
      }

      await AdminCategoriesService.updateCategory(selectedCategory.id, data)
      toast.success('Categoría actualizada exitosamente')
      setShowEditModal(false)
      setSelectedCategory(null)
      resetForm()
      onCategoryUpdated()
    } catch (error: any) {
      console.error('Error updating category:', error)
      toast.error(error.message || 'Error al actualizar la categoría')
    } finally {
      setCreating(false)
    }
  }

  const handleToggleActive = async (category: Category) => {
    if (loadingCategoryId) return

    const confirmed = confirm(
      category.isActive
        ? `¿Desactivar la categoría "${category.name}"?`
        : `¿Reactivar la categoría "${category.name}"?`
    )

    if (!confirmed) return

    setLoadingCategoryId(category.id)

    try {
      if (category.isActive) {
        await AdminCategoriesService.deleteCategory(category.id)
        toast.success('Categoría desactivada')
      } else {
        await AdminCategoriesService.activateCategory(category.id)
        toast.success('Categoría reactivada')
      }
      onCategoryUpdated()
    } catch (error: any) {
      console.error('Error toggling category:', error)
      toast.error(error.message || 'Error al actualizar la categoría')
    } finally {
      setLoadingCategoryId(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  return (
    <div className="space-y-4">
      {/* Header con botón crear */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Categorías de Eventos</h3>
          <p className="text-sm text-gray-500 mt-1">
            Gestiona las categorías disponibles para los eventos
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nueva Categoría
        </Button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Eventos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orden
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {category.imageUrl ? (
                        <div className="flex-shrink-0 h-10 w-10">
                          <img
                            src={category.imageUrl}
                            alt={category.name}
                            className="h-10 w-10 rounded-lg object-cover"
                          />
                        </div>
                      ) : (
                        <div
                          className="flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center text-white text-lg font-bold"
                          style={{ backgroundColor: category.color || '#A855F7' }}
                        >
                          {category.icon || category.name[0]}
                        </div>
                      )}
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 flex items-center gap-2">
                          {category.name}
                          {category.isFeatured && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                              Destacada
                            </span>
                          )}
                        </div>
                        {category.description && (
                          <div className="text-xs text-gray-500 max-w-xs truncate">
                            {category.description}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center gap-1">
                      <Tag className="w-3 h-3 text-gray-400" />
                      {category.slug}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 flex items-center gap-1">
                      <Hash className="w-3 h-3 text-gray-400" />
                      {category.eventCount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {category.isActive ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3" />
                        Activa
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <XCircle className="w-3 h-3" />
                        Inactiva
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {category.sortOrder}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(category)}
                        className="text-violet-600 hover:text-violet-900 transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleActive(category)}
                        disabled={loadingCategoryId === category.id}
                        className={`transition-colors ${
                          category.isActive
                            ? 'text-red-600 hover:text-red-900'
                            : 'text-green-600 hover:text-green-900'
                        } disabled:opacity-50`}
                        title={category.isActive ? 'Desactivar' : 'Activar'}
                      >
                        {loadingCategoryId === category.id ? (
                          <div className="w-4 h-4 border-2 border-gray-300 border-t-violet-600 rounded-full animate-spin" />
                        ) : category.isActive ? (
                          <Trash2 className="w-4 h-4" />
                        ) : (
                          <CheckCircle className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {categories.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No hay categorías creadas</p>
              <Button
                variant="primary"
                size="md"
                onClick={handleOpenCreateModal}
                className="mt-4"
              >
                Crear primera categoría
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Modal Crear/Editar */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                {showCreateModal ? 'Crear Nueva Categoría' : 'Editar Categoría'}
              </h2>
            </div>

            <div className="p-6 space-y-4">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre *
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value })
                    if (showCreateModal && !formData.slug) {
                      setFormData((prev) => ({
                        ...prev,
                        name: e.target.value,
                        slug: generateSlug(e.target.value)
                      }))
                    } else {
                      setFormData({ ...formData, name: e.target.value })
                    }
                  }}
                  placeholder="Ej: Conciertos"
                  className={formErrors.name ? 'border-red-500' : ''}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                )}
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug * (URL amigable)
                </label>
                <Input
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="Ej: conciertos"
                  className={formErrors.slug ? 'border-red-500' : ''}
                />
                {formErrors.slug && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.slug}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Solo minúsculas, números y guiones
                </p>
              </div>

              {/* Descripción */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descripción de la categoría"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500"
                />
              </div>

              {/* Icono y Color */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Icono / Emoji
                  </label>
                  <Input
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="Ej: 🎵 o music"
                    maxLength={100}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color (Hex)
                  </label>
                  <Input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className={formErrors.color ? 'border-red-500' : ''}
                  />
                  {formErrors.color && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.color}</p>
                  )}
                </div>
              </div>

              {/* URL de Imagen */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL de Imagen
                </label>
                <Input
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className={formErrors.imageUrl ? 'border-red-500' : ''}
                />
                {formErrors.imageUrl && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.imageUrl}</p>
                )}
                {formData.imageUrl && !formErrors.imageUrl && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-2">Vista previa:</p>
                    <div className="flex justify-center items-center bg-gray-50 rounded-lg p-4">
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="h-64 w-auto max-w-full object-cover rounded-lg border-2 border-gray-300 shadow-md"
                        onError={() => setFormErrors({ ...formErrors, imageUrl: 'Error al cargar la imagen' })}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Orden y Destacada */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Orden
                  </label>
                  <Input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                    min="0"
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isFeatured}
                      onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                      className="w-4 h-4 text-violet-600 border-gray-300 rounded focus:ring-violet-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Categoría destacada</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowCreateModal(false)
                  setShowEditModal(false)
                  setSelectedCategory(null)
                  resetForm()
                }}
                disabled={creating}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={showCreateModal ? handleCreate : handleUpdate}
                loading={creating}
              >
                {showCreateModal ? 'Crear Categoría' : 'Guardar Cambios'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
