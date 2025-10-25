# 🎨 Ticketify Design System

## 📋 Tabla de Contenidos
1. [Filosofía de Diseño](#filosofía-de-diseño)
2. [Paleta de Colores](#paleta-de-colores)
3. [Tipografía](#tipografía)
4. [Espaciado](#espaciado)
5. [Componentes](#componentes)
6. [Guía de Uso con IA](#guía-de-uso-con-ia)

---

## 🎯 Filosofía de Diseño

**Ticketify** es una plataforma moderna para gestión de eventos y tickets. Nuestro diseño debe transmitir:
- **Confianza**: Colores profesionales y layouts claros
- **Energía**: Elementos vibrantes que reflejan la emoción de los eventos
- **Simplicidad**: Interfaces intuitivas y minimalistas
- **Accesibilidad**: Contraste adecuado y elementos grandes

---

## 🎨 Paleta de Colores

### Colores Primarios
```
Primary (Violeta Vibrante)
- 50:  #faf5ff
- 100: #f3e8ff  
- 200: #e9d5ff
- 300: #d8b4fe
- 400: #c084fc
- 500: #a855f7  ← Principal
- 600: #9333ea
- 700: #7e22ce
- 800: #6b21a8
- 900: #581c87

Secondary (Cyan Eléctrico)
- 50:  #ecfeff
- 100: #cffafe
- 200: #a5f3fc
- 300: #67e8f9
- 400: #22d3ee
- 500: #06b6d4  ← Principal
- 600: #0891b2
- 700: #0e7490
- 800: #155e75
- 900: #164e63
```

### Colores de Estado
```
Success (Verde): #10b981
Warning (Amarillo): #f59e0b
Error (Rojo): #ef4444
Info (Azul): #3b82f6
```

### Escala de Grises
```
- 50:  #f9fafb
- 100: #f3f4f6
- 200: #e5e7eb
- 300: #d1d5db
- 400: #9ca3af
- 500: #6b7280
- 600: #4b5563
- 700: #374151
- 800: #1f2937
- 900: #111827
```

---

## 📝 Tipografía

### Familias de Fuente
```css
/* Principal - Sans Serif moderna */
font-family: 'Inter', system-ui, -apple-system, sans-serif;

/* Monospace para código */
font-family: 'Fira Code', monospace;
```

### Escalas de Tamaño
```
Headings:
- h1: 3rem (48px) - font-bold - leading-tight
- h2: 2.25rem (36px) - font-bold - leading-tight
- h3: 1.875rem (30px) - font-semibold - leading-snug
- h4: 1.5rem (24px) - font-semibold - leading-snug
- h5: 1.25rem (20px) - font-medium - leading-normal
- h6: 1rem (16px) - font-medium - leading-normal

Body:
- Large: 1.125rem (18px)
- Base: 1rem (16px) ← Default
- Small: 0.875rem (14px)
- XSmall: 0.75rem (12px)
```

---

## 📏 Espaciado

### Sistema de Espaciado (basado en 4px)
```
- 1:  4px
- 2:  8px
- 3:  12px
- 4:  16px  ← Base
- 5:  20px
- 6:  24px
- 8:  32px
- 10: 40px
- 12: 48px
- 16: 64px
- 20: 80px
- 24: 96px
```

### Bordes Redondeados
```
- sm: 0.125rem (2px)
- default: 0.375rem (6px)
- md: 0.375rem (6px)
- lg: 0.5rem (8px)
- xl: 0.75rem (12px)
- 2xl: 1rem (16px)
- full: 9999px (circular)
```

---

## 🧩 Componentes

### 1. Buttons (Botones)

#### Variantes
- **primary**: Acción principal (violeta)
- **secondary**: Acción secundaria (cyan)
- **outline**: Borde con fondo transparente
- **ghost**: Sin borde, hover sutil
- **destructive**: Acciones peligrosas (rojo)

#### Tamaños
- **sm**: 32px altura
- **md**: 40px altura (default)
- **lg**: 48px altura
- **xl**: 56px altura

#### Código de Ejemplo
```tsx
<Button variant="primary" size="md">
  Comprar Ticket
</Button>
```

---

### 2. Cards (Tarjetas)

#### Variantes
- **default**: Borde sutil, fondo blanco
- **elevated**: Sombra pronunciada
- **outlined**: Solo borde
- **interactive**: Hover effect y cursor pointer

#### Estructura
```tsx
<Card variant="elevated">
  <CardHeader>
    <CardTitle>Título</CardTitle>
    <CardDescription>Descripción</CardDescription>
  </CardHeader>
  <CardContent>
    Contenido principal
  </CardContent>
  <CardFooter>
    Acciones o información adicional
  </CardFooter>
</Card>
```

---

### 3. Inputs (Campos de Entrada)

#### Estados
- **default**: Estado normal
- **focus**: Cuando el usuario interactúa
- **error**: Validación fallida
- **disabled**: No editable
- **success**: Validación exitosa

#### Tipos
- Text, Email, Password
- Number, Date, Time
- Textarea
- Select, Multiselect

---

### 4. Badges (Insignias)

Para mostrar estados, categorías o información compacta.

#### Variantes
- **default**: Gris neutro
- **primary**: Violeta
- **secondary**: Cyan
- **success**: Verde
- **warning**: Amarillo
- **error**: Rojo

---

### 5. Navigation (Navegación)

#### Header/Navbar
- Altura: 64px
- Fondo: white con sombra sutil
- Logo: 40px altura
- Links: font-medium, hover con underline

#### Sidebar
- Ancho: 256px (expandido) / 64px (colapsado)
- Items: altura 40px, padding 12px
- Iconos: 20px tamaño

---

## 🤖 Guía de Uso con IA

### Prompts Recomendados

#### Para crear un componente:
```
Crea un componente [NOMBRE] en React + TypeScript para Ticketify siguiendo estas especificaciones:

Sistema de Diseño:
- Color primario: violet-500 (#a855f7)
- Color secundario: cyan-500 (#06b6d4)
- Espaciado base: 4px (usa múltiplos: space-2, space-4, etc.)
- Bordes redondeados: rounded-lg por defecto
- Tipografía: Inter font

Requisitos:
1. [Describe funcionalidad]
2. Debe ser responsive (mobile-first)
3. Incluir estados: default, hover, active, disabled
4. Usar Tailwind CSS (solo clases del core)
5. TypeScript con tipos explícitos
6. Accesible (ARIA labels cuando corresponda)

Ejemplo de estructura:
[Pega ejemplo si es necesario]
```

#### Para crear una página:
```
Crea la página [NOMBRE] para Ticketify con estas secciones:

Layout:
- Header: navbar con logo, navegación y botón CTA
- Main: [describe secciones]
- Footer: links, copyright

Diseño:
- Usar componentes de src/components/ui/
- Paleta: violet-500 (primario), cyan-500 (secundario)
- Espaciado consistente: gap-6 entre secciones
- Responsive: mobile (sm:), tablet (md:), desktop (lg:)

Componentes a incluir:
- [Lista componentes necesarios]
```

---

## 📐 Layouts Comunes

### Container
```tsx
<div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
  {/* Contenido centrado con padding responsivo */}
</div>
```

### Grid de Eventos
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards de eventos */}
</div>
```

### Sección Hero
```tsx
<section className="bg-gradient-to-br from-violet-500 to-cyan-500 py-20">
  <div className="container mx-auto px-4 text-center text-white">
    <h1 className="text-5xl font-bold mb-4">Título Principal</h1>
    <p className="text-xl mb-8">Subtítulo descriptivo</p>
    <Button size="lg">Call to Action</Button>
  </div>
</section>
```

---

## ✅ Checklist de Calidad

Antes de considerar un componente/página terminada:

- [ ] **Responsive**: Funciona en mobile, tablet y desktop
- [ ] **Accesible**: Contraste adecuado (WCAG AA mínimo)
- [ ] **Consistente**: Usa colores y espaciados del sistema
- [ ] **Performante**: No bloquea el rendering
- [ ] **Tipos**: TypeScript sin 'any'
- [ ] **Estados**: Contempla loading, error, empty
- [ ] **Documentado**: Props y uso claro

---

## 🎓 Para el Equipo

### Conceptos Clave

**Componente**: Bloque reutilizable de UI (botón, card, input)
**Props**: Parámetros que recibe un componente para customizarse
**State**: Datos que cambian y causan re-renderizado
**Responsive**: Se adapta a diferentes tamaños de pantalla
**Tailwind**: Framework de CSS con clases predefinidas (bg-violet-500, text-xl, etc.)

### Workflow Recomendado

1. **Diseñar**: Sketch o wireframe de lo que quieres
2. **Buscar**: Ver si existe un componente similar en `/components/ui`
3. **Prompt**: Crear prompt detallado con especificaciones del design system
4. **Generar**: Usar IA para generar el código
5. **Revisar**: Verificar que siga el design system
6. **Probar**: Ver en navegador, ajustar responsive
7. **Integrar**: Commit y push

---

## 📚 Recursos

- **Tailwind Docs**: https://tailwindcss.com/docs
- **React Docs**: https://react.dev
- **Color Tool**: https://coolors.co
- **Icon Library**: Lucide React (ya instalado)

---

**Versión**: 1.0  
**Última actualización**: Octubre 2025  
**Mantenido por**: Equipo Ticketify
