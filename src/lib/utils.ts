import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Función para combinar clases de Tailwind CSS
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Función para formatear fechas
export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions) {
  const dateObject = typeof date === 'string' ? new Date(date) : date
  
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...options,
  }).format(dateObject)
}

// Función para formatear precios
export function formatPrice(price: number, currency: string = 'PEN') {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(price)
}

// Función para generar IDs únicos
export function generateId(length: number = 8): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  
  return result
}

// Función para truncar texto
export function truncate(text: string, length: number = 100): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

// Función para capitalizar primera letra
export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

// Función para validar email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Función para delay/sleep
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Función para crear URL de parámetros de búsqueda
export function createSearchParams(params: Record<string, any>): string {
  const searchParams = new URLSearchParams()
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, String(value))
    }
  })
  
  return searchParams.toString()
}

// Función para obtener iniciales de un nombre
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Función para validar contraseña fuerte
export function isStrongPassword(password: string): {
  isStrong: boolean
  issues: string[]
} {
  const issues: string[] = []
  
  if (password.length < 8) {
    issues.push('Debe tener al menos 8 caracteres')
  }
  
  if (!/[A-Z]/.test(password)) {
    issues.push('Debe contener al menos una letra mayúscula')
  }
  
  if (!/[a-z]/.test(password)) {
    issues.push('Debe contener al menos una letra minúscula')
  }
  
  if (!/\d/.test(password)) {
    issues.push('Debe contener al menos un número')
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    issues.push('Debe contener al menos un carácter especial')
  }
  
  return {
    isStrong: issues.length === 0,
    issues
  }
}
