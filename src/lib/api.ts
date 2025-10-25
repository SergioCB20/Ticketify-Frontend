import axios from 'axios'
import { getSession } from 'next-auth/react'

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
    // Si estamos en el cliente, obtenemos la sesión
    if (typeof window !== 'undefined') {
      const session = await getSession()
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`
      }
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
      if (typeof window !== 'undefined') {
        // Redirigir a login o refrescar token
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
    return {
      message: error.response.data.message || 'Error en el servidor',
      errors: error.response.data.errors,
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
