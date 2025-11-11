# 📚 Ejemplos Prácticos - Sistema de Creación de Eventos

## Ejemplos de Uso del Sistema

### 1. Crear un Concierto Simple

```typescript
const concierto = {
  event: {
    title: "Concierto de Rock - Banda Local",
    description: "Noche de rock con las mejores bandas locales. Incluye 3 bandas en vivo y DJ.",
    startDate: "2025-12-15T20:00:00",
    endDate: "2025-12-15T23:30:00",
    venue: "Estadio Nacional, Lima",
    totalCapacity: 5000,
    multimedia: [],
    category_id: "musica-id"
  },
  ticketTypes: [
    {
      name: "General",
      description: "Acceso general al estadio",
      price: 80.00,
      quantity: 4000,
      maxPerPurchase: 6
    },
    {
      name: "VIP",
      description: "Zona preferencial cerca del escenario + bebida gratis",
      price: 150.00,
      quantity: 800,
      maxPerPurchase: 4
    },
    {
      name: "Palco Premium",
      description: "Palco exclusivo para grupos (4 personas) con servicio de catering",
      price: 800.00,
      quantity: 50,
      maxPerPurchase: 2
    }
  ]
}
```

### 2. Crear una Conferencia Empresarial

```typescript
const conferencia = {
  event: {
    title: "Tech Summit 2025 - Innovación Digital",
    description: "Conferencia anual sobre tecnología y transformación digital. 3 días de charlas, talleres y networking con expertos internacionales.",
    startDate: "2025-11-20T09:00:00",
    endDate: "2025-11-22T18:00:00",
    venue: "Centro de Convenciones Jockey Plaza, Lima",
    totalCapacity: 2000,
    multimedia: [],
    category_id: "conferencias-id"
  },
  ticketTypes: [
    {
      name: "Early Bird",
      description: "Precio especial por compra anticipada - Acceso completo 3 días",
      price: 350.00,
      quantity: 500,
      maxPerPurchase: 3,
      salesStartDate: "2025-08-01T00:00:00",
      salesEndDate: "2025-09-30T23:59:59"
    },
    {
      name: "Regular",
      description: "Acceso completo a los 3 días del evento",
      price: 450.00,
      quantity: 1200,
      maxPerPurchase: 5
    },
    {
      name: "Estudiante",
      description: "Precio especial para estudiantes (requiere validación)",
      price: 200.00,
      quantity: 200,
      maxPerPurchase: 1
    },
    {
      name: "VIP Pass",
      description: "Acceso VIP + almuerzo + networking exclusivo + certificado",
      price: 800.00,
      quantity: 100,
      maxPerPurchase: 2
    }
  ]
}
```

### 3. Crear una Obra de Teatro

```typescript
const teatro = {
  event: {
    title: "El Fantasma de la Ópera - Musical",
    description: "La aclamada obra musical vuelve a Lima. Una historia de amor, misterio y música inolvidable.",
    startDate: "2025-12-10T19:30:00",
    endDate: "2025-12-10T22:00:00",
    venue: "Teatro Municipal de Lima",
    totalCapacity: 800,
    multimedia: [],
    category_id: "teatro-id"
  },
  ticketTypes: [
    {
      name: "Platea Alta",
      description: "Asientos en platea alta con buena visibilidad",
      price: 120.00,
      quantity: 300,
      maxPerPurchase: 8
    },
    {
      name: "Platea Baja",
      description: "Mejores asientos con vista frontal al escenario",
      price: 180.00,
      quantity: 250,
      maxPerPurchase: 6
    },
    {
      name: "Palco",
      description: "Palcos exclusivos para grupos pequeños (4 personas)",
      price: 800.00,
      quantity: 50,
      maxPerPurchase: 3
    },
    {
      name: "Premium",
      description: "Primera fila con programa exclusivo + meet & greet",
      price: 350.00,
      quantity: 30,
      maxPerPurchase: 2
    }
  ]
}
```

### 4. Crear un Festival Gastronómico

```typescript
const festival = {
  event: {
    title: "Mistura 2025 - Festival Gastronómico",
    description: "El festival gastronómico más grande de Latinoamérica. Descubre sabores, chefs reconocidos y experiencias culinarias únicas.",
    startDate: "2025-09-05T11:00:00",
    endDate: "2025-09-14T22:00:00",
    venue: "Costa Verde, Magdalena del Mar",
    totalCapacity: 50000,
    multimedia: [],
    category_id: "gastronomia-id"
  },
  ticketTypes: [
    {
      name: "Entrada General - Día",
      description: "Acceso por un día completo al festival",
      price: 35.00,
      quantity: 40000,
      maxPerPurchase: 10
    },
    {
      name: "Pase Fin de Semana",
      description: "Acceso sábado y domingo",
      price: 60.00,
      quantity: 5000,
      maxPerPurchase: 6
    },
    {
      name: "Pase Completo",
      description: "Acceso todos los días del festival",
      price: 250.00,
      quantity: 3000,
      maxPerPurchase: 4
    },
    {
      name: "VIP Gourmet",
      description: "Zona VIP + degustaciones exclusivas + parking",
      price: 500.00,
      quantity: 2000,
      maxPerPurchase: 4
    }
  ]
}
```

### 5. Crear un Torneo Deportivo

```typescript
const torneo = {
  event: {
    title: "Copa Lima 2025 - Fútbol Amateur",
    description: "Torneo de fútbol amateur con 32 equipos. Final en vivo con premiación.",
    startDate: "2025-10-01T08:00:00",
    endDate: "2025-10-01T20:00:00",
    venue: "Complejo Deportivo Villa María del Triunfo",
    totalCapacity: 3000,
    multimedia: [],
    category_id: "deportes-id"
  },
  ticketTypes: [
    {
      name: "Tribuna General",
      description: "Acceso a las tribunas generales todo el día",
      price: 20.00,
      quantity: 2500,
      maxPerPurchase: 10
    },
    {
      name: "Tribuna Preferencial",
      description: "Asientos preferentes con sombra",
      price: 40.00,
      quantity: 400,
      maxPerPurchase: 6
    },
    {
      name: "Palco Familiar",
      description: "Palco para 6 personas + refrigerios",
      price: 300.00,
      quantity: 100,
      maxPerPurchase: 2
    }
  ]
}
```

## Casos de Validación

### ✅ Caso Válido - Todo Correcto

```typescript
// Capacidad: 1000
// Tickets:
// - General: 700
// - VIP: 250
// - Premium: 50
// Total: 1000 ✅
```

### ❌ Caso Inválido - Exceso de Capacidad

```typescript
// Capacidad: 500
// Tickets:
// - General: 400
// - VIP: 150
// Total: 550 ❌ (excede en 50)
```

### ✅ Caso Válido - Con Margen

```typescript
// Capacidad: 1000
// Tickets:
// - General: 600
// - VIP: 300
// Total: 900 ✅ (quedan 100 sin asignar)
```

## Flujo de Trabajo Completo

### Paso 1: Inicializar Estado

```typescript
const [formData, setFormData] = useState({
  nombre: '',
  categoria: '',
  descripcion: '',
  ubicacion: '',
  capacidad: '',
  fechaInicio: '',
  fechaFin: ''
})

const [ticketTypes, setTicketTypes] = useState<TicketTypeFormData[]>([])
```

### Paso 2: Validar Paso 1

```typescript
const validateStep1 = (): boolean => {
  const errors: Record<string, string> = {}
  
  if (!formData.nombre.trim()) {
    errors.nombre = 'El nombre es requerido'
  }
  
  if (!formData.descripcion.trim()) {
    errors.descripcion = 'La descripción es requerida'
  }
  
  // ... más validaciones
  
  setErrors(errors)
  return Object.keys(errors).length === 0
}
```

### Paso 3: Gestionar Ticket Types

```typescript
// Usar el componente
<TicketTypeManager
  ticketTypes={ticketTypes}
  onChange={setTicketTypes}
  errors={errors}
/>
```

### Paso 4: Validar Paso 2

```typescript
const validateStep2 = (): boolean => {
  if (ticketTypes.length === 0) {
    return false
  }
  
  const totalTickets = ticketTypes.reduce(
    (sum, tt) => sum + parseInt(tt.quantity), 
    0
  )
  
  const totalCapacity = parseInt(formData.capacidad)
  
  if (totalTickets > totalCapacity) {
    setErrors({ 
      ticketTypes: `Total excede capacidad: ${totalTickets} > ${totalCapacity}` 
    })
    return false
  }
  
  return true
}
```

### Paso 5: Enviar a API

```typescript
const handleSubmit = async () => {
  setLoading(true)
  
  try {
    const payload = {
      event: {
        title: formData.nombre,
        description: formData.descripcion,
        startDate: new Date(formData.fechaInicio).toISOString(),
        endDate: new Date(formData.fechaFin).toISOString(),
        venue: formData.ubicacion,
        totalCapacity: parseInt(formData.capacidad),
        multimedia: [],
        category_id: formData.categoria || undefined
      },
      ticketTypes: ticketTypes.map(tt => ({
        name: tt.name,
        description: tt.description || undefined,
        price: parseFloat(tt.price),
        quantity: parseInt(tt.quantity),
        maxPerPurchase: tt.maxPerPurchase ? parseInt(tt.maxPerPurchase) : undefined
      }))
    }
    
    const result = await createEventWithTicketTypes(payload)
    
    // Éxito!
    setSuccess(true)
    router.push('/panel/my-events')
    
  } catch (error) {
    setError(error.message)
  } finally {
    setLoading(false)
  }
}
```

## Buenas Prácticas

### 1. Nombres Descriptivos

✅ **Buenos nombres:**
- "Entrada General"
- "VIP con Backstage"
- "Palco Premium (4 personas)"
- "Estudiante con carnet"

❌ **Malos nombres:**
- "Tipo 1"
- "Normal"
- "A"
- "Entrada"

### 2. Descripciones Claras

✅ **Buenas descripciones:**
```
"Zona preferencial cerca del escenario con acceso a backstage 
y bebida de cortesía incluida"
```

❌ **Malas descripciones:**
```
"Mejor entrada"
```

### 3. Precios Realistas

✅ **Buenos precios:**
- S/ 50.00 (General)
- S/ 120.50 (VIP)
- S/ 25.00 (Estudiante)

❌ **Malos precios:**
- S/ 0.01
- S/ 99999.99
- S/ -50.00

### 4. Cantidades Coherentes

```typescript
// ✅ Bien: VIP menos cantidad que General
General: 800 tickets
VIP: 200 tickets

// ❌ Mal: Más VIP que General
General: 100 tickets
VIP: 900 tickets
```

### 5. Fechas de Venta

```typescript
// ✅ Bien: Early Bird termina antes del evento
{
  name: "Early Bird",
  salesStartDate: "2025-08-01",
  salesEndDate: "2025-09-30",  // 2 meses antes
  // Evento: 2025-12-01
}

// ❌ Mal: Venta termina después del evento
{
  salesEndDate: "2025-12-31",  // evento ya pasó
}
```

## Manejo de Errores Común

### Error: Capacidad Excedida

```typescript
// Solución: Reducir cantidades o aumentar capacidad
if (totalTickets > totalCapacity) {
  // Opción 1: Reducir tickets
  ticketTypes[0].quantity = 700  // era 800
  
  // Opción 2: Aumentar capacidad
  formData.capacidad = '1200'  // era 1000
}
```

### Error: Fecha Inválida

```typescript
// Solución: Asegurar fecha fin > fecha inicio
const start = new Date(formData.fechaInicio)
const end = new Date(formData.fechaFin)

if (end <= start) {
  // Sumar 3 horas a la fecha de inicio
  formData.fechaFin = new Date(start.getTime() + 3*60*60*1000).toISOString()
}
```

### Error: Precio Inválido

```typescript
// Solución: Validar y formatear precios
ticketTypes.forEach(tt => {
  tt.price = parseFloat(tt.price).toFixed(2)
  if (tt.price < 0) tt.price = '0.00'
  if (tt.price > 10000) tt.price = '10000.00'
})
```

## Testing Manual

### Checklist de Pruebas:

1. ⬜ Crear evento con 1 tipo de entrada
2. ⬜ Crear evento con 5 tipos de entrada
3. ⬜ Intentar exceder capacidad (debe fallar)
4. ⬜ Editar un tipo de entrada existente
5. ⬜ Eliminar un tipo de entrada
6. ⬜ Validar fechas en el pasado (debe fallar)
7. ⬜ Validar fecha fin < fecha inicio (debe fallar)
8. ⬜ Probar con diferentes categorías
9. ⬜ Probar navegación entre pasos
10. ⬜ Verificar redirección después de crear

## Recursos Adicionales

- **Documentación Completa**: Ver `EVENTO_CREATION_GUIDE.md`
- **Tipos TypeScript**: Ver `src/lib/types/`
- **Componentes**: Ver `src/components/events/`
- **Servicios API**: Ver `src/services/api/`

---

**Última actualización**: Noviembre 2025
