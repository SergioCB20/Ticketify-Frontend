# Implementación de Carga de Multimedia desde PC Local

## 🎯 Resumen de Cambios

Se ha modificado el sistema de creación de eventos para permitir la carga de imágenes y videos desde el PC local del usuario, en lugar de usar URLs externas.

## 📁 Archivos Modificados

### Frontend

#### 1. **Nuevo Servicio de Upload** 
`src/services/api/upload.ts`

Este nuevo archivo contiene las funciones para interactuar con la API de carga de archivos:
- `uploadImage(file)` - Sube una imagen
- `uploadVideo(file)` - Sube un video  
- `uploadMultimedia(files[])` - Sube múltiples archivos
- `deleteFile(filename)` - Elimina un archivo
- `getFileUrl(relativePath)` - Obtiene la URL completa del archivo

#### 2. **Componente de Creación de Eventos**
`src/app/events/crear/page.tsx`

**Nuevas funcionalidades agregadas:**

1. **Estados para manejo de carga y previsualización:**
   ```typescript
   const [uploadingImage, setUploadingImage] = useState(false)
   const [uploadingVideo, setUploadingVideo] = useState(false)
   const [imagePreview, setImagePreview] = useState<string | null>(null)
   const [videoPreview, setVideoPreview] = useState<string | null>(null)
   ```

2. **Previsualización de archivos:**
   - Muestra vista previa de imágenes antes de subir
   - Muestra reproductor de video con controles
   - Permite cambiar o eliminar archivos seleccionados

3. **Carga de archivos al backend:**
   - Antes de crear el evento, los archivos se suben al servidor
   - Se obtienen las URLs de los archivos subidos
   - Estas URLs se envían en el campo `multimedia` del evento

4. **Validaciones mejoradas:**
   - Imágenes: máx. 5MB (JPG, PNG, GIF, WEBP)
   - Videos: máx. 50MB (MP4, AVI, MOV, WMV, WEBM)
   - Mensajes de error claros
   - Indicadores de progreso durante la carga

5. **Funciones de manejo:**
   ```typescript
   handleImageUpload()    // Carga y previsualiza imagen
   handleVideoUpload()    // Carga y previsualiza video
   handleRemoveImage()    // Elimina imagen seleccionada
   handleRemoveVideo()    // Elimina video seleccionado
   ```

### Backend

El backend ya tenía implementado el sistema de carga, ubicado en:
- `app/api/upload.py` - Endpoints para carga de archivos
- `uploads/` - Directorio donde se almacenan los archivos

**Endpoints disponibles:**
- `POST /api/upload/image` - Sube una imagen
- `POST /api/upload/video` - Sube un video
- `POST /api/upload/multimedia` - Sube múltiples archivos
- `DELETE /api/upload/{filename}` - Elimina un archivo
- `GET /uploads/{tipo}/{filename}` - Sirve archivos estáticos

## 🎨 Características de la Interfaz

### Vista Antes de Seleccionar Archivo
- Área con borde punteado
- Icono representativo (📷 para imagen, 🎥 para video)
- Botón "Cargar Imagen/Video"
- Información sobre formatos y tamaño máximo

### Vista Después de Seleccionar Archivo

**Para Imágenes:**
- Previsualización de la imagen seleccionada
- Botón rojo (X) en la esquina superior derecha para eliminar
- Al pasar el mouse: overlay oscuro con botón "Cambiar Imagen"
- Badge con el nombre del archivo en la parte inferior

**Para Videos:**
- Reproductor de video con controles
- Botón rojo (X) y botón "Cambiar" en la esquina superior derecha
- Nombre del archivo debajo del reproductor

### Indicadores de Carga
- Mensaje "⏳ Subiendo imagen..." cuando se está cargando
- Mensaje "⏳ Subiendo video..." cuando se está cargando
- Deshabilitación de campos durante la carga

## 📝 Flujo de Creación de Evento

1. Usuario completa el formulario del evento
2. Usuario selecciona imagen (obligatorio)
3. Usuario selecciona video (opcional)
4. Se muestra previsualización de los archivos
5. Usuario hace clic en "Crear Evento"
6. **Nuevo flujo:**
   - Se sube la imagen al servidor → obtiene URL
   - Se sube el video al servidor (si existe) → obtiene URL
   - Se crea el evento con las URLs de multimedia
   - Se crean los tipos de entrada
   - Redirección al detalle del evento

## 🧪 Cómo Probar

### Requisitos Previos
1. Backend corriendo en `http://localhost:8000`
2. Frontend corriendo en `http://localhost:3000`
3. Usuario autenticado

### Pasos de Prueba

1. **Ir a crear evento:**
   ```
   http://localhost:3000/events/crear
   ```

2. **Probar carga de imagen:**
   - Hacer clic en el área de carga de imagen
   - Seleccionar una imagen JPG/PNG (< 5MB)
   - Verificar que aparezca la previsualización
   - Probar el botón de eliminar (X)
   - Volver a cargar otra imagen

3. **Probar carga de video:**
   - Hacer clic en el área de carga de video
   - Seleccionar un video MP4 (< 50MB)
   - Verificar que aparezca el reproductor
   - Reproducir el video para confirmar
   - Probar los botones de eliminar y cambiar

4. **Probar validaciones:**
   - Intentar subir una imagen muy grande (> 5MB)
   - Intentar subir un video muy grande (> 50MB)
   - Verificar mensajes de error

5. **Crear evento completo:**
   - Completar todos los campos requeridos
   - Cargar imagen
   - Cargar video (opcional)
   - Agregar al menos un tipo de entrada
   - Hacer clic en "Crear Evento"
   - Verificar que se muestre "Subiendo imagen..."
   - Verificar que se muestre "Subiendo video..." (si aplica)
   - Confirmar creación exitosa

6. **Verificar archivos subidos:**
   - Navegar a `http://localhost:8000/uploads/images/` en el navegador
   - Verificar que las imágenes estén accesibles
   - Navegar a `http://localhost:8000/uploads/videos/`
   - Verificar que los videos estén accesibles

## 🔍 Validaciones Implementadas

### Imagen
- ✅ Formato: JPG, JPEG, PNG, GIF, WEBP
- ✅ Tamaño máximo: 5MB
- ✅ Obligatoria para crear evento
- ✅ Solo una imagen por evento

### Video
- ✅ Formato: MP4, AVI, MOV, WMV, WEBM
- ✅ Tamaño máximo: 50MB
- ✅ Opcional
- ✅ Solo un video por evento

### Proceso de Carga
- ✅ Previsualización antes de subir
- ✅ Validación de tamaño en el cliente
- ✅ Validación de tamaño en el servidor
- ✅ Validación de formato en el servidor
- ✅ Manejo de errores con mensajes claros
- ✅ Indicadores de progreso

## 🐛 Manejo de Errores

El sistema maneja varios tipos de errores:

1. **Error de tamaño de archivo:**
   - "La imagen no debe superar los 5MB"
   - "El video no debe superar los 50MB"

2. **Error de formato:**
   - Mensaje del servidor con formatos permitidos

3. **Error de red:**
   - "Error al subir la imagen. Intenta de nuevo."
   - "Error al subir el video. Intenta de nuevo."

4. **Error de autenticación:**
   - El usuario debe estar autenticado para subir archivos

## 💾 Almacenamiento de Archivos

**Backend:**
- Directorio: `Ticketify-Backend/uploads/`
- Subdirectorios: `images/` y `videos/`
- Nombres únicos generados con UUID
- Estructura: `{uuid}.{extensión}`

**Base de Datos:**
- Los eventos guardan las URLs en el campo `multimedia` (array de strings)
- Ejemplo: `["/uploads/images/abc-123.jpg", "/uploads/videos/def-456.mp4"]`

## 🚀 Próximas Mejoras Sugeridas

1. **Optimización de imágenes:**
   - Redimensionar automáticamente a 836x522px
   - Comprimir imágenes para reducir tamaño
   - Generar thumbnails

2. **Múltiples imágenes:**
   - Permitir galería de imágenes
   - Carrusel en la vista del evento

3. **Drag & Drop:**
   - Arrastrar y soltar archivos
   - Interfaz más intuitiva

4. **Barra de progreso:**
   - Mostrar porcentaje de carga
   - Especialmente útil para videos grandes

5. **Edición de eventos:**
   - Permitir cambiar multimedia de eventos existentes
   - Eliminar archivos antiguos del servidor

6. **CDN/Cloud Storage:**
   - Integrar con servicios como AWS S3, Cloudinary
   - Mejor rendimiento y escalabilidad

## 📚 Recursos Adicionales

- **FileReader API:** Para previsualización en el cliente
- **FormData API:** Para envío de archivos multipart
- **FastAPI UploadFile:** Manejo de archivos en el backend
- **StaticFiles:** Servir archivos estáticos con FastAPI

## ✅ Checklist de Implementación

- [x] Crear servicio de upload en el frontend
- [x] Agregar estados para manejo de archivos
- [x] Implementar previsualización de imágenes
- [x] Implementar previsualización de videos
- [x] Agregar funcionalidad de eliminación
- [x] Integrar carga de archivos en el flujo de creación
- [x] Agregar indicadores de progreso
- [x] Manejar errores apropiadamente
- [x] Validaciones de tamaño y formato
- [x] Documentación completa

## 🎉 Conclusión

La funcionalidad de carga de multimedia desde PC local está completamente implementada y lista para usar. Los usuarios ahora pueden:
- Seleccionar imágenes y videos desde su computadora
- Ver previsualizaciones antes de crear el evento
- Recibir feedback visual durante la carga
- Manejar errores de forma clara

El sistema es robusto, seguro y proporciona una excelente experiencia de usuario.
