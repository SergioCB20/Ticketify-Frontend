'use client'

import React, { useState } from 'react'
import { BillingTransaction } from '@/services/api/billing'
import {
  formatCurrency,
  formatDateTime,
  getPaymentMethodName,
  getStatusColor,
  getStatusText,
} from '@/lib/billingUtils'

interface TransactionsTableProps {
  transactions: BillingTransaction[]
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
}) => {
  const [filter, setFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Filtrar transacciones
  const filteredTransactions = transactions.filter((transaction) => {
    if (filter === 'all') return true
    return transaction.status === filter
  })

  // Ordenar transacciones
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(a.date).getTime()
      const dateB = new Date(b.date).getTime()
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA
    } else {
      return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount
    }
  })

  const handleSort = (column: 'date' | 'amount') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('desc')
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Header con filtros */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Transacciones ({transactions.length})
          </h3>

          {/* Filtros */}
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Filtrar:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">Todos</option>
              <option value="approved">Aprobados</option>
              <option value="pending">Pendientes</option>
              <option value="rejected">Rechazados</option>
              <option value="refunded">Reembolsados</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center gap-1">
                  Fecha
                  {sortBy === 'date' && (
                    <svg
                      className={`w-4 h-4 ${sortOrder === 'asc' ? 'rotate-180' : ''}`}
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
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Comprador
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center gap-1">
                  Monto
                  {sortBy === 'amount' && (
                    <svg
                      className={`w-4 h-4 ${sortOrder === 'asc' ? 'rotate-180' : ''}`}
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
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Método
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Comisiones
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Neto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedTransactions.map((transaction) => {
              const statusColor = getStatusColor(transaction.status)
              return (
                <tr key={transaction.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDateTime(transaction.date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {transaction.buyerEmail}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {getPaymentMethodName(transaction.paymentMethod)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                    -{' '}
                    {formatCurrency(
                      transaction.mpCommission + transaction.platformCommission
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                    {formatCurrency(transaction.netAmount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor.bg} ${statusColor.text} border ${statusColor.border}`}
                    >
                      {getStatusText(transaction.status)}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Vista Mobile (Cards) */}
      <div className="md:hidden divide-y divide-gray-200">
        {sortedTransactions.map((transaction) => {
          const statusColor = getStatusColor(transaction.status)
          return (
            <div key={transaction.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {transaction.buyerEmail}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDateTime(transaction.date)}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor.bg} ${statusColor.text} border ${statusColor.border}`}
                >
                  {getStatusText(transaction.status)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-3">
                <div>
                  <p className="text-xs text-gray-500">Monto</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Neto</p>
                  <p className="text-sm font-semibold text-green-600">
                    {formatCurrency(transaction.netAmount)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Método</p>
                  <p className="text-sm text-gray-900">
                    {getPaymentMethodName(transaction.paymentMethod)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Comisiones</p>
                  <p className="text-sm text-red-600">
                    -{' '}
                    {formatCurrency(
                      transaction.mpCommission + transaction.platformCommission
                    )}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {sortedTransactions.length === 0 && (
        <div className="p-12 text-center">
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
            No hay transacciones
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            No se encontraron transacciones con el filtro seleccionado
          </p>
        </div>
      )}
    </div>
  )
}

export default TransactionsTable
