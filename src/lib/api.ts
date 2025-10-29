import axios from 'axios'
import { StorageService } from '../services/storage'

// Configuración base de axios
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Flag para evitar múltiples intentos de refresh simultáneos
let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  
  failedQueue = []
}

// Interceptor para agregar el token de autenticación
api.interceptors.request.use(
  async (config) => {
    // Obtener token del localStorage
    const token = StorageService.getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejo de respuestas y errores
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const { response } = error
    
    // No intentar refresh en rutas de autenticación
    if (originalRequest.url?.includes('/auth/login') || 
        originalRequest.url?.includes('/auth/register') ||
        originalRequest.url?.includes('/auth/refresh')) {
      return Promise.reject(error)
    }
    
    if (response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Si ya se está refrescando, encolar la petición
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return api(originalRequest)
        }).catch(err => {
          return Promise.reject(err)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = StorageService.getRefreshToken()
      
      if (refreshToken && typeof window !== 'undefined') {
        try {
          // Intentar refrescar el token
          const { data } = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/auth/refresh`,
            { refreshToken }
          )
          
          // Guardar nuevo token
          StorageService.setAccessToken(data.accessToken)
          if (data.refreshToken) {
            StorageService.setRefreshToken(data.refreshToken)
          }
          
          // Actualizar el token en la petición original
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`
          
          // Procesar la cola de peticiones fallidas
          processQueue(null, data.accessToken)
          
          isRefreshing = false
          
          // Reintentar la petición original
          return api(originalRequest)
        } catch (refreshError) {
          // Si el refresh falla, limpiar todo y redirigir al login
          processQueue(refreshError, null)
          isRefreshing = false
          
          StorageService.clearAll()
          
          // Solo redirigir si no estamos ya en una página de auth
          if (typeof window !== 'undefined' && 
              !window.location.pathname.includes('/login') &&
              !window.location.pathname.includes('/register')) {
            window.location.href = '/login'
          }
          
          return Promise.reject(refreshError)
        }
      } else {
        isRefreshing = false
        
        // No hay refresh token, limpiar y redirigir
        if (typeof window !== 'undefined') {
          StorageService.clearAll()
          
          if (!window.location.pathname.includes('/login') &&
              !window.location.pathname.includes('/register')) {
            window.location.href = '/login'
          }
        }
      }
    }
    
    return Promise.reject(error)
  }
)

// Tipos para las respuestas de la API
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

// Función helper para manejar errores de la API
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
