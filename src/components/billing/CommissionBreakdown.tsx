'use client'

import React from 'react'
import { BillingCommissions } from '@/services/api/billing'
import { formatCurrency, formatPercentage } from '@/lib/billingUtils'

interface CommissionBreakdownProps {
  commissions: BillingCommissions
  totalRevenue: number
}

const CommissionBreakdown: React.FC<CommissionBreakdownProps> = ({
  commissions,
  totalRevenue,
}) => {
  const netAmount = totalRevenue - commissions.total

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Desglose de Comisiones
      </h3>

      {/* Visualización gráfica */}
      <div className="mb-6">
        <div className="flex items-center h-12 rounded-lg overflow-hidden">
          <div
            className="bg-green-500 h-full flex items-center justify-center text-white text-xs font-medium px-2"
            style={{
              width: `${((netAmount / totalRevenue) * 100).toFixed(1)}%`,
            }}
            title={`Neto: ${formatCurrency(netAmount)}`}
          >
            {((netAmount / totalRevenue) * 100) > 10 && 'Neto'}
          </div>
          <div
            className="bg-orange-500 h-full flex items-center justify-center text-white text-xs font-medium px-2"
            style={{
              width: `${commissions.mercadoPago.percentage}%`,
            }}
            title={`Mercado Pago: ${formatCurrency(commissions.mercadoPago.amount)}`}
          >
            {commissions.mercadoPago.percentage > 5 && 'MP'}
          </div>
          <div
            className="bg-primary-500 h-full flex items-center justify-center text-white text-xs font-medium px-2"
            style={{
              width: `${commissions.platform.percentage}%`,
            }}
            title={`Plataforma: ${formatCurrency(commissions.platform.amount)}`}
          >
            {commissions.platform.percentage > 5 && 'Plat.'}
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500 text-center">
          Del ingreso bruto de {formatCurrency(totalRevenue)}
        </div>
      </div>

      {/* Detalle numérico */}
      <div className="space-y-3">
        {/* Mercado Pago */}
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                Comisión Mercado Pago
              </p>
              <p className="text-xs text-gray-500">
                {formatPercentage(Number(commissions.mercadoPago.percentage))}
              </p>
            </div>
          </div>
          <p className="text-sm font-semibold text-gray-900">
            {formatCurrency(commissions.mercadoPago.amount)}
          </p>
        </div>

        {/* Plataforma */}
        <div className="flex items-center justify-between py-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary-500"></div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                Comisión Plataforma
              </p>
              <p className="text-xs text-gray-500">
                {formatPercentage(Number(commissions.platform.percentage))}
              </p>
            </div>
          </div>
          <p className="text-sm font-semibold text-gray-900">
            {formatCurrency(commissions.platform.amount)}
          </p>
        </div>

        {/* Total Comisiones */}
        <div className="flex items-center justify-between py-2 border-b border-gray-200">
          <p className="text-sm font-semibold text-gray-900">
            Total Comisiones
          </p>
          <p className="text-sm font-bold text-red-600">
            - {formatCurrency(commissions.total)}
          </p>
        </div>

        {/* Monto Neto */}
        <div className="flex items-center justify-between py-2 bg-green-50 px-3 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <p className="text-sm font-bold text-gray-900">Monto Neto</p>
          </div>
          <p className="text-lg font-bold text-green-600">
            {formatCurrency(netAmount)}
          </p>
        </div>
      </div>

      {/* Nota informativa */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <div className="flex gap-2">
          <svg
            className="w-5 h-5 text-blue-600 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p className="text-xs text-blue-800">
            El monto neto es lo que recibirás después de las comisiones de
            Mercado Pago y nuestra plataforma.
          </p>
        </div>
      </div>
    </div>
  )
}

export default CommissionBreakdown
