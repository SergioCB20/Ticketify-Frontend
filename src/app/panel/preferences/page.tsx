'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { PreferencesService } from '@/services/api/preferences'
import { getCategories } from '@/services/api/categories'
import { Card, CardContent, CardHeader, CardTitle, Button } from '@/components/ui'
import { Bell, BellOff, Loader2, Save, Heart } from 'lucide-react'
import toast from 'react-hot-toast'
import type { UserPreferences, Category } from '@/lib/types'

export default function PreferencesPage() {
  const { user, loading: authLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Estados locales para cambios pendientes
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])

  useEffect(() => {
    const loadData = async () => {
      if (!isAuthenticated) return

      setLoading(true)
      try {
        // Cargar preferencias y categorías en paralelo
        const [prefsData, categoriesResponse] = await Promise.all([
          PreferencesService.getPreferences(),
          getCategories(true) // true = solo activas
        ])

        setPreferences(prefsData)
        setEmailNotifications(prefsData.emailNotifications)

        // Las categorías ya vienen filtradas como activas desde el backend
        setCategories(categoriesResponse.categories)

        // Inicializar categorías seleccionadas
        const activeCategoryIds = new Set(
          prefsData.categories
            .filter(pref => pref.isActive)
            .map(pref => pref.categoryId)
        )
        setSelectedCategories(activeCategoryIds)
      } catch (error) {
        console.error('Error loading preferences:', error)
        toast.error('Error al cargar preferencias')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [isAuthenticated])

  const handleEmailNotificationsToggle = async () => {
    const newValue = !emailNotifications
    setEmailNotifications(newValue)

    try {
      await PreferencesService.updateEmailNotifications(newValue)
      toast.success(
        newValue
          ? 'Notificaciones por email activadas'
          : 'Notificaciones por email desactivadas'
      )
    } catch (error) {
      console.error('Error updating email notifications:', error)
      setEmailNotifications(!newValue) // Revertir en caso de error
      toast.error('Error al actualizar preferencia')
    }
  }

  const handleCategoryToggle = (categoryId: string) => {
    const newSelected = new Set(selectedCategories)
    if (newSelected.has(categoryId)) {
      newSelected.delete(categoryId)
    } else {
      newSelected.add(categoryId)
    }
    setSelectedCategories(newSelected)
  }

  const handleSavePreferences = async () => {
    setSaving(true)
    try {
      // Preparar cambios
      const updates = categories.map(category => ({
        categoryId: category.id,
        isActive: selectedCategories.has(category.id)
      }))

      // Enviar actualización
      await PreferencesService.bulkUpdateCategoryPreferences(updates)

      // Recargar preferencias
      const updatedPrefs = await PreferencesService.getPreferences()
      setPreferences(updatedPrefs)

      toast.success('Preferencias guardadas correctamente')
    } catch (error) {
      console.error('Error saving preferences:', error)
      toast.error('Error al guardar preferencias')
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  const hasChanges = preferences ?
    selectedCategories.size !== preferences.categories.filter(p => p.isActive).length ||
    [...selectedCategories].some(id =>
      !preferences.categories.find(p => p.categoryId === id && p.isActive)
    ) : false

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Preferencias</h1>
          <p className="text-gray-600 mt-2">
            Personaliza tu experiencia y las notificaciones que recibes
          </p>
        </div>

        {/* Notificaciones por Email */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notificaciones por Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Recibir notificaciones</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Te enviaremos emails sobre nuevos eventos en tus categorías favoritas
                </p>
              </div>
              <button
                onClick={handleEmailNotificationsToggle}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                  emailNotifications ? 'bg-violet-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    emailNotifications ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {!emailNotifications && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                <BellOff className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  No recibirás notificaciones por email, aunque sigas categorías favoritas.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Categorías Favoritas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Categorías Favoritas
            </CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              Selecciona las categorías de eventos que te interesan. Te notificaremos cuando se publiquen nuevos eventos.
            </p>
          </CardHeader>
          <CardContent>
            {categories.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No hay categorías disponibles
              </p>
            ) : (
              <div className="space-y-3">
                {categories.map((category) => {
                  const isSelected = selectedCategories.has(category.id)
                  const preference = preferences?.categories.find(p => p.categoryId === category.id)

                  return (
                    <div
                      key={category.id}
                      onClick={() => handleCategoryToggle(category.id)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-violet-500 bg-violet-50'
                          : 'border-gray-200 bg-white hover:border-violet-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Checkbox */}
                        <div
                          className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                            isSelected
                              ? 'bg-violet-600 border-violet-600'
                              : 'bg-white border-gray-300'
                          }`}
                        >
                          {isSelected && (
                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>

                        {/* Imagen */}
                        {category.imageUrl && (
                          <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                            <img
                              src={category.imageUrl}
                              alt={category.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900">{category.name}</h3>
                          {category.description && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                              {category.description}
                            </p>
                          )}
                          {preference?.lastNotificationSentAt && (
                            <p className="text-xs text-gray-500 mt-1">
                              Última notificación: {new Date(preference.lastNotificationSentAt).toLocaleDateString('es-ES')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Botón Guardar */}
            {hasChanges && (
              <div className="mt-6 flex justify-end">
                <Button
                  onClick={handleSavePreferences}
                  disabled={saving}
                  className="gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Guardar Preferencias
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Info de spam prevention */}
            {emailNotifications && selectedCategories.size > 0 && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>📧 Nota:</strong> Para evitar spam, solo enviaremos una notificación cada 24 horas por categoría,
                  incluso si se publican varios eventos.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Resumen */}
        {preferences && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Resumen:</strong> Tienes {selectedCategories.size} categoría(s) favorita(s)
              {emailNotifications ? ' y recibirás notificaciones por email.' : ' pero las notificaciones por email están desactivadas.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
