# 🔌 GUÍA DE INTEGRACIÓN - Cómo usar las nuevas funcionalidades

## 📍 Integrar Compra Directa en Página de Evento

### Opción 1: Botón Simple
```tsx
// En tu página de detalle de evento (e.g., /events/[id]/page.tsx)
'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

export default function EventDetailPage({ event, ticketTypes }) {
  const router = useRouter()
  
  const handleBuyTicket = (ticketType: any, quantity: number) => {
    // Construir URL de checkout
    const params = new URLSearchParams({
      eventId: event.id,
      ticketTypeId: ticketType.id,
      quantity: quantity.toString(),
      price: ticketType.price.toString(),
      eventName: event.title
    })
    
    // Redirigir a checkout
    router.push(`/checkout?${params}`)
  }

  return (
    <div>
      <h1>{event.title}</h1>
      
      {ticketTypes.map(ticketType => (
        <div key={ticketType.id}>
          <h3>{ticketType.name}</h3>
          <p>${ticketType.price}</p>
          <Button onClick={() => handleBuyTicket(ticketType, 1)}>
            Comprar
          </Button>
        </div>
      ))}
    </div>
  )
}
```

### Opción 2: Modal con Selector de Cantidad
```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog } from '@/components/ui/dialog' // Asume que tienes un componente Dialog

export default function EventDetailPage({ event, ticketTypes }) {
  const router = useRouter()
  const [showModal, setShowModal] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [quantity, setQuantity] = useState(1)
  
  const handleBuyClick = (ticketType: any) => {
    setSelectedTicket(ticketType)
    setShowModal(true)
  }
  
  const handleConfirmPurchase = () => {
    const params = new URLSearchParams({
      eventId: event.id,
      ticketTypeId: selectedTicket.id,
      quantity: quantity.toString(),
      price: selectedTicket.price.toString(),
      eventName: event.title
    })
    
    router.push(`/checkout?${params}`)
  }

  return (
    <div>
      {/* Tu contenido del evento */}
      
      {ticketTypes.map(ticketType => (
        <Button key={ticketType.id} onClick={() => handleBuyClick(ticketType)}>
          Comprar {ticketType.name}
        </Button>
      ))}
      
      {/* Modal de confirmación */}
      {showModal && (
        <Dialog open={showModal} onClose={() => setShowModal(false)}>
          <h2>Comprar Tickets</h2>
          <p>{selectedTicket?.name} - ${selectedTicket?.price}</p>
          
          <label>Cantidad:</label>
          <Input
            type="number"
            min="1"
            max="10"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          />
          
          <p>Total: ${(selectedTicket?.price * quantity).toFixed(2)}</p>
          
          <Button onClick={handleConfirmPurchase}>
            Ir al Pago
          </Button>
        </Dialog>
      )}
    </div>
  )
}
```

---

## 🎫 Mostrar QR en "Mis Tickets"

```tsx
// En tu página de "Mis Tickets" (e.g., /panel/my-tickets/page.tsx)
'use client'

import { QRCodeDisplay } from '@/components/marketplace/qr-code-display'
import { useEffect, useState } from 'react'
import { TicketService } from '@/services/api/tickets' // Tu servicio existente

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    loadTickets()
  }, [])
  
  const loadTickets = async () => {
    try {
      const data = await TicketService.getUserTickets() // Tu endpoint existente
      setTickets(data)
    } catch (error) {
      console.error('Error loading tickets:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Mis Tickets</h1>
      
      {loading ? (
        <p>Cargando tickets...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map(ticket => (
            <div key={ticket.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">{ticket.event.title}</h3>
              <p className="text-gray-600 mb-4">
                {new Date(ticket.purchaseDate).toLocaleDateString()}
              </p>
              
              {/* Mostrar QR si el ticket está activo */}
              {ticket.status === 'ACTIVE' && ticket.qrCode && (
                <QRCodeDisplay
                  qrCode={ticket.qrCode}
                  ticketId={ticket.id}
                  eventName={ticket.event.title}
                />
              )}
              
              {/* Mostrar estado si no está activo */}
              {ticket.status !== 'ACTIVE' && (
                <div className="text-center p-4 bg-gray-100 rounded">
                  <p className="text-gray-600">Estado: {ticket.status}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

---

## 🛒 Integrar Compra en Marketplace

```tsx
// En tu componente de listado de marketplace
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MarketplaceService } from '@/services/api/marketplace'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface ListingCardProps {
  listing: any
}

export function ListingCard({ listing }: ListingCardProps) {
  const router = useRouter()
  const [buying, setBuying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const handleBuy = async () => {
    setBuying(true)
    setError(null)
    
    try {
      const result = await MarketplaceService.buyListing(listing.id)
      
      if (result.success) {
        // Redirigir a confirmación o a "Mis Tickets"
        router.push(`/panel/my-tickets?new=${result.newTicketId}`)
        // O mostrar un toast/notificación
      }
    } catch (err: any) {
      setError(err.message || 'Error al comprar el ticket')
    } finally {
      setBuying(false)
    }
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-2">{listing.event.title}</h3>
      <p className="text-2xl font-bold text-primary-600 mb-4">
        ${listing.price}
      </p>
      
      {error && (
        <p className="text-red-600 text-sm mb-2">{error}</p>
      )}
      
      <Button
        onClick={handleBuy}
        disabled={buying}
        className="w-full"
      >
        {buying ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Comprando...
          </>
        ) : (
          'Comprar Ticket'
        )}
      </Button>
    </div>
  )
}
```

---

## 🎨 Personalizar el Componente QR

```tsx
// Crear tu propia versión del componente QR
'use client'

import { QRCodeDisplay } from '@/components/marketplace/qr-code-display'

export function CustomTicketDisplay({ ticket }) {
  return (
    <div className="bg-gradient-to-br from-purple-600 to-blue-500 rounded-lg p-6 text-white">
      {/* Header personalizado */}
      <div className="text-center mb-4">
        <h2 className="text-2xl font-bold">{ticket.event.title}</h2>
        <p className="text-sm opacity-80">
          {new Date(ticket.event.startDate).toLocaleDateString()}
        </p>
      </div>
      
      {/* QR Code con fondo blanco */}
      <div className="bg-white rounded-lg p-4 mb-4">
        <QRCodeDisplay
          qrCode={ticket.qrCode}
          ticketId={ticket.id}
          eventName={ticket.event.title}
        />
      </div>
      
      {/* Información adicional */}
      <div className="text-center text-sm space-y-1">
        <p>Tipo: {ticket.ticketType.name}</p>
        <p>Precio: ${ticket.price}</p>
        <p className="text-xs opacity-70">ID: {ticket.id.slice(0, 8)}...</p>
      </div>
    </div>
  )
}
```

---

## 🔗 Integrar en Carrito de Compras

```tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface CartItem {
  eventId: string
  eventName: string
  ticketTypeId: string
  ticketTypeName: string
  price: number
  quantity: number
}

export function ShoppingCart() {
  const router = useRouter()
  const [cart, setCart] = useState<CartItem[]>([])
  
  const handleCheckout = () => {
    // Si solo hay 1 item en el carrito, usar checkout directo
    if (cart.length === 1) {
      const item = cart[0]
      const params = new URLSearchParams({
        eventId: item.eventId,
        ticketTypeId: item.ticketTypeId,
        quantity: item.quantity.toString(),
        price: item.price.toString(),
        eventName: item.eventName
      })
      
      router.push(`/checkout?${params}`)
    } else {
      // Si hay múltiples items, necesitarías crear un endpoint para compra múltiple
      // o procesar uno por uno
      alert('Compra múltiple en desarrollo')
    }
  }
  
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  
  return (
    <div>
      <h2>Carrito de Compras</h2>
      
      {cart.map((item, index) => (
        <div key={index}>
          <p>{item.eventName} - {item.ticketTypeName}</p>
          <p>Cantidad: {item.quantity} x ${item.price}</p>
        </div>
      ))}
      
      <p>Total: ${total.toFixed(2)}</p>
      
      <Button onClick={handleCheckout} disabled={cart.length === 0}>
        Proceder al Pago
      </Button>
    </div>
  )
}
```

---

## 🧪 Pruebas de Integración

```typescript
// tests/purchase.test.ts (ejemplo con Jest)
import { PurchaseService } from '@/services/api/purchase'

describe('Purchase Flow', () => {
  it('should process purchase successfully', async () => {
    const request = {
      purchase: {
        eventId: 'test-event-id',
        ticketTypeId: 'test-ticket-type-id',
        quantity: 2
      },
      payment: {
        cardNumber: '4532123456789012',
        cardholderName: 'TEST USER',
        expiryMonth: '12',
        expiryYear: '25',
        cvv: '123'
      }
    }
    
    const result = await PurchaseService.processPurchase(request)
    
    expect(result.success).toBe(true)
    expect(result.tickets).toHaveLength(2)
    expect(result.tickets[0].qrCode).toMatch(/^data:image\/png;base64,/)
  })
  
  it('should reject invalid card', async () => {
    const request = {
      purchase: {
        eventId: 'test-event-id',
        ticketTypeId: 'test-ticket-type-id',
        quantity: 1
      },
      payment: {
        cardNumber: '4532123456780000', // Terminada en 0000
        cardholderName: 'TEST USER',
        expiryMonth: '12',
        expiryYear: '25',
        cvv: '123'
      }
    }
    
    await expect(PurchaseService.processPurchase(request))
      .rejects.toThrow('El pago fue rechazado')
  })
})
```

---

## 📱 Compartir QR por WhatsApp/Email

```tsx
'use client'

import { Button } from '@/components/ui/button'
import { Share2, Mail } from 'lucide-react'

export function ShareQRButtons({ ticket }) {
  const handleShareWhatsApp = () => {
    const message = `¡Mira mi ticket para ${ticket.event.title}! 🎉`
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }
  
  const handleShareEmail = () => {
    const subject = `Ticket para ${ticket.event.title}`
    const body = `Aquí está mi ticket:\n\nEvento: ${ticket.event.title}\nFecha: ${ticket.event.startDate}\nID: ${ticket.id}`
    const mailto = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.location.href = mailto
  }
  
  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={handleShareWhatsApp}>
        <Share2 className="w-4 h-4 mr-2" />
        WhatsApp
      </Button>
      <Button variant="outline" size="sm" onClick={handleShareEmail}>
        <Mail className="w-4 h-4 mr-2" />
        Email
      </Button>
    </div>
  )
}
```

---

## 🎯 Resumen de URLs

- **Checkout**: `/checkout?eventId=X&ticketTypeId=Y&quantity=1&price=50&eventName=Evento`
- **Mis Tickets**: `/panel/my-tickets`
- **Marketplace**: `/marketplace`
- **Confirmación Marketplace**: `/marketplace/purchase/[listingId]`

---

**¡Listo para integrar! 🚀**
