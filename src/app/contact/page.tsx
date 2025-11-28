'use client'

import React, { useState } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageCircle,
  HelpCircle,
  Headphones,
  Building,
  CheckCircle2
} from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    category: 'general'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email',
      details: 'soporte@ticketify.com',
      description: 'Envíanos un correo y te responderemos en 24 horas',
      link: 'mailto:soporte@ticketify.com'
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Teléfono',
      details: '+51 943 721 854',
      description: 'Lunes a Viernes de 9:00 AM a 6:00 PM',
      link: 'tel:+51943721854'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: 'Oficina',
      details: 'Av. Universitaria 1801',
      description: 'Lima, Perú',
      link: 'https://maps.google.com'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Horario de Atención',
      details: 'Lunes - Viernes: 9:00 AM - 6:00 PM',
      description: 'Sábados: 10:00 AM - 2:00 PM',
      link: null
    }
  ]

  const supportCategories = [
    {
      icon: <HelpCircle className="w-8 h-8" />,
      title: 'Preguntas Frecuentes',
      description: 'Encuentra respuestas rápidas a las dudas más comunes',
      link: '/faq'
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: 'Soporte Técnico',
      description: 'Ayuda con problemas técnicos y de la plataforma',
      link: '/support'
    },
    {
      icon: <Building className="w-8 h-8" />,
      title: 'Para Organizadores',
      description: 'Información sobre cómo publicar y gestionar eventos',
      link: '/organizers'
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: 'Chat en Vivo',
      description: 'Habla con nuestro equipo en tiempo real',
      action: 'openChat'
    }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simular envío del formulario
    await new Promise(resolve => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setSubmitSuccess(true)

    // Resetear formulario después de 3 segundos
    setTimeout(() => {
      setSubmitSuccess(false)
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        category: 'general'
      })
    }, 3000)
  }

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
                💬 Estamos aquí para ayudarte
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Contáctanos
              </h1>
              <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
                ¿Tienes preguntas, sugerencias o necesitas ayuda? Nuestro equipo está listo para asistirte.
                Estamos comprometidos en brindarte la mejor experiencia.
              </p>
            </div>
          </Container>
        </section>

        {/* Contact Info Cards */}
        <section className="py-16 bg-white">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactInfo.map((info, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-xl border-2 border-gray-200 hover:border-primary-500 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center text-white">
                      {info.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {info.title}
                  </h3>
                  {info.link ? (
                    <a 
                      href={info.link}
                      className="text-primary-600 font-semibold hover:text-primary-700 block mb-1"
                    >
                      {info.details}
                    </a>
                  ) : (
                    <p className="text-gray-900 font-semibold mb-1">
                      {info.details}
                    </p>
                  )}
                  <p className="text-sm text-gray-600">
                    {info.description}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </section>

        {/* Main Contact Section */}
        <section className="py-16 bg-gray-50">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Envíanos un mensaje
                </h2>
                <p className="text-gray-600 mb-8">
                  Completa el formulario y nos pondremos en contacto contigo lo antes posible
                </p>

                {submitSuccess ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle2 className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      ¡Mensaje enviado!
                    </h3>
                    <p className="text-gray-600 text-center">
                      Gracias por contactarnos. Te responderemos pronto.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nombre completo *
                        </label>
                        <Input
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="Tu nombre"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <Input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="tu@email.com"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Teléfono
                        </label>
                        <Input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+51 999 999 999"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Categoría *
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          required
                        >
                          <option value="general">Consulta General</option>
                          <option value="support">Soporte Técnico</option>
                          <option value="organizer">Soy Organizador</option>
                          <option value="billing">Facturación</option>
                          <option value="partnership">Alianzas</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Asunto *
                      </label>
                      <Input
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="¿En qué podemos ayudarte?"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Mensaje *
                      </label>
                      <Textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Cuéntanos más sobre tu consulta..."
                        rows={6}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      fullWidth
                      disabled={isSubmitting}
                      className="flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Enviar mensaje
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>

              {/* Support Categories */}
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Otras formas de obtener ayuda
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Explora nuestros recursos de ayuda o contacta con nosotros directamente
                  </p>
                </div>

                <div className="space-y-4">
                  {supportCategories.map((category, index) => (
                    <div
                      key={index}
                      className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-primary-500 hover:shadow-md transition-all duration-200 cursor-pointer group"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg flex items-center justify-center text-primary-600 group-hover:from-primary-500 group-hover:to-secondary-500 group-hover:text-white transition-all duration-200">
                          {category.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                            {category.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {category.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Map placeholder */}
                <div className="bg-white rounded-xl overflow-hidden shadow-lg border-2 border-gray-200">
                  <div className="aspect-video bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-16 h-16 text-primary-600 mx-auto mb-2" />
                      <p className="text-gray-700 font-medium">Mapa de ubicación</p>
                      <p className="text-sm text-gray-600">Av. Universitaria 1801, Lima</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* FAQ Preview Section */}
        <section className="py-16 bg-white">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Preguntas Frecuentes
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Encuentra respuestas rápidas a las dudas más comunes
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  ¿Cómo compro tickets en Ticketify?
                </h3>
                <p className="text-gray-700">
                  Es muy simple: busca tu evento, selecciona tus tickets, completa tus datos y realiza el pago. Recibirás tus tickets por email instantáneamente.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  ¿Puedo cancelar o cambiar mis tickets?
                </h3>
                <p className="text-gray-700">
                  Las políticas de cancelación dependen de cada evento. Revisa los términos del organizador o contáctanos para más información.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  ¿Cómo publico mi evento en Ticketify?
                </h3>
                <p className="text-gray-700">
                  Regístrate como organizador, completa los datos de tu evento, configura tus tickets y publica. Es rápido y sencillo.
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  ¿Los tickets son seguros?
                </h3>
                <p className="text-gray-700">
                  Absolutamente. Todos los tickets incluyen códigos QR únicos y sistemas de verificación para prevenir fraudes.
                </p>
              </div>
            </div>

            <div className="text-center mt-10">
              <Button variant="outline" size="lg">
                Ver todas las preguntas frecuentes
              </Button>
            </div>
          </Container>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gray-50">
          <Container>
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-12 text-center text-white shadow-xl">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                ¿No encontraste lo que buscabas?
              </h2>
              <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                Nuestro equipo de soporte está disponible para ayudarte con cualquier consulta o problema
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="secondary" 
                  size="xl"
                  className="shadow-xl"
                >
                  <Phone className="w-5 h-5 mr-2" />
                  Llamar ahora
                </Button>
                <Button 
                  variant="outline" 
                  size="xl"
                  className="bg-white/10 border-white text-white hover:bg-white/20 backdrop-blur-sm"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Chat en vivo
                </Button>
              </div>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
    </div>
  )
}
