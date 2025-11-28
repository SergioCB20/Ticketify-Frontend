/**
 * Formatea un número como moneda en Soles Peruanos
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Formatea una fecha en formato local
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

/**
 * Formatea una fecha con hora
 */
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-PE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

/**
 * Formatea un porcentaje
 */
export const formatPercentage = (value: number): string => {
  return `${Number(value).toFixed(1)}%`
}

/**
 * Obtiene el nombre del método de pago en español
 */
export const getPaymentMethodName = (method: string): string => {
  const methods: Record<string, string> = {
    credit_card: 'Tarjeta de Crédito',
    debit_card: 'Tarjeta de Débito',
    bank_transfer: 'Transferencia Bancaria',
    cash: 'Efectivo',
    digital_wallet: 'Billetera Digital',
  }
  return methods[method] || method
}

/**
 * Obtiene el color del badge según el estado
 */
export const getStatusColor = (
  status: string
): { bg: string; text: string; border: string } => {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    approved: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-200',
    },
    pending: {
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      border: 'border-yellow-200',
    },
    rejected: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-200',
    },
    refunded: {
      bg: 'bg-gray-100',
      text: 'text-gray-800',
      border: 'border-gray-200',
    },
    charged_back: {
      bg: 'bg-orange-100',
      text: 'text-orange-800',
      border: 'border-orange-200',
    },
  }
  return colors[status] || colors.pending
}

/**
 * Obtiene el texto del estado en español
 */
export const getStatusText = (status: string): string => {
  const texts: Record<string, string> = {
    approved: 'Aprobado',
    pending: 'Pendiente',
    rejected: 'Rechazado',
    refunded: 'Reembolsado',
    charged_back: 'Contracargo',
  }
  return texts[status] || status
}

/**
 * Descarga un archivo blob
 */
export const downloadFile = (blob: Blob, filename: string): void => {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}
