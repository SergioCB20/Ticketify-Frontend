'use client'

import React from 'react'
import { PaymentMethod } from '@/services/api/billing'
import { formatCurrency, formatPercentage, getPaymentMethodName } from '@/lib/billingUtils'

interface PaymentMethodsChartProps {
  paymentMethods: PaymentMethod[]
}

const PaymentMethodsChart: React.FC<PaymentMethodsChartProps> = ({
  paymentMethods,
}) => {
  const colors = [
    { bg: 'bg-blue-500', light: 'bg-blue-100', text: 'text-blue-800' },
    { bg: 'bg-green-500', light: 'bg-green-100', text: 'text-green-800' },
    { bg: 'bg-purple-500', light: 'bg-purple-100', text: 'text-purple-800' },
    { bg: 'bg-orange-500', light: 'bg-orange-100', text: 'text-orange-800' },
    { bg: 'bg-pink-500', light: 'bg-pink-100', text: 'text-pink-800' },
  ]

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Métodos de Pago
      </h3>

      {paymentMethods.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
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
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
          <p className="mt-2 text-sm">No hay datos de métodos de pago</p>
        </div>
      ) : (
        <>
          {/* Gráfico de barras horizontal */}
          <div className="space-y-3 mb-6">
            {paymentMethods.map((method, index) => {
              const color = colors[index % colors.length]
              return (
                <div key={method.method}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">
                      {getPaymentMethodName(method.method)}
                    </span>
                    <span className="text-gray-600">
                      {formatPercentage(method.percentage)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`${color.bg} h-3 rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
                      style={{ width: `${method.percentage}%` }}
                    >
                      {method.percentage > 15 && (
                        <span className="text-xs text-white font-medium">
                          {method.count}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                    <span>{method.count} transacciones</span>
                    <span className="font-semibold text-gray-700">
                      {formatCurrency(method.amount)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Lista con badges */}
          <div className="border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Resumen</h4>
            <div className="flex flex-wrap gap-2">
              {paymentMethods.map((method, index) => {
                const color = colors[index % colors.length]
                return (
                  <div
                    key={method.method}
                    className={`${color.light} ${color.text} px-3 py-2 rounded-lg text-sm`}
                  >
                    <div className="font-semibold">
                      {getPaymentMethodName(method.method)}
                    </div>
                    <div className="text-xs mt-0.5">
                      {formatCurrency(method.amount)} ({method.count})
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Información adicional */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-start gap-2">
              <svg
                className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5"
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
              <p className="text-xs text-gray-600">
                La distribución de métodos de pago te ayuda a entender las
                preferencias de tus compradores y optimizar tus estrategias de
                venta.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default PaymentMethodsChart
