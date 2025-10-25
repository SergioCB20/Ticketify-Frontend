# 🎫 Ticketify - Sistema de Gestión de Eventos

Plataforma moderna para la compra y gestión de tickets de eventos.

## 📋 Descripción

Ticketify es una aplicación web full-stack que permite a los usuarios descubrir, explorar y comprar tickets para eventos de todo tipo: conciertos, deportes, teatro, conferencias y más.

### ✨ Características Principales

- 🔍 **Búsqueda y filtrado** de eventos por categoría, fecha y ubicación
- 🎨 **Interfaz moderna** con diseño responsive
- 🔐 **Autenticación** segura de usuarios
- 💳 **Compra de tickets** con pasarela de pago
- 📱 **Responsive** - funciona en mobile, tablet y desktop
- ⚡ **Rápido** - optimizado con Next.js 14

---

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18+ instalado
- npm o yarn
- Git

### Instalación

```bash
# 1. Clonar repositorio
git clone <url-del-repo>
cd ticketify-frontend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus configuraciones

# 4. Iniciar servidor de desarrollo
npm run dev

# 5. Abrir en navegador
# http://localhost:3000
```

### Scripts Disponibles

```bash
npm run dev          # Iniciar servidor de desarrollo
npm run build        # Crear build de producción
npm run start        # Iniciar servidor de producción
npm run lint         # Verificar código con ESLint
npm run type-check   # Verificar tipos TypeScript
```

---

## 📁 Estructura del Proyecto

```
ticketify-frontend/
├── src/
│   ├── app/                 # Páginas (Next.js App Router)
│   │   ├── page.tsx        # Página principal
│   │   ├── layout.tsx      # Layout global
│   │   ├── (auth)/         # Autenticación (login, register)
│   │   ├── events/         # Páginas de eventos
│   │   └── example-home/   # 🆕 Página de ejemplo del sistema de diseño
│   │
│   ├── components/         # Componentes React
│   │   ├── ui/            # Componentes básicos (Button, Card, etc.)
│   │   ├── layout/        # Navbar, Footer
│   │   └── events/        # Componentes de eventos
│   │
│   ├── lib/               # Utilidades
│   ├── services/          # Servicios (API calls)
│   └── store/             # Estado global (Zustand)
│
├── public/                # Archivos estáticos
├── DESIGN_SYSTEM.md       # 🎨 Sistema de diseño (IMPORTANTE)
├── TEAM_GUIDE.md          # 📖 Guía para el equipo
└── README.md              # Este archivo
```

---

## 🎨 Sistema de Diseño

El proyecto cuenta con un sistema de diseño completo y documentado. **Lee `DESIGN_SYSTEM.md` antes de crear componentes.**

### Colores Principales

- **Primary**: Violeta (`#a855f7`) - Acciones principales
- **Secondary**: Cyan (`#06b6d4`) - Acciones secundarias
- **Success**: Verde (`#10b981`)
- **Error**: Rojo (`#ef4444`)
- **Warning**: Amarillo (`#f59e0b`)

### Componentes UI Disponibles

✅ Ya implementados y listos para usar:

- **Button** - Botones con múltiples variantes
- **Card** - Tarjetas para contenido
- **Badge** - Insignias/etiquetas
- **Avatar** - Imágenes de usuario
- **Container** - Wrapper para layouts
- **EventCard** - Tarjeta especializada para eventos
- **Navbar** - Barra de navegación
- **Footer** - Pie de página
- **Input** - Campos de formulario

### Ver Sistema de Diseño en Acción

Visita `/example-home` para ver una página completa usando todos los componentes del sistema de diseño.

```bash
# Después de npm run dev, visita:
http://localhost:3000/example-home
```

---

## 👥 Para el Equipo de Desarrollo

### 📖 Documentos Importantes

1. **TEAM_GUIDE.md** - Guía paso a paso para desarrollar con IA
2. **DESIGN_SYSTEM.md** - Sistema de diseño completo
3. Este README - Información general del proyecto

### 🤖 Desarrollo con IA

Este proyecto está diseñado para trabajar con IA como herramienta principal. No necesitas ser experto en React/Next.js.

**Workflow básico:**

1. Lee `TEAM_GUIDE.md` para entender la estructura
2. Usa los templates de prompts para generar código
3. Revisa que siga el sistema de diseño
4. Integra y prueba

**Ejemplo de prompt para crear un componente:**

```
Crea un componente FilterBar en React + TypeScript para Ticketify.

Requisitos:
- Permite filtrar eventos por categoría, fecha y precio
- Usa el sistema de diseño de Ticketify (primary-500, secondary-500)
- Debe ser responsive
- Incluir componente Button de @/components/ui/button

Props:
- onFilter: función que recibe los filtros seleccionados
- categories: array de categorías disponibles
```

---

## 🛠️ Stack Tecnológico

### Frontend

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Estado**: Zustand
- **Formularios**: React Hook Form (cuando se necesite)
- **UI Icons**: Lucide React

### Herramientas de Desarrollo

- **Linter**: ESLint
- **Formateo**: Prettier (si está configurado)
- **Control de versiones**: Git

---

## 📝 Convenciones de Código

### Nombrado

```typescript
// Componentes: PascalCase
function EventCard() {}

// Funciones: camelCase
function formatDate() {}

// Constantes: UPPER_SNAKE_CASE
const API_BASE_URL = '...'

// Interfaces/Types: PascalCase con Props/Type suffix
interface ButtonProps {}
type EventType = 'concert' | 'sports'
```

### Archivos

```
# Componentes: kebab-case.tsx
event-card.tsx
user-profile.tsx

# Páginas: kebab-case o lowercase
page.tsx
[id]/page.tsx
```

### Estructura de Componente

```tsx
'use client' // Si usa hooks o interactividad

import React from 'react'
import { cn } from '@/lib/utils'

// 1. Tipos/Interfaces
interface MiComponenteProps {
  titulo: string
  descripcion?: string
}

// 2. Componente
const MiComponente: React.FC<MiComponenteProps> = ({ 
  titulo, 
  descripcion 
}) => {
  // 3. Estado y lógica
  const [activo, setActivo] = React.useState(false)

  // 4. Funciones
  const handleClick = () => {
    setActivo(!activo)
  }

  // 5. Render
  return (
    <div className="p-4">
      <h2>{titulo}</h2>
      {descripcion && <p>{descripcion}</p>}
    </div>
  )
}

// 6. Display name (para debugging)
MiComponente.displayName = 'MiComponente'

// 7. Exportar
export { MiComponente }
export type { MiComponenteProps }
```

---

## 🔧 Configuración

### Variables de Entorno

Crea un archivo `.env.local` en la raíz:

```env
# API Backend
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# NextAuth (si usas autenticación)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-secret-key-aqui

# Otras configuraciones
NEXT_PUBLIC_APP_NAME=Ticketify
```

### Tailwind Config

El proyecto ya tiene configurado:
- Colores personalizados (primary, secondary)
- Espaciados extendidos
- Animaciones personalizadas
- Fuentes: Inter

Ver `tailwind.config.js` para más detalles.

---

## 📚 Recursos de Aprendizaje

### React & Next.js

- [Next.js Docs](https://nextjs.org/docs) - Documentación oficial
- [React Docs](https://react.dev) - Nueva documentación de React
- [Next.js Learn](https://nextjs.org/learn) - Tutorial interactivo

### TypeScript

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [TypeScript Cheatsheet](https://www.typescriptlang.org/cheatsheets)

### Tailwind CSS

- [Tailwind Docs](https://tailwindcss.com/docs)
- [Tailwind Cheatsheet](https://nerdcave.com/tailwind-cheat-sheet)

### Git & GitHub

- [Git Handbook](https://guides.github.com/introduction/git-handbook/)
- [GitHub Flow](https://docs.github.com/en/get-started/quickstart/github-flow)

---

## 🐛 Debugging

### Errores Comunes

**"Module not found"**
```bash
# Verifica que el import use alias @
import { Button } from '@/components/ui/button'

# No uses rutas relativas largas
import { Button } from '../../../components/ui/button' # ❌
```

**"Hydration Error"**
```tsx
// Usa 'use client' en componentes con interactividad
'use client'

import { useState } from 'react'
```

**Estilos no se aplican**
```bash
# Reinicia el servidor
npm run dev
```

---

## 🚦 Control de Versiones

### Flujo de Git

```bash
# 1. Crear rama para tu feature
git checkout -b feature/nombre-feature

# 2. Hacer commits descriptivos
git add .
git commit -m "feat: agregar componente EventCard"

# 3. Push a tu rama
git push origin feature/nombre-feature

# 4. Crear Pull Request en GitHub
```

### Convención de Commits

```bash
feat: nueva característica
fix: corrección de bug
docs: cambios en documentación
style: cambios de formato (no afectan lógica)
refactor: refactorización de código
test: agregar o modificar tests
chore: tareas de mantenimiento
```

---

## 🎯 Roadmap

### ✅ Completado

- [x] Sistema de diseño completo
- [x] Componentes UI básicos
- [x] Layout (Navbar, Footer)
- [x] Página de ejemplo
- [x] Documentación para el equipo

### 🚧 En Desarrollo

- [ ] Páginas de autenticación funcionales
- [ ] Integración con API backend
- [ ] Catálogo de eventos
- [ ] Sistema de compra de tickets
- [ ] Panel de administración

### 📅 Futuro

- [ ] Pasarela de pago
- [ ] Notificaciones en tiempo real
- [ ] Sistema de reseñas
- [ ] App móvil (React Native)

---

## 🤝 Contribuir

### Para Nuevos Miembros

1. Lee `TEAM_GUIDE.md` completamente
2. Revisa `DESIGN_SYSTEM.md`
3. Explora el código existente
4. Prueba la página `/example-home`
5. Empieza con tareas pequeñas

### Proceso de Revisión

1. Crea un Pull Request
2. Describe qué cambios hiciste y por qué
3. Agrega screenshots si es UI
4. Espera revisión del equipo
5. Realiza ajustes si se solicitan

---

## 📄 Licencia

Este proyecto es parte de un curso de Ingeniería de Software.

---

## 👨‍💻 Equipo

- **Desarrolladores**: [Nombres del equipo]
- **Instructor**: [Nombre del instructor]
- **Curso**: Ingeniería de Software 2025-2

---

## 📞 Soporte

¿Necesitas ayuda?

1. Revisa `TEAM_GUIDE.md`
2. Revisa `DESIGN_SYSTEM.md`
3. Busca en el código ejemplos similares
4. Pregunta en el chat del equipo
5. Usa IA con los templates de prompts

---

## 🎉 Agradecimientos

Construido con:
- Next.js
- React
- TypeScript
- Tailwind CSS
- Mucho ☕ y 🍕

---

**¡Feliz desarrollo! 🚀**
