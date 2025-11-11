import api, { handleApiError } from '../../lib/api'

// Types
export interface UploadResponse {
  message: string
  filename: string
  url: string
  size: number
}

export interface MultipleUploadResponse {
  message: string
  uploaded: Array<{
    original_filename: string
    filename: string
    url: string
    type: 'image' | 'video'
    size: number
  }>
  errors?: Array<{
    filename: string
    error: string
  }> | null
}

/**
 * Upload a single image
 */
export const uploadImage = async (file: File): Promise<UploadResponse> => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post<UploadResponse>('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  } catch (error) {
    throw handleApiError(error)
  }
}

/**
 * Upload a single video
 */
export const uploadVideo = async (file: File): Promise<UploadResponse> => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await api.post<UploadResponse>('/upload/video', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  } catch (error) {
    throw handleApiError(error)
  }
}

/**
 * Upload multiple multimedia files (images and videos)
 */
export const uploadMultimedia = async (files: File[]): Promise<MultipleUploadResponse> => {
  try {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })

    const response = await api.post<MultipleUploadResponse>('/upload/multimedia', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  } catch (error) {
    throw handleApiError(error)
  }
}

/**
 * Delete a file
 */
export const deleteFile = async (filename: string): Promise<{ message: string }> => {
  try {
    const response = await api.delete<{ message: string }>(`/upload/${filename}`)
    return response.data
  } catch (error) {
    throw handleApiError(error)
  }
}

/**
 * Get full URL for uploaded file
 */
export const getFileUrl = (relativePath: string): string => {
  const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  return `${baseURL}${relativePath}`
}
