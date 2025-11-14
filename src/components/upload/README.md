# Componente FileUploader - Guía de Uso

## 📖 Descripción

`FileUploader` es un componente reutilizable para la carga de archivos (imágenes y videos) con previsualización, validación y manejo de errores integrado.

## ✨ Características

- ✅ Soporte para imágenes y videos
- ✅ Previsualización de archivos
- ✅ Drag & Drop
- ✅ Validación de tamaño
- ✅ Manejo de errores
- ✅ Indicador de carga
- ✅ Botones de cambiar y eliminar
- ✅ Totalmente personalizable

## 🚀 Uso Básico

### Importar el componente

```typescript
import { FileUploader } from '@/components/upload'
```

### Ejemplo 1: Carga de Imagen Simple

```typescript
import { useState } from 'react'
import { FileUploader } from '@/components/upload'

export default function MyComponent() {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [error, setError] = useState<string>('')

  const handleImageChange = (file: File | null) => {
    setError('')
    
    if (file && file.size > 5 * 1024 * 1024) {
      setError('La imagen no debe superar los 5MB')
      return
    }
    
    setImageFile(file)
  }

  return (
    <FileUploader
      label="Imagen del Evento"
      required
      accept="image"
      maxSizeMB={5}
      value={imageFile}
      preview={imagePreview}
      onChange={handleImageChange}
      onPreviewChange={setImagePreview}
      error={error}
      hint="Recomendado: 836x522px"
    />
  )
}
```

### Ejemplo 2: Carga de Video

```typescript
import { useState } from 'react'
import { FileUploader } from '@/components/upload'

export default function VideoUpload() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)

  return (
    <FileUploader
      label="Video Promocional"
      accept="video"
      maxSizeMB={50}
      value={videoFile}
      preview={videoPreview}
      onChange={setVideoFile}
      onPreviewChange={setVideoPreview}
      uploading={uploading}
    />
  )
}
```

### Ejemplo 3: Carga con Validación y Upload

```typescript
import { useState } from 'react'
import { FileUploader } from '@/components/upload'
import { uploadImage } from '@/services/api/upload'

export default function ImageUploadWithAPI() {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string>('')
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null)

  const handleImageChange = (file: File | null) => {
    setError('')
    setUploadedUrl(null)
    
    if (file && file.size > 5 * 1024 * 1024) {
      setError('La imagen no debe superar los 5MB')
      return
    }
    
    setImageFile(file)
  }

  const handleUpload = async () => {
    if (!imageFile) return
    
    setUploading(true)
    setError('')
    
    try {
      const response = await uploadImage(imageFile)
      setUploadedUrl(response.url)
      console.log('Imagen subida:', response.url)
    } catch (err: any) {
      setError(err.message || 'Error al subir la imagen')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <FileUploader
        label="Imagen"
        required
        accept="image"
        maxSizeMB={5}
        value={imageFile}
        preview={imagePreview}
        onChange={handleImageChange}
        onPreviewChange={setImagePreview}
        error={error}
        uploading={uploading}
      />
      
      {imageFile && !uploadedUrl && (
        <button 
          onClick={handleUpload} 
          disabled={uploading}
          className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg"
        >
          {uploading ? 'Subiendo...' : 'Subir Imagen'}
        </button>
      )}
      
      {uploadedUrl && (
        <p className="mt-2 text-sm text-green-600">
          ✓ Imagen subida exitosamente
        </p>
      )}
    </div>
  )
}
```

### Ejemplo 4: Formulario Completo con Múltiples Archivos

```typescript
import { useState } from 'react'
import { FileUploader } from '@/components/upload'
import { uploadImage, uploadVideo } from '@/services/api/upload'

export default function EventForm() {
  // Image state
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imageError, setImageError] = useState<string>('')
  
  // Video state
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoPreview, setVideoPreview] = useState<string | null>(null)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [videoError, setVideoError] = useState<string>('')

  const handleImageChange = (file: File | null) => {
    setImageError('')
    
    if (file && file.size > 5 * 1024 * 1024) {
      setImageError('La imagen no debe superar los 5MB')
      return
    }
    
    setImageFile(file)
  }

  const handleVideoChange = (file: File | null) => {
    setVideoError('')
    
    if (file && file.size > 50 * 1024 * 1024) {
      setVideoError('El video no debe superar los 50MB')
      return
    }
    
    setVideoFile(file)
  }

  const handleSubmit = async () => {
    const multimediaUrls: string[] = []
    
    // Upload image
    if (imageFile) {
      try {
        setUploadingImage(true)
        const response = await uploadImage(imageFile)
        multimediaUrls.push(response.url)
      } catch (err: any) {
        setImageError('Error al subir la imagen')
        return
      } finally {
        setUploadingImage(false)
      }
    }
    
    // Upload video
    if (videoFile) {
      try {
        setUploadingVideo(true)
        const response = await uploadVideo(videoFile)
        multimediaUrls.push(response.url)
      } catch (err: any) {
        setVideoError('Error al subir el video')
        return
      } finally {
        setUploadingVideo(false)
      }
    }
    
    // Continue with form submission...
    console.log('URLs de multimedia:', multimediaUrls)
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleSubmit() }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FileUploader
          label="Imagen del Evento"
          required
          accept="image"
          maxSizeMB={5}
          value={imageFile}
          preview={imagePreview}
          onChange={handleImageChange}
          onPreviewChange={setImagePreview}
          error={imageError}
          uploading={uploadingImage}
          hint="Recomendado: 836x522px"
        />
        
        <FileUploader
          label="Video Promocional"
          accept="video"
          maxSizeMB={50}
          value={videoFile}
          preview={videoPreview}
          onChange={handleVideoChange}
          onPreviewChange={setVideoPreview}
          error={videoError}
          uploading={uploadingVideo}
        />
      </div>
      
      <button 
        type="submit" 
        disabled={uploadingImage || uploadingVideo}
        className="mt-6 px-6 py-3 bg-primary-500 text-white rounded-lg"
      >
        Crear Evento
      </button>
    </form>
  )
}
```

## 📝 Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `label` | `string` | `'Archivo'` | Etiqueta del campo |
| `required` | `boolean` | `false` | Si el campo es obligatorio |
| `accept` | `'image' \| 'video' \| 'both'` | `'both'` | Tipos de archivos aceptados |
| `maxSizeMB` | `number` | `5` | Tamaño máximo en MB |
| `value` | `File \| null` | - | Archivo seleccionado |
| `preview` | `string \| null` | - | URL de previsualización |
| `onChange` | `(file: File \| null) => void` | - | Callback cuando cambia el archivo |
| `onPreviewChange` | `(preview: string \| null) => void` | - | Callback cuando cambia la previsualización |
| `error` | `string` | - | Mensaje de error a mostrar |
| `hint` | `string` | - | Texto de ayuda |
| `disabled` | `boolean` | `false` | Deshabilitar el componente |
| `uploading` | `boolean` | `false` | Mostrar indicador de carga |

## 🎨 Personalización

El componente usa las clases de Tailwind CSS y se integra perfectamente con el diseño de tu aplicación. Puedes extenderlo o crear variantes según tus necesidades.

## 🔍 Validaciones

### Tamaño de Archivo
```typescript
const handleFileChange = (file: File | null) => {
  if (file && file.size > maxSizeMB * 1024 * 1024) {
    setError(`El archivo no debe superar los ${maxSizeMB}MB`)
    return
  }
  setFile(file)
}
```

### Tipo de Archivo
El componente acepta solo los tipos especificados en la prop `accept`:
- `'image'`: JPG, PNG, GIF, WEBP
- `'video'`: MP4, AVI, MOV, WMV, WEBM
- `'both'`: Todos los anteriores

## 🎯 Características Avanzadas

### Drag & Drop
El componente soporta arrastrar y soltar archivos de forma nativa.

### Previsualización Automática
- **Imágenes**: Se muestra una previsualización de la imagen
- **Videos**: Se muestra un reproductor con controles

### Botones de Acción
- **Eliminar**: Quita el archivo seleccionado
- **Cambiar**: Permite seleccionar otro archivo

## 🐛 Manejo de Errores

El componente no maneja errores internamente (excepto drag & drop). Debes manejar las validaciones en el componente padre:

```typescript
const handleFileChange = (file: File | null) => {
  setError('') // Limpiar error anterior
  
  // Validar tamaño
  if (file && file.size > maxSizeMB * 1024 * 1024) {
    setError(`El archivo no debe superar los ${maxSizeMB}MB`)
    return
  }
  
  // Validar tipo (ejemplo adicional)
  if (file && !file.type.startsWith('image/')) {
    setError('Solo se permiten imágenes')
    return
  }
  
  setFile(file)
}
```

## 💡 Tips

1. **Usa estados separados** para archivo y previsualización
2. **Valida en el cliente** antes de subir al servidor
3. **Muestra indicadores de progreso** durante la carga
4. **Maneja errores** de forma clara y amigable
5. **Limpia el estado** cuando sea necesario

## 🔗 Integración con API

```typescript
import { uploadImage, uploadVideo } from '@/services/api/upload'

// Para una imagen
const response = await uploadImage(imageFile)
console.log(response.url) // "/uploads/images/abc-123.jpg"

// Para un video
const response = await uploadVideo(videoFile)
console.log(response.url) // "/uploads/videos/def-456.mp4"
```

## 📚 Recursos

- [FileReader API](https://developer.mozilla.org/en-US/docs/Web/API/FileReader)
- [Drag and Drop API](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API)
- [File API](https://developer.mozilla.org/en-US/docs/Web/API/File)
