'use client'

import React from 'react'
import { OrganizerEventBilling } from '@/services/api/billing'
import { formatCurrency, formatDate } from '@/lib/billingUtils'

interface BillingEventListProps {
  events: OrganizerEventBilling[]
  loading: boolean
  onSelectEvent: (eventId: string) => void
}

const BillingEventList: React.FC<BillingEventListProps> = ({
  events,
  loading,
  onSelectEvent,
}) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse"
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded w-24"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          No hay eventos con facturación
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Los eventos con ventas aparecerán aquí
        </p>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      DRAFT: { text: 'Borrador', color: 'bg-gray-100 text-gray-800' },
      PUBLISHED: { text: 'Publicado', color: 'bg-green-100 text-green-800' },
      CANCELLED: { text: 'Cancelado', color: 'bg-red-100 text-red-800' },
      COMPLETED: { text: 'Completado', color: 'bg-blue-100 text-blue-800' },
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT
    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.text}
      </span>
    )
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div
          key={event.id}
          className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-all cursor-pointer"
          onClick={() => onSelectEvent(event.id)}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">
                  {event.title}
                </h3>
                {getStatusBadge(event.status)}
              </div>
              <p className="text-sm text-gray-600 mb-4">
                <svg
                  className="inline w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                {formatDate(event.startDate)}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Ingresos Totales</p>
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(event.totalRevenue)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Transacciones</p>
                  <p className="text-lg font-bold text-gray-900">
                    {event.totalTransactions}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Monto Neto</p>
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrency(event.netAmount)}
                  </p>
                </div>
              </div>
            </div>

            <div className="ml-4 flex-shrink-0">
              <button
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                onClick={(e) => {
                  e.stopPropagation()
                  onSelectEvent(event.id)
                }}
              >
                Ver Detalle
                <svg
                  className="ml-2 -mr-1 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default BillingEventList
