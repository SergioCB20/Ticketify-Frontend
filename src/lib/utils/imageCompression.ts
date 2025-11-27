/**
 * Comprime una imagen a un tamaño máximo y calidad especificada
 * @param file - Archivo de imagen a comprimir
 * @param maxSize - Tamaño máximo en píxeles (ancho y alto)
 * @param quality - Calidad de compresión (0-1)
 * @returns Promise con el data URL de la imagen comprimida
 */
export const compressImage = (
  file: File,
  maxSize: number = 256,
  quality: number = 0.6
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        // Calcular nuevas dimensiones manteniendo proporción
        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width)
            width = maxSize
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height)
            height = maxSize
          }
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('No se pudo obtener el contexto del canvas'))
          return
        }

        // Dibujar la imagen redimensionada
        ctx.drawImage(img, 0, 0, width, height)

        // Convertir a base64 con calidad reducida y formato WebP
        try {
          const compressedBase64 = canvas.toDataURL('image/webp', quality)
          resolve(compressedBase64)
        } catch (error) {
          reject(error)
        }
      }

      img.onerror = () => {
        reject(new Error('Error al cargar la imagen'))
      }

      img.src = e.target?.result as string
    }

    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'))
    }

    reader.readAsDataURL(file)
  })
}

/**
 * Valida si un archivo es una imagen
 * @param file - Archivo a validar
 * @returns true si es una imagen
 */
export const isImageFile = (file: File): boolean => {
  return file.type.startsWith('image/')
}

/**
 * Valida el tamaño del archivo
 * @param file - Archivo a validar
 * @param maxSizeMB - Tamaño máximo en MB
 * @returns true si el archivo está dentro del límite
 */
export const validateFileSize = (file: File, maxSizeMB: number = 5): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}

/**
 * Obtiene información sobre una imagen
 * @param file - Archivo de imagen
 * @returns Promise con las dimensiones de la imagen
 */
export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      
      img.onload = () => {
        resolve({ width: img.width, height: img.height })
      }
      
      img.onerror = () => {
        reject(new Error('Error al cargar la imagen'))
      }
      
      img.src = e.target?.result as string
    }
    
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'))
    }
    
    reader.readAsDataURL(file)
  })
}
