# Sistema de Búsqueda Avanzada - Ticketify

## Cambios Implementados

### 1. Nuevo Componente: AdvancedSearch

Se ha creado un componente de búsqueda avanzada con filtros modales, similar al diseño de Joinnus.

**Ubicación:** `src/components/ui/advanced-search.tsx`

**Características:**
- Barra de búsqueda con apertura de modal al hacer clic
- Filtros por categorías (con selección múltiple)
- Rango de precios (mínimo y máximo)
- Rango de fechas (inicio y fin)
- Ubicación por texto
- Indicador visual de filtros activos
- Cierre automático al hacer clic fuera del modal
- Animación suave de apertura/cierre

### 2. Navbar Actualizado

**Ubicación:** `src/components/layout/navbar.tsx`

**Mejoras:**
- Integración del componente AdvancedSearch
- Prop `showSearch` para mostrar/ocultar la búsqueda
- Prop `categories` para pasar categorías dinámicamente
- Búsqueda visible solo en desktop (lg+) dentro del navbar
- Búsqueda debajo del navbar en mobile
- Navegación automática a `/events` con parámetros de búsqueda

### 3. Layout de Eventos

**Ubicación:** `src/app/events/layout.tsx`

**Funcionalidad:**
- Layout específico para páginas de eventos
- Carga automática de categorías desde el backend
- Fallback a categorías por defecto si falla la petición
- Navbar con búsqueda habilitada
- Footer incluido

### 4. Página de Eventos Actualizada

**Ubicación:** `src/app/events/page.tsx`

**Mejoras:**
- Lectura de parámetros de búsqueda de la URL
- Filtrado dinámico de eventos basado en:
  - Texto de búsqueda (título y descripción)
  - Categorías seleccionadas
  - Rango de precios
  - Rango de fechas
  - Ubicación
- Indicadores visuales de resultados filtrados
- Mensaje cuando no hay resultados
- Botón para limpiar filtros

### 5. Animaciones CSS

**Ubicación:** `src/app/globals.css`

**Agregado:**
- Animación `animate-slide-down` para transiciones suaves
- Keyframes personalizados para el modal de filtros

## Uso

### En cualquier página que necesite búsqueda:

```tsx
import { Navbar } from '@/components/layout/navbar'

// Con búsqueda
<Navbar showSearch={true} categories={categoriesArray} />

// Sin búsqueda
<Navbar />
```

### En la página de eventos:

El layout ya incluye el Navbar con búsqueda, solo necesitas:

```tsx
// src/app/events/page.tsx
export default function EventsPage() {
  // Tu código aquí
  // El layout maneja el Navbar automáticamente
}
```

### Estructura de Categorías

Las categorías deben tener el siguiente formato:

```typescript
const categories = [
  { 
    id: 'uuid-1', 
    name: 'Música', 
    icon: '🎵' 
  },
  { 
    id: 'uuid-2', 
    name: 'Deportes', 
    icon: '⚽' 
  },
  // ...
]
```

### Parámetros de URL

El sistema genera URLs con los siguientes parámetros:

- `q`: Texto de búsqueda
- `categories`: IDs de categorías separados por comas
- `minPrice`: Precio mínimo
- `maxPrice`: Precio máximo
- `startDate`: Fecha de inicio (YYYY-MM-DD)
- `endDate`: Fecha de fin (YYYY-MM-DD)
- `location`: Ubicación

Ejemplo:
```
/events?q=concierto&categories=uuid-1,uuid-2&minPrice=50&maxPrice=200
```

## API del Backend

El componente espera que el backend tenga el endpoint:

```
GET http://localhost:8000/api/v1/categories
```

**Respuesta esperada:**

```json
[
  {
    "id": "uuid",
    "name": "Música",
    "slug": "musica",
    "icon": "🎵",
    "color": "#FF5733",
    "isActive": true
  }
]
```

## Próximos Pasos

1. **Backend:** Implementar el endpoint de búsqueda con filtros:
   ```
   GET /api/v1/events?q=...&categories=...&minPrice=...&maxPrice=...
   ```

2. **Optimización:** Agregar debounce a la búsqueda de texto

3. **UX:** Agregar indicadores de "cargando" durante las búsquedas

4. **Persistencia:** Guardar filtros seleccionados en localStorage

5. **Analytics:** Trackear búsquedas populares y filtros más usados

## Notas Técnicas

- El componente usa React hooks (useState, useEffect, useRef)
- Manejo de eventos fuera del modal para cerrar automáticamente
- Responsive design con diferentes layouts para mobile y desktop
- Integración completa con Next.js App Router
- TypeScript para type safety
- Tailwind CSS para estilos

## Testing

Para probar el sistema:

1. Iniciar el backend en `http://localhost:8000`
2. Iniciar el frontend en `http://localhost:3000`
3. Navegar a `/events`
4. Hacer clic en la barra de búsqueda
5. Seleccionar filtros
6. Hacer clic en "Buscar"
7. Verificar que la URL se actualice con los parámetros
8. Verificar que los eventos se filtren correctamente
