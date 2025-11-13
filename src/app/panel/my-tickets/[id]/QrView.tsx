'use client'

import QRCode from 'react-qr-code'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { TicketDetail } from '@/services/api/tickets'
import { Button } from '@/components/ui/button'

type Props = { ticket: TicketDetail }

export default function QrView({ ticket }: Props) {
  const qr = ticket.qr_code ?? ticket.code ?? ''

  const handleDownloadPNG = async () => {
    // Descarga rápida renderizando un canvas temporal
    // (simple y sin dependencias adicionales)
    const svg = document.querySelector('#qr-svg') as SVGElement | null
    if (!svg) return
    const xml = new XMLSerializer().serializeToString(svg)
    const svg64 = window.btoa(unescape(encodeURIComponent(xml)))
    const image64 = `data:image/svg+xml;base64,${svg64}`

    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0)
      const png = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.href = png
      link.download = `ticket-${ticket.id}.png`
      link.click()
    }
    img.src = image64
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">
          {ticket.event?.title ?? 'Ticket'} · QR
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        {qr ? (
          <div className="bg-white p-4 rounded-lg border">
            {/* id para exportar a PNG */}
            <QRCode id="qr-svg" value={qr} size={256} />
          </div>
        ) : (
          <div className="text-red-600">Este ticket no tiene un QR disponible.</div>
        )}

        <div className="text-xs text-gray-500 break-all max-w-[28rem]">
          {qr}
        </div>

        <Button onClick={handleDownloadPNG} className="mt-2">
          Descargar QR (PNG)
        </Button>
      </CardContent>
    </Card>
  )
}
