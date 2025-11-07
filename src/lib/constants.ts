/**
 * Constantes de la aplicación
 */

// API Configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
export const API_VERSION = '/api/v1'
export const API_BASE_URL = `${API_URL}${API_VERSION}`

// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  REFRESH: `${API_BASE_URL}/auth/refresh`,
  ME: `${API_BASE_URL}/auth/me`,
}

// Events endpoints
export const EVENT_ENDPOINTS = {
  LIST: `${API_BASE_URL}/events`,
  SEARCH: `${API_BASE_URL}/events/search`,
  DETAIL: (id: string) => `${API_BASE_URL}/events/${id}`,
  CREATE: `${API_BASE_URL}/events`,
  UPDATE: (id: string) => `${API_BASE_URL}/events/${id}`,
  DELETE: (id: string) => `${API_BASE_URL}/events/${id}`,
  PUBLISH: (id: string) => `${API_BASE_URL}/events/${id}/publish`,
  CANCEL: (id: string) => `${API_BASE_URL}/events/${id}/cancel`,
}

// Categories endpoints
export const CATEGORY_ENDPOINTS = {
  LIST: `${API_BASE_URL}/categories`,
  DETAIL: (id: string) => `${API_BASE_URL}/categories/${id}`,
}

// Admin endpoints
export const ADMIN_ENDPOINTS = {
  USERS: `${API_BASE_URL}/admin/users`,
  USER_DETAIL: (id: string) => `${API_BASE_URL}/admin/users/${id}`,
  BAN_USER: (id: string) => `${API_BASE_URL}/admin/users/${id}/ban`,
  STATS: `${API_BASE_URL}/admin/stats`,
}

// Storage keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
  THEME: 'theme',
  LANGUAGE: 'language',
}

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
}

// Date formats
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  DISPLAY_WITH_TIME: 'DD/MM/YYYY HH:mm',
  ISO: 'YYYY-MM-DD',
  API: 'YYYY-MM-DDTHH:mm:ss',
}

// Event status
export const EVENT_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
} as const

// User roles
export const USER_ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  SUPPORT_ADMIN: 'SUPPORT_ADMIN',
  SECURITY_ADMIN: 'SECURITY_ADMIN',
  CONTENT_ADMIN: 'CONTENT_ADMIN',
  ORGANIZER: 'ORGANIZER',
  ATTENDEE: 'ATTENDEE',
} as const

// Document types
export const DOCUMENT_TYPES = {
  DNI: 'DNI',
  CE: 'CE',
  PASSPORT: 'Pasaporte',
} as const

// Gender options
export const GENDER_OPTIONS = {
  MALE: 'masculino',
  FEMALE: 'femenino',
  OTHER: 'otro',
  PREFER_NOT_TO_SAY: 'prefiero-no-decir',
} as const

// User types
export const USER_TYPES = {
  ATTENDEE: 'ATTENDEE',
  ORGANIZER: 'ORGANIZER',
} as const