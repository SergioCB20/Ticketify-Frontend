'use client'

import React from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Container } from '@/components/ui/container'
import { Badge } from '@/components/ui/badge'
import { Users, Target, Heart, Shield, TrendingUp, Globe } from 'lucide-react'

export default function AboutPage() {
  const values = [
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Seguridad y Confianza',
      description: 'Protegemos cada transacción con los más altos estándares de seguridad. Tu información y tus tickets están siempre seguros con nosotros.',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Comunidad Primero',
      description: 'Creemos en conectar personas a través de experiencias memorables. Nuestra plataforma une a organizadores, artistas y asistentes.',
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: 'Pasión por los Eventos',
      description: 'Amamos los eventos tanto como tú. Trabajamos cada día para hacer que tu experiencia sea perfecta, desde la compra hasta el ingreso.',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Innovación Constante',
      description: 'Implementamos las últimas tecnologías para ofrecer la mejor plataforma de ticketing. Siempre evolucionando, siempre mejorando.',
    },
  ]



  const stats = [
    { number: '10,000+', label: 'Eventos Organizados' },
    { number: '500,000+', label: 'Tickets Vendidos' },
    { number: '50,000+', label: 'Usuarios Activos' },
    { number: '98%', label: 'Satisfacción' },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
          </div>

          <Container className="relative py-20 md:py-28">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="default" className="mb-6 bg-white/20 text-white border-white/30">
                🎯 Nuestra Historia
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Conectando personas con experiencias increíbles
              </h1>
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
                Ticketify nació con la misión de revolucionar la forma en que las personas descubren, 
                compran y disfrutan eventos. Desde conciertos hasta conferencias, somos el puente entre 
                tu próxima aventura y tú.
              </p>
            </div>
          </Container>
        </section>

        {/* Story Section */}
        <section className="py-16 bg-white">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                  Nuestra Historia
                </h2>
                <div className="space-y-4 text-gray-700 leading-relaxed">
                  <p className="text-lg">
                    Todo comenzó en 2025, cuando un grupo de apasionados por los eventos se dio cuenta 
                    de que existía una brecha en el mercado: las plataformas existentes eran complicadas, 
                    poco seguras o demasiado costosas.
                  </p>
                  <p className="text-lg">
                    Decidimos crear algo diferente. Una plataforma que fuera simple de usar, 
                    completamente segura y accesible para todos. Donde tanto organizadores pequeños 
                    como grandes productoras pudieran encontrar su espacio.
                  </p>
                  <p className="text-lg">
                    Hoy, miles de eventos confían en nosotros para conectar con su audiencia, 
                    y cientos de miles de personas disfrutan de experiencias memorables gracias a 
                    nuestra plataforma.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80"
                    alt="Equipo Ticketify"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 bg-gradient-to-br from-primary-500 to-secondary-500 text-white p-6 rounded-xl shadow-xl">
                  <p className="text-4xl font-bold">2025</p>
                  <p className="text-sm">Año de fundación</p>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gradient-to-br from-primary-600 to-secondary-600 text-white">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Nuestro Impacto
              </h2>
              <p className="text-xl text-white/90">
                Números que reflejan nuestro compromiso con la excelencia
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold mb-2">
                    {stat.number}
                  </div>
                  <div className="text-lg text-white/80">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-gray-50">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Nuestros Valores
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Los principios que guían cada decisión que tomamos y cada servicio que ofrecemos
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-xl border-2 border-gray-200 hover:border-primary-500 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-white">
                      {value.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {value.title}
                      </h3>
                      <p className="text-gray-700 leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Mission & Vision Section */}
        <section className="py-16 bg-white">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="bg-gradient-to-br from-primary-50 to-secondary-50 p-8 md:p-12 rounded-2xl border-2 border-primary-200">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl flex items-center justify-center text-white mr-4">
                    <Target className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Nuestra Misión
                  </h2>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Democratizar el acceso a eventos increíbles, proporcionando una plataforma 
                  segura, intuitiva y confiable que conecta organizadores con audiencias de 
                  manera eficiente. Queremos que cada persona pueda descubrir y disfrutar 
                  experiencias memorables sin complicaciones.
                </p>
              </div>

              <div className="bg-gradient-to-br from-secondary-50 to-primary-50 p-8 md:p-12 rounded-2xl border-2 border-secondary-200">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-primary-500 rounded-xl flex items-center justify-center text-white mr-4">
                    <Globe className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    Nuestra Visión
                  </h2>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Ser la plataforma líder de ticketing en Latinoamérica, reconocida por nuestra 
                  innovación tecnológica, excelente servicio al cliente y compromiso con la 
                  industria del entretenimiento. Aspiramos a transformar cada evento en una 
                  experiencia única e inolvidable.
                </p>
              </div>
            </div>
          </Container>
        </section>



        {/* CTA Section */}
        <section className="py-16 bg-white">
          <Container>
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-12 text-center text-white shadow-xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                ¿Listo para unirte a nosotros?
              </h2>
              <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                Ya seas organizador o asistente, Ticketify es tu plataforma para experiencias increíbles
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg">
                  Crear mi primer evento
                </button>
                <button className="px-8 py-4 bg-primary-700 text-white rounded-lg font-semibold hover:bg-primary-800 transition-colors border-2 border-white/20">
                  Explorar eventos
                </button>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  )
}
