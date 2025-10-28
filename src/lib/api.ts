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
    const { response } = error
    
    if (response?.status === 401) {
      // Token expirado o no válido
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
          
          // Reintentar la petición original
          error.config.headers.Authorization = `Bearer ${data.accessToken}`
          return api.request(error.config)
        } catch (refreshError) {
          // Si el refresh falla, limpiar todo y redirigir al login
          StorageService.clearAll()
          window.location.href = '/login'
        }
      } else if (typeof window !== 'undefined') {
        // No hay refresh token, limpiar y redirigir
        StorageService.clearAll()
        window.location.href = '/login'
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
