# Frontend de Ticketify

Sistema de gestión de tickets y eventos construido con Next.js, TypeScript y Tailwind CSS.

## 🚀 Tecnologías

- **Next.js 14** - Framework de React con App Router
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de CSS utility-first
- **NextAuth.js** - Autenticación completa
- **React Query (TanStack Query)** - Gestión de estado del servidor
- **Zustand** - Gestión de estado local
- **React Hook Form + Zod** - Formularios y validación
- **Axios** - Cliente HTTP
- **React Hot Toast** - Notificaciones

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router (Next.js 13+)
│   ├── (auth)/            # Grupo de rutas de autenticación
│   │   ├── login/         # Página de login
│   │   ├── register/      # Página de registro
│   │   ├── error/         # Página de errores de auth
│   │   └── layout.tsx     # Layout para auth
│   ├── api/auth/          # API routes para NextAuth
│   ├── events/            # Páginas de eventos
│   └── layout.tsx         # Layout principal
├── components/            # Componentes reutilizables
│   ├── auth/             # Componentes de autenticación
│   ├── ui/               # Componentes base de UI
│   └── providers.tsx     # Providers de la aplicación
├── hooks/                # Custom hooks
├── lib/                  # Utilidades y configuraciones
│   ├── types/           # Tipos TypeScript
│   ├── auth.ts          # Configuración NextAuth
│   ├── api.ts           # Configuración Axios
│   ├── validations.ts   # Esquemas Zod
│   └── utils.ts         # Utilidades generales
├── services/             # Servicios de API
│   └── api/
└── store/                # Stores de Zustand
```

## 🛠️ Configuración Inicial

### 1. Instalar dependencias

```bash
npm install
```

### 2. Variables de entorno

Copia `.env.example` a `.env.local` y configura las variables:

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus valores:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-clave-secreta-super-segura

# Google OAuth (opcional)
GOOGLE_CLIENT_ID=tu-google-client-id
GOOGLE_CLIENT_SECRET=tu-google-client-secret

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### 3. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 🔐 Autenticación

### Características implementadas:

- ✅ Login con email/password
- ✅ Registro de nuevos usuarios
- ✅ Validación de formularios con Zod
- ✅ Gestión de sesiones con NextAuth.js
- ✅ Manejo de errores de autenticación
- ✅ Indicador de fortaleza de contraseña
- ✅ Preparado para OAuth (Google)
- ✅ Protección de rutas
- ✅ Refresh automático de tokens

### Páginas disponibles:

- `/login` - Iniciar sesión
- `/register` - Crear cuenta
- `/error` - Errores de autenticación

## 🎨 Componentes UI

### Componentes base creados:

- `Button` - Botón con variantes y estado de carga
- `Input` - Campo de entrada con validación y etiquetas
- `Card` - Contenedor de contenido con header, content y footer

### Características:

- Totalmente accesibles
- Responsive design
- Tema consistente con Tailwind CSS
- Soporte para estados de carga
- Validación visual de errores

## 📡 Gestión de Estado

### React Query (TanStack Query)
- Gestión de estado del servidor
- Cache inteligente de peticiones
- Refetch automático
- Manejo de estados de carga y error

### Zustand
- Estado local ligero
- TypeScript nativo
- Sin boilerplate

### NextAuth + Axios
- Interceptores automáticos para tokens
- Refresh automático de sesiones
- Manejo centralizado de errores HTTP

## 🛡️ Validación

### Zod Schemas implementados:

```typescript
// Login
loginSchema: { email, password }

// Registro  
registerSchema: { firstName, lastName, email, password, confirmPassword }

// Cambio de contraseña
changePasswordSchema: { currentPassword, newPassword, confirmNewPassword }
```

## 🚀 Scripts Disponibles

```bash
npm run dev          # Desarrollo
npm run build        # Construcción para producción
npm run start        # Servidor de producción
npm run lint         # Linting con ESLint
```

## 🔗 Integración con Backend

El frontend está configurado para trabajar con el backend de Ticketify:

- **Base URL**: Configurable via `NEXT_PUBLIC_API_URL`
- **Autenticación**: JWT tokens manejados automáticamente
- **Interceptores**: Refresh automático de tokens expirados

### Endpoints esperados:

```
POST /auth/login
POST /auth/register
POST /auth/refresh
POST /auth/logout
GET  /auth/profile
```

## 📝 Próximos Pasos

- [ ] Implementar Google OAuth
- [ ] Crear páginas de eventos
- [ ] Sistema de compra de tickets
- [ ] Dashboard de usuario
- [ ] Panel administrativo
- [ ] Notificaciones en tiempo real
- [ ] PWA capabilities

## 🤝 Desarrollo

### Convenciones:

1. **Componentes**: PascalCase, un componente por archivo
2. **Hooks**: Prefijo `use`, camelCase
3. **Tipos**: PascalCase con suffix `Type` o `Interface`
4. **Constantes**: UPPER_SNAKE_CASE
5. **Archivos**: kebab-case

### Estructura de commits:

```
feat: nueva funcionalidad
fix: corrección de bug
docs: documentación
style: formateo de código
refactor: refactorización
test: pruebas
chore: tareas de mantenimiento
```

## 📄 Licencia

Este proyecto es parte del curso de Ingeniería de Software - 2025-2
