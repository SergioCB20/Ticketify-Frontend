# 📖 Guía de Desarrollo - Ticketify Frontend

## 👥 Para el Equipo de Desarrollo

Esta guía está diseñada para que cualquier miembro del equipo pueda contribuir al proyecto **sin necesidad de ser experto en desarrollo web**. Aprovecharemos IA (Claude, ChatGPT, etc.) como herramienta principal de desarrollo.

---

## 📁 Estructura del Proyecto

### Carpetas Principales

```
ticketify-frontend/
├── src/
│   ├── app/                    # 📄 Páginas de la aplicación
│   │   ├── page.tsx           # Página principal (Home)
│   │   ├── layout.tsx         # Layout global (envuelve todas las páginas)
│   │   ├── (auth)/            # Grupo de rutas de autenticación
│   │   │   ├── login/
│   │   │   └── register/
│   │   └── events/            # Páginas de eventos
│   │
│   ├── components/            # 🧩 Componentes reutilizables
│   │   ├── ui/               # Componentes básicos (Button, Card, Input)
│   │   ├── layout/           # Componentes de layout (Navbar, Footer)
│   │   └── events/           # Componentes específicos de eventos
│   │
│   ├── lib/                  # 🛠️ Utilidades y configuraciones
│   │   ├── utils.ts          # Funciones auxiliares
│   │   ├── types/            # Tipos TypeScript
│   │   └── constants.ts      # Constantes de la app
│   │
│   ├── services/             # 🌐 Servicios (API, Storage)
│   │   └── api/              # Llamadas al backend
│   │
│   └── store/                # 💾 Estado global (Zustand)
│
├── public/                   # 📸 Archivos estáticos (imágenes, íconos)
├── DESIGN_SYSTEM.md         # 🎨 Sistema de diseño (LEER PRIMERO)
└── package.json             # Dependencias del proyecto
```

### ¿Qué hace cada carpeta?

| Carpeta | Propósito | Cuándo usarla |
|---------|-----------|---------------|
| `app/` | Crear páginas nuevas | Necesitas una ruta nueva (ej: `/about`) |
| `components/ui/` | Componentes básicos reutilizables | Crear botones, inputs, cards |
| `components/layout/` | Layout y navegación | Header, Footer, Sidebar |
| `components/events/` | Componentes de dominio | EventCard, EventDetail, etc. |
| `services/api/` | Comunicación con backend | Fetch de datos, POST, PUT, DELETE |
| `store/` | Estado compartido | Datos que múltiples componentes usan |

---

## 🎨 Sistema de Diseño

**IMPORTANTE**: Antes de crear cualquier componente o página, lee el archivo `DESIGN_SYSTEM.md`.

### Colores Principales

```tsx
// Primario (Violeta)
className="bg-primary-500 text-white"

// Secundario (Cyan)
className="bg-secondary-500 text-white"

// Estados
className="bg-success" // Verde
className="bg-error"   // Rojo
className="bg-warning" // Amarillo
```

### Componentes Disponibles

Ya existen estos componentes listos para usar:

1. **Button** - Botones con diferentes estilos
2. **Card** - Tarjetas para contenido
3. **Badge** - Insignias/etiquetas
4. **Avatar** - Imágenes de usuario
5. **Container** - Wrapper para centrar contenido
6. **EventCard** - Tarjeta específica para eventos
7. **Navbar** - Barra de navegación
8. **Footer** - Pie de página

---

## 🤖 Workflow con IA

### Paso 1: Planificar

Antes de generar código, define:
- ¿Qué página o componente necesitas crear?
- ¿Qué funcionalidad debe tener?
- ¿Qué datos necesita mostrar?

### Paso 2: Crear Prompt Efectivo

#### Template de Prompt para Componentes

```
Crea un componente [NOMBRE] en React + TypeScript para Ticketify.

Contexto:
- Es un componente para [DESCRIPCIÓN]
- Se usará en [DÓNDE SE USARÁ]

Requisitos técnicos:
1. React functional component con TypeScript
2. Usar Tailwind CSS (solo clases del core, sin @apply)
3. Seguir el sistema de diseño de Ticketify:
   - Color primario: primary-500 (#a855f7)
   - Color secundario: secondary-500 (#06b6d4)
   - Espaciado: múltiplos de 4 (p-4, gap-6, etc.)
   - Bordes redondeados: rounded-lg o rounded-xl
4. Responsive design (mobile-first)
5. Incluir estados: hover, active, disabled

Funcionalidades:
- [Lista funcionalidades específicas]

Props esperadas:
- [Lista de props que necesita]

Ejemplo de uso:
<NombreComponente prop1="valor" prop2={true} />
```

#### Template de Prompt para Páginas

```
Crea la página [NOMBRE] para Ticketify en Next.js 14 App Router.

Estructura:
1. Hero section: [descripción]
2. Sección principal: [descripción]
3. Call to Action: [descripción]

Requisitos:
- Usar componentes existentes de src/components/
- Layout: Navbar + contenido + Footer
- Usar Container para centrar contenido
- Responsive: mobile (sm:), tablet (md:), desktop (lg:)
- Colores del sistema de diseño (primary/secondary)

Componentes a incluir:
- [Lista de componentes]

Datos mock:
- [Describe datos de ejemplo necesarios]
```

### Paso 3: Generar Código

1. Copia el prompt en tu IA favorita (Claude, ChatGPT, etc.)
2. Revisa el código generado
3. Verifica que:
   - ✅ Usa colores del sistema (primary-*, secondary-*)
   - ✅ Es responsive
   - ✅ Tiene tipos TypeScript correctos
   - ✅ No usa 'any' en TypeScript
   - ✅ Usa componentes existentes cuando sea posible

### Paso 4: Integrar

```bash
# 1. Crear archivo en la ubicación correcta
# Ejemplo: src/components/events/event-list.tsx

# 2. Copiar código generado

# 3. Ajustar imports si es necesario
```

### Paso 5: Probar

```bash
# Iniciar servidor de desarrollo
npm run dev

# Abrir en navegador
http://localhost:3000
```

---

## 📋 Tareas Comunes

### Crear una Página Nueva

**Objetivo**: Crear `/nosotros` (página "Sobre nosotros")

1. **Crear carpeta y archivo**
   ```
   src/app/nosotros/page.tsx
   ```

2. **Usar este prompt**:
   ```
   Crea la página "Sobre Nosotros" para Ticketify.
   
   Secciones:
   - Hero con título "Sobre Ticketify" y descripción breve
   - Misión y visión
   - Valores de la empresa
   - Equipo (3-4 personas con foto, nombre, cargo)
   
   Usa el sistema de diseño de Ticketify (ver DESIGN_SYSTEM.md)
   Incluye: Navbar, Footer, Container
   Responsive: mobile, tablet, desktop
   ```

3. **Integrar componentes**
   ```tsx
   import { Navbar } from '@/components/layout/navbar'
   import { Footer } from '@/components/layout/footer'
   import { Container } from '@/components/ui/container'
   ```

### Crear un Componente Nuevo

**Objetivo**: Crear un componente de búsqueda de eventos

1. **Determinar ubicación**
   ```
   src/components/events/event-search.tsx
   ```

2. **Usar prompt específico** (ver template arriba)

3. **Exportar correctamente**
   ```tsx
   export { EventSearch }
   export type { EventSearchProps }
   ```

### Conectar con Backend (API)

**Objetivo**: Obtener lista de eventos

1. **Ubicación**: `src/services/api/events.ts`

2. **Código base**:
   ```typescript
   export async function getEvents() {
     const response = await fetch('http://tu-backend.com/api/events')
     const data = await response.json()
     return data
   }
   ```

3. **Usar en componente**:
   ```tsx
   'use client'
   import { useEffect, useState } from 'react'
   import { getEvents } from '@/services/api/events'
   
   export default function EventsPage() {
     const [events, setEvents] = useState([])
     
     useEffect(() => {
       getEvents().then(setEvents)
     }, [])
     
     return <div>{/* Mostrar events */}</div>
   }
   ```

---

## 🎯 Buenas Prácticas

### ✅ Hacer

- **Leer `DESIGN_SYSTEM.md` antes de crear componentes**
- Usar componentes existentes cuando sea posible
- Mantener componentes pequeños y enfocados
- Nombrar archivos y componentes de forma descriptiva
- Usar TypeScript (no 'any')
- Hacer componentes responsive desde el inicio

### ❌ Evitar

- Crear estilos personalizados que no siguen el sistema de diseño
- Componentes gigantes (más de 200 líneas)
- Copiar-pegar código sin entenderlo
- Ignorar errores de TypeScript
- Olvidar hacer componentes responsive

---

## 🆘 Resolución de Problemas

### Error: "Module not found"

```bash
# Verificar que el import es correcto
# Malo:
import { Button } from '../../../components/ui/button'

# Bueno:
import { Button } from '@/components/ui/button'
```

### Error: "Property does not exist"

```typescript
// Asegúrate de definir tipos correctamente
interface MiComponenteProps {
  titulo: string
  descripcion?: string  // ? = opcional
}

const MiComponente: React.FC<MiComponenteProps> = ({ titulo, descripcion }) => {
  // ...
}
```

### El componente no se ve bien en mobile

```tsx
// Usa clases responsive de Tailwind
<div className="
  text-sm       {/* mobile por defecto */}
  md:text-base  {/* tablet */}
  lg:text-lg    {/* desktop */}
">
```

---

## 📚 Recursos de Aprendizaje

### Para entender React

- [React Docs (Beta)](https://react.dev) - Documentación oficial
- Conceptos clave:
  - **Componente**: Bloque reutilizable de UI
  - **Props**: Parámetros que recibe un componente
  - **State**: Datos que cambian y causan re-renderizado
  - **Hook**: Funciones especiales (useState, useEffect)

### Para entender TypeScript

- **Tipos básicos**:
  ```typescript
  string, number, boolean, any, unknown
  ```
- **Interfaces**: Definen estructura de objetos
- **Tipos opcionales**: Propiedad con `?`

### Para entender Tailwind CSS

- [Tailwind Docs](https://tailwindcss.com/docs)
- Busca clases por lo que necesitas:
  - Padding: `p-4`, `px-6`, `py-2`
  - Margin: `m-4`, `mx-auto`, `mt-8`
  - Color: `bg-blue-500`, `text-white`
  - Tamaño: `w-full`, `h-10`, `max-w-7xl`

---

## 🎓 Glosario de Términos

| Término | Significado | Ejemplo |
|---------|-------------|---------|
| **Component** | Bloque reutilizable de UI | `<Button />` |
| **Props** | Datos que se pasan a un componente | `<Button size="lg" />` |
| **State** | Datos que pueden cambiar | `const [count, setCount] = useState(0)` |
| **Hook** | Función especial de React | `useState`, `useEffect` |
| **JSX** | HTML dentro de JavaScript | `<div>Hola</div>` |
| **Responsive** | Se adapta a distintos tamaños de pantalla | Mobile, Tablet, Desktop |
| **API** | Comunicación con el backend | Fetch, POST, GET |
| **Route** | Ruta/URL de la aplicación | `/events`, `/login` |

---

## ✅ Checklist antes de hacer Commit

Antes de subir tu código, verifica:

- [ ] El código compila sin errores (`npm run dev` funciona)
- [ ] Sigue el sistema de diseño (colores, espaciados)
- [ ] Es responsive (probado en mobile, tablet, desktop)
- [ ] No hay errores de TypeScript
- [ ] Los nombres son descriptivos
- [ ] Los componentes son reutilizables
- [ ] Agregaste comentarios en partes complejas

---

## 🚀 Comandos Importantes

```bash
# Iniciar servidor de desarrollo
npm run dev

# Verificar errores de TypeScript
npm run type-check

# Formatear código
npm run format

# Instalar dependencias nuevas
npm install nombre-paquete

# Crear build de producción
npm run build
```

---

## 💡 Tips de Productividad con IA

### Prompts Rápidos

**Explicar código**:
```
Explica este código línea por línea en español simple:
[pega código]
```

**Corregir errores**:
```
Tengo este error: [pega error]
En este código: [pega código]
¿Cómo lo arreglo?
```

**Mejorar componente**:
```
Mejora este componente para que sea más accesible y responsive:
[pega código]
```

**Agregar funcionalidad**:
```
Tengo este componente: [pega código]
Necesito agregar: [describe funcionalidad]
¿Cómo lo hago?
```

---

## 📞 ¿Necesitas Ayuda?

1. **Revisa esta guía** - Probablemente la respuesta está aquí
2. **Lee DESIGN_SYSTEM.md** - Para dudas de diseño
3. **Pregunta a la IA** - Usa los templates de prompts
4. **Busca en el código** - Revisa componentes similares existentes
5. **Pregunta al equipo** - En el chat del proyecto

---

**¡Éxito en el desarrollo! 🎉**

Recuerda: No necesitas ser experto en web, solo seguir esta guía y usar IA de forma efectiva.
