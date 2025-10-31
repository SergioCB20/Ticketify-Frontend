'use client'

import React, { useEffect, useState } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

interface EventsLayoutProps {
  children: React.ReactNode
}

export default function EventsLayout({ children }: EventsLayoutProps) {
  const [categories, setCategories] = useState<Array<{ id: string; name: string; icon?: string }>>([])

  useEffect(() => {
    // Cargar categorías desde el backend
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/v1/categories')
        const data = await response.json()
        setCategories(data.map((cat: any) => ({
          id: cat.id,
          name: cat.name,
          icon: cat.icon
        })))
      } catch (error) {
        console.error('Error loading categories:', error)
        // Fallback a categorías por defecto si falla la petición
        setCategories([
          { id: '1', name: 'Música', icon: '🎵' },
          { id: '2', name: 'Deportes', icon: '⚽' },
          { id: '3', name: 'Teatro', icon: '🎭' },
          { id: '4', name: 'Comedia', icon: '😂' },
          { id: '5', name: 'Tecnología', icon: '💻' },
          { id: '6', name: 'Arte', icon: '🎨' },
        ])
      }
    }

    fetchCategories()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showSearch={true} categories={categories} />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  )
}
