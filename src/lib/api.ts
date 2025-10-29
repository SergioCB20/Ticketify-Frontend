import axios from 'axios'
import { StorageService } from '../services/storage'

// =========================================================
// 🧩 CONFIGURACIÓN BASE DE AXIOS
// =========================================================
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // permite enviar cookies si tu backend usa refresh con cookies
})

// =========================================================
// ⚙️ VARIABLES DE CONTROL PARA REFRESH
// =========================================================
let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error)
    else prom.resolve(token)
  })
  failedQueue = []
}

// =========================================================
// 🔑 INTERCEPTOR DE REQUEST: AGREGA TOKEN A CADA PETICIÓN
// =========================================================
api.interceptors.request.use(
  async (config) => {
    const token = StorageService.getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('🔐 Usando token:', token.slice(0, 20) + '...')
    }
    return config
  },
  (error) => Promise.reject(error)
)

// =========================================================
// 🚨 INTERCEPTOR DE RESPUESTA: MANEJA ERRORES Y REFRESH TOKEN
// =========================================================
api.interceptors.response.use(
  (response) => response, // ✅ respuestas exitosas pasan normal
  async (error) => {
    const originalRequest = error.config
    const { response } = error

    // No intentar refresh en rutas de auth
    if (
      originalRequest.url?.includes('/auth/login') ||
      originalRequest.url?.includes('/auth/register') ||
      originalRequest.url?.includes('/auth/refresh')
    ) {
      return Promise.reject(error)
    }

    // ------------------------------------------
    // 🔁 CASO 1: Token expiró (401 Unauthorized)
    // ------------------------------------------
    if (response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      if (isRefreshing) {
        // 🧩 Si ya se está haciendo refresh, encolamos la petición
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      isRefreshing = true
      const refreshToken = StorageService.getRefreshToken()

      if (refreshToken) {
        try {
          // ------------------------------------------
          // 🔄 Refrescar token
          // ------------------------------------------
          const { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/auth/refresh`,
            { refreshToken },
            { withCredentials: true }
          )

          // 🧠 Soporta ambos formatos: camelCase o snake_case
          const newAccess = data.accessToken || data.access_token
          const newRefresh = data.refreshToken || data.refresh_token

          if (!newAccess) throw new Error('No se recibió un nuevo token de acceso')

          // ✅ Guardar nuevos tokens usando las llaves de tu StorageService
          StorageService.setAccessToken(newAccess)
          if (newRefresh) StorageService.setRefreshToken(newRefresh)

          console.log('🔑 Nuevo token guardado:', newAccess.slice(0, 20) + '...')

          // Procesar peticiones pendientes
          processQueue(null, newAccess)
          isRefreshing = false

          // Actualizar header del request original
          originalRequest.headers.Authorization = `Bearer ${newAccess}`

          // Reintentar la petición original
          return api(originalRequest)
        } catch (refreshError) {
          console.error('❌ Error al refrescar el token:', refreshError)

          processQueue(refreshError, null)
          isRefreshing = false
          StorageService.clearAll()

          // Redirigir al login si el refresh falla
          if (
            typeof window !== 'undefined' &&
            !window.location.pathname.includes('/login') &&
            !window.location.pathname.includes('/register')
          ) {
            window.location.href = '/login'
          }

          return Promise.reject(refreshError)
        }
      } else {
        // 🚫 No hay refresh token guardado → cerrar sesión
        isRefreshing = false
        StorageService.clearAll()

        if (
          typeof window !== 'undefined' &&
          !window.location.pathname.includes('/login') &&
          !window.location.pathname.includes('/register')
        ) {
          window.location.href = '/login'
        }
      }
    }

    // Otros errores pasan normal
    return Promise.reject(error)
  }
)

// =========================================================
// 🧾 TIPOS Y UTILIDADES DE ERRORES
// =========================================================
export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  status?: number
}

export const handleApiError = (error: any): ApiError => {
  if (error.response?.data) {
    const errorData = error.response.data
    return {
      message: errorData.detail || errorData.message || 'Error en el servidor',
      errors: errorData.errors,
      status: error.response.status,
    }
  }

  if (error.request) {
    return {
      message: 'Error de conexión. Verifica tu conexión a internet.',
      status: 0,
    }
  }

  return {
    message: error.message || 'Error desconocido',
  }
}

export default api
