'use client'

import React, { useState } from 'react'
import { EventBillingDetail } from '@/services/api/billing'
import BillingSummaryCard from './BillingSummaryCard'
import CommissionBreakdown from './CommissionBreakdown'
import TransactionsTable from './TransactionsTable'
import PaymentMethodsChart from './PaymentMethodsChart'
import { formatDate, downloadFile } from '@/lib/billingUtils'
import billingService from '@/services/api/billing'

interface BillingEventDetailProps {
  eventDetail: EventBillingDetail
  onBack: () => void
  onSync: () => void
}

// Define esta función al inicio del componente BillingEventDetail
const formatAmount = (amount: any): string => {
  let numericAmount = 0;
    
  // Intenta convertir a número solo si el valor no es nulo/indefinido
  if (amount !== null && amount !== undefined) {
      // Intenta parsear a flotante, maneja strings y Decimal de Python
      numericAmount = parseFloat(String(amount));
        
      // Si la conversión falla (es NaN), usa 0
      if (isNaN(numericAmount)) {
          numericAmount = 0;
      }
  }
    
  return numericAmount.toFixed(2);
}

const BillingEventDetail: React.FC<BillingEventDetailProps> = ({
  eventDetail,
  onBack,
  onSync,
}) => {
  const [downloading, setDownloading] = useState(false)
  const [syncing, setSyncing] = useState(false)

  const handleDownloadReport = async (format: 'pdf' | 'excel') => {
    try {
      setDownloading(true)
      const blob = await billingService.downloadBillingReport(
        eventDetail.eventId,
        format
      )
      const extension = format === 'pdf' ? 'pdf' : 'xlsx'
      const fileName = `facturacion-${eventDetail.eventName
        .toLowerCase()
        .replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.${extension}`
      downloadFile(blob, fileName)
    } catch (error) {
      console.error('Error al descargar reporte:', error)
      alert('Error al descargar el reporte. Por favor intenta nuevamente.')
    } finally {
      setDownloading(false)
    }
  }

  const handleSync = async () => {
    try {
      setSyncing(true)
      await onSync()
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <button
              onClick={onBack}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {eventDetail.eventName}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
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
                {formatDate(eventDetail.eventDate)}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleSync}
              disabled={syncing}
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              {syncing ? 'Sincronizando...' : 'Sincronizar'}
            </button>

            <div className="relative inline-block text-left">
              <button
                disabled={downloading}
                className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                onClick={() => {
                  const menu = document.getElementById('download-menu')
                  menu?.classList.toggle('hidden')
                }}
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                {downloading ? 'Descargando...' : 'Descargar Reporte'}
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <div
                id="download-menu"
                className="hidden absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <div className="py-1">
                  <button
                    onClick={() => handleDownloadReport('pdf')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Descargar PDF
                  </button>
                  <button
                    onClick={() => handleDownloadReport('excel')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Descargar Excel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Última sincronización */}
        <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Última sincronización:{' '}
          {new Date(eventDetail.lastSync).toLocaleString('es-PE')}
        </div>
      </div>

      {/* Cards de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <BillingSummaryCard
          title="Ingresos Totales"
          value={eventDetail.summary.totalRevenue}
          subtitle={`${eventDetail.summary.totalTransactions} transacciones`}
          color="info"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />

        <BillingSummaryCard
          title="Total Comisiones"
          value={eventDetail.summary.commissions.total}
          subtitle={`MP + Plataforma`}
          color="warning"
          tooltip="Incluye comisiones de Mercado Pago y de nuestra plataforma"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          }
        />

        <BillingSummaryCard
          title="Monto Neto"
          value={eventDetail.summary.netAmount}
          subtitle="Después de comisiones"
          color="success"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          }
        />

        <BillingSummaryCard
          title="Acreditado"
          value={eventDetail.summary.accreditation.credited}
          subtitle={
            (eventDetail.summary.accreditation.pending || 0) > 0 // Asegura que se compara un número
              ? `Pendiente: ${formatAmount(eventDetail.summary.accreditation.pending)}` // Asegura que se llama a toFixed en un número
              : 'Todo acreditado'
          }
          color="primary"
          icon={
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          }
        />
      </div>

      {/* Gráfico de métodos de pago y desglose de comisiones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PaymentMethodsChart paymentMethods={eventDetail.paymentMethods} />
        <CommissionBreakdown
          commissions={eventDetail.summary.commissions}
          totalRevenue={eventDetail.summary.totalRevenue}
        />
      </div>

      {/* Tabla de transacciones */}
      <TransactionsTable transactions={eventDetail.transactions} />
    </div>
  )
}

export default BillingEventDetail
