'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import billingService, {
  OrganizerEventBilling,
  EventBillingDetail,
} from '@/services/api/billing'
import BillingEventList from '@/components/billing/BillingEventList'
import BillingEventDetail from '@/components/billing/BillingEventDetail'

export default function BillingPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  const [events, setEvents] = useState<OrganizerEventBilling[]>([])
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)
  const [eventDetail, setEventDetail] = useState<EventBillingDetail | null>(
    null
  )
  const [loading, setLoading] = useState(true)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Verificar que el usuario sea organizador
  useEffect(() => {
    if (!authLoading && user) {
      const isOrganizer = user.roles?.includes('ORGANIZER')
      if (!isOrganizer) {
        router.push('/panel/profile')
      }
    }
  }, [authLoading, user, router])

  // Cargar lista de eventos
  useEffect(() => {
    if (user?.roles?.includes('ORGANIZER')) {
      loadEvents()
    }
  }, [user])

  const loadEvents = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await billingService.getOrganizerEvents()
      setEvents(data)
    } catch (err: any) {
      console.error('Error al cargar eventos:', err)
      setError(
        err.message || 'Error al cargar los datos de facturación'
      )
    } finally {
      setLoading(false)
    }
  }

  const loadEventDetail = async (eventId: string) => {
    try {
      setLoadingDetail(true)
      setError(null)
      const data = await billingService.getEventBillingDetail(eventId)
      setEventDetail(data)
      setSelectedEventId(eventId)
    } catch (err: any) {
      console.error('Error al cargar detalle del evento:', err)
      setError(
        err.message || 'Error al cargar el detalle del evento'
      )
      setSelectedEventId(null)
    } finally {
      setLoadingDetail(false)
    }
  }

  const handleSelectEvent = (eventId: string) => {
    loadEventDetail(eventId)
  }

  const handleBack = () => {
    setSelectedEventId(null)
    setEventDetail(null)
  }

  const handleSync = async () => {
    if (!selectedEventId) return

    try {
      await billingService.syncEventBilling(selectedEventId)
      // Recargar los detalles después de sincronizar
      await loadEventDetail(selectedEventId)
      // También recargar la lista de eventos para actualizar los totales
      await loadEvents()
    } catch (err: any) {
      console.error('Error al sincronizar:', err)
      alert(
        err.message || 'Error al sincronizar los datos. Intenta nuevamente.'
      )
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg border border-gray-200 p-6"
                >
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error && !eventDetail) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <svg
                className="w-6 h-6 text-red-600 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="text-red-800 font-semibold">Error</h3>
                <p className="text-red-700 text-sm mt-1">{error}</p>
                <button
                  onClick={loadEvents}
                  className="mt-3 text-sm text-red-600 hover:text-red-800 font-medium"
                >
                  Intentar nuevamente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {!selectedEventId ? (
          <>
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Facturación</h1>
              <p className="text-gray-600 mt-1">
                Consulta los ingresos, comisiones y reportes de tus eventos
              </p>
            </div>

            {/* Lista de eventos */}
            <BillingEventList
              events={events}
              loading={loading}
              onSelectEvent={handleSelectEvent}
            />
          </>
        ) : loadingDetail ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
              <p className="mt-4 text-gray-600">Cargando detalles...</p>
            </div>
          </div>
        ) : eventDetail ? (
          <BillingEventDetail
            eventDetail={eventDetail}
            onBack={handleBack}
            onSync={handleSync}
          />
        ) : null}
      </div>
    </div>
  )
}
