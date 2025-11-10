import React from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Encabezado global del panel */}
      <Navbar showSearch={false} />
      {/* Contenido de la ruta hija */}
      {children}
      {/* Pie de página global */}
      <Footer />
    </>
  )
}
