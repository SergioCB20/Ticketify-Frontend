import React from 'react'
import { formatCurrency } from '@/lib/billingUtils'

interface BillingSummaryCardProps {
  title: string
  value: number
  subtitle?: string
  icon: React.ReactNode
  color?: 'primary' | 'success' | 'warning' | 'info'
  tooltip?: string
}

const BillingSummaryCard: React.FC<BillingSummaryCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = 'primary',
  tooltip,
}) => {
  const colorClasses = {
    primary: {
      bg: 'bg-primary-50',
      icon: 'text-primary-600',
      text: 'text-primary-900',
    },
    success: {
      bg: 'bg-green-50',
      icon: 'text-green-600',
      text: 'text-green-900',
    },
    warning: {
      bg: 'bg-yellow-50',
      icon: 'text-yellow-600',
      text: 'text-yellow-900',
    },
    info: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      text: 'text-blue-900',
    },
  }

  const colors = colorClasses[color]

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            {tooltip && (
              <div className="group relative">
                <svg
                  className="w-4 h-4 text-gray-400 cursor-help"
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
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-48 z-10">
                  {tooltip}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                    <div className="border-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
          <p className={`mt-2 text-3xl font-bold ${colors.text}`}>
            {formatCurrency(value)}
          </p>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
        <div className={`flex-shrink-0 ${colors.bg} p-3 rounded-lg`}>
          <div className={colors.icon}>{icon}</div>
        </div>
      </div>
    </div>
  )
}

export default BillingSummaryCard
