'use client'

import React from 'react'
import { Download, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface QRCodeDisplayProps {
  qrCode: string  // Base64 image string
  ticketId: string
  eventName?: string
  className?: string
}

export function QRCodeDisplay({ qrCode, ticketId, eventName, className = '' }: QRCodeDisplayProps) {
  
  const handleDownload = () => {
    // Crear un link temporal para descargar la imagen
    const link = document.createElement('a')
    link.href = qrCode
    link.download = `ticket-${ticketId}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className={`flex flex-col items-center p-6 bg-white rounded-lg shadow-lg border border-gray-200 ${className}`}>
      {/* Título */}
      {eventName && (
        <div className="mb-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <h3 className="text-lg font-semibold text-gray-900">Ticket Válido</h3>
          </div>
          <p className="text-sm text-gray-600">{eventName}</p>
        </div>
      )}

      {/* QR Code Image */}
      <div className="bg-white p-4 rounded-lg border-2 border-gray-300 mb-4">
        <img 
          src={qrCode} 
          alt={`QR Code para ticket ${ticketId}`}
          className="w-64 h-64 object-contain"
        />
      </div>

      {/* Ticket ID */}
      <div className="text-center mb-4">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">ID del Ticket</p>
        <p className="text-sm font-mono text-gray-700 break-all">{ticketId.slice(0, 8)}...</p>
      </div>

      {/* Botón de descarga */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleDownload}
        className="flex items-center gap-2"
      >
        <Download className="w-4 h-4" />
        Descargar QR
      </Button>

      {/* Nota informativa */}
      <p className="text-xs text-gray-500 text-center mt-4 max-w-xs">
        Presenta este código QR en la entrada del evento para validar tu ticket.
      </p>
    </div>
  )
}
