# Guía de Integración del Botón de Mensajes

## Cómo agregar el botón de "Mensajes" en la lista de eventos del organizador

### Opción 1: En la página de lista de eventos (`my-events/page.tsx`)

Agregar el botón de mensajes en cada tarjeta de evento:

```tsx
// En el archivo: src/app/panel/my-events/page.tsx

// 1. Importar el componente
import EventMessagesButton from "@/components/organizer/EventMessagesButton";

// 2. Dentro del mapeo de eventos, agregar el botón:
{filteredEvents.map((event) => (
  <Card key={event.id}>
    <CardContent>
      {/* ... contenido existente ... */}
      
      {/* Agregar sección de botones */}
      <div className="flex gap-2 mt-4">
        <Link href={`/panel/my-events/${event.id}/edit`}>
          <Button variant="outline">Editar</Button>
        </Link>
        
        {/* NUEVO: Botón de mensajes */}
        <EventMessagesButton eventId={event.id} />
      </div>
    </CardContent>
  </Card>
))}
```

### Opción 2: En la vista de detalles del evento

Si tienes una página de detalles del evento, agregar:

```tsx
// En el archivo de detalles del evento

import EventMessagesButton from "@/components/organizer/EventMessagesButton";
import { MessageSquare } from "lucide-react";

// En la sección de acciones del evento:
<div className="flex gap-3">
  <button className="btn-edit">Editar Evento</button>
  <button className="btn-analytics">Ver Analytics</button>
  
  {/* NUEVO: Botón de mensajes */}
  <EventMessagesButton 
    eventId={eventId} 
    className="flex-1" // Opcional: personalizar estilos
  />
</div>
```

### Opción 3: Botón flotante en el dashboard

Para un acceso más prominente:

```tsx
// En cualquier página del dashboard del organizador

import EventMessagesButton from "@/components/organizer/EventMessagesButton";
import { MessageSquare } from "lucide-react";

// Agregar un botón flotante:
<div className="fixed bottom-8 right-8 z-50">
  <button
    onClick={() => router.push(`/panel/my-events/${eventId}/messages`)}
    className="bg-purple-600 text-white rounded-full p-4 shadow-2xl hover:bg-purple-700 transition-all hover:scale-110"
  >
    <MessageSquare className="w-6 h-6" />
  </button>
</div>
```

### Opción 4: En el menú de navegación

Agregar como opción en el sidebar:

```tsx
// En el componente de navegación del panel

const navigationItems = [
  { name: 'Mis Eventos', href: '/panel/my-events', icon: Calendar },
  { name: 'Mis Tickets', href: '/panel/my-tickets', icon: Ticket },
  
  // NUEVO: Agregar sección de mensajes
  { 
    name: 'Mensajes a Asistentes', 
    href: '/panel/my-events/messages', 
    icon: MessageSquare 
  },
];
```

## Ejemplo Completo: Integración en la tarjeta de evento

```tsx
// Archivo: src/app/panel/my-events/page.tsx

'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, MapPin, Edit, MessageSquare } from 'lucide-react'
import EventMessagesButton from "@/components/organizer/EventMessagesButton"

export default function OrganizerEventsPage() {
  const [events, setEvents] = useState([])
  
  // ... código de carga de eventos ...

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Mis Eventos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Imagen del evento */}
            <div className="h-48 bg-gradient-to-br from-purple-500 to-cyan-500"></div>
            
            {/* Contenido */}
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{event.title}</h3>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(event.startDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{event.venue}</span>
                </div>
              </div>

              {/* Badge de estado */}
              <div className="mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  event.status === 'PUBLISHED' 
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {event.status}
                </span>
              </div>

              {/* BOTONES DE ACCIÓN */}
              <div className="flex gap-2">
                {/* Botón Editar */}
                <Link 
                  href={`/panel/my-events/${event.id}/edit`}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  <span>Editar</span>
                </Link>

                {/* NUEVO: Botón Mensajes */}
                <EventMessagesButton eventId={event.id} className="flex-1" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

## Variante con Dropdown de Acciones

Si prefieres un menú desplegable:

```tsx
import { MoreVertical, Edit, MessageSquare, BarChart, Trash } from "lucide-react"

<div className="relative">
  <button className="p-2 hover:bg-gray-100 rounded-lg">
    <MoreVertical className="w-5 h-5" />
  </button>
  
  {/* Dropdown menu */}
  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border">
    <Link href={`/panel/my-events/${event.id}/edit`}>
      <div className="px-4 py-2 hover:bg-gray-50 flex items-center gap-2 cursor-pointer">
        <Edit className="w-4 h-4" />
        Editar Evento
      </div>
    </Link>
    
    {/* NUEVO: Opción de mensajes */}
    <Link href={`/panel/my-events/${event.id}/messages`}>
      <div className="px-4 py-2 hover:bg-gray-50 flex items-center gap-2 cursor-pointer">
        <MessageSquare className="w-4 h-4" />
        Enviar Mensajes
      </div>
    </Link>
    
    <Link href={`/panel/my-events/${event.id}/analytics`}>
      <div className="px-4 py-2 hover:bg-gray-50 flex items-center gap-2 cursor-pointer">
        <BarChart className="w-4 h-4" />
        Ver Analíticas
      </div>
    </Link>
  </div>
</div>
```

## Recomendación de UX

Para la mejor experiencia de usuario, recomiendo:

1. **Ubicación Principal**: Agregar el botón en la tarjeta de cada evento en la lista
2. **Indicador Visual**: Mostrar un badge con el número de mensajes enviados
3. **Acceso Rápido**: Incluir también en el menú de navegación para acceso global

## Ejemplo con Badge de Contador

```tsx
import EventMessagesButton from "@/components/organizer/EventMessagesButton"
import { MessageSquare } from "lucide-react"

<div className="relative">
  <EventMessagesButton eventId={event.id} />
  
  {/* Badge con número de mensajes */}
  {event.messageCount > 0 && (
    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
      {event.messageCount}
    </span>
  )}
</div>
```

---

Elige la opción que mejor se adapte al diseño actual de tu aplicación.
