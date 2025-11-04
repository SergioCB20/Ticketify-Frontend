'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PlusCircle, Calendar, MapPin, Ticket, Search, Loader2, Star } from 'lucide-react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { formatDate } from '@/lib/utils'

// --- Tipo de datos ---
interface OrganizerEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  totalTickets: number;
  soldTickets: number;
  status: 'DRAFT' | 'PUBLISHED' | 'COMPLETED' | 'CANCELLED';
  imageUrl?: string;
}

const API_URL = 'http://localhost:8000';

// --- Componente ---
export default function OrganizerEventsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<OrganizerEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // --- Carga de Datos con FETCH ---
  useEffect(() => {
      const fetchOrganizerEvents = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('ticketify_access_token');
      const user = localStorage.getItem('ticketify_user');
      const id = user ? JSON.parse(user).id : null;

      if (!token) throw new Error('No hay token en localStorage');

      const response = await fetch(`${API_URL}/api/events/organizer/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data: OrganizerEvent[] = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Error al cargar eventos:", error);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };


    fetchOrganizerEvents();
  }, []);

  // --- Filtrado ---
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // --- Funciones Auxiliares ---
  const getStatusBadgeVariant = (status: OrganizerEvent['status']): 'success' | 'default' | 'destructive' | 'warning' => {
    switch (status) {
      case 'PUBLISHED': return 'success';
      case 'DRAFT': return 'warning';
      case 'COMPLETED': return 'default';
      case 'CANCELLED': return 'destructive';
      default: return 'default';
    }
  };

  const getStatusBadgeText = (status: OrganizerEvent['status']): string => {
    switch (status) {
      case 'PUBLISHED': return 'Publicado';
      case 'DRAFT': return 'Borrador';
      case 'COMPLETED': return 'Completado';
      case 'CANCELLED': return 'Cancelado';
      default: return 'Desconocido';
    }
  };

  // --- Renderizado ---
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <main className="flex-grow py-8 md:py-12">
        <Container>
          {/* Encabezado */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8 gap-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Mis Eventos
            </h1>
            {!isLoading && (
              <Link href="/panel/my-events/crear" passHref>
                <Button variant="primary" size="lg" className="w-full md:w-auto shadow-md hover:shadow-lg transition-shadow">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Crear Nuevo Evento
                </Button>
              </Link>
            )}
          </div>

          {/* Filtros y Búsqueda */}
          {!isLoading && (
            <Card className="mb-8 p-4 bg-white shadow-sm border border-gray-200 rounded-lg">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="relative flex-grow w-full md:w-auto">
                  <Input
                    type="text"
                    placeholder="Buscar evento por nombre..."
                    className="pl-10 pr-4 h-11 text-base border-gray-300 rounded-lg focus:border-violet-500 focus:ring-violet-500"
                    aria-label="Buscar evento por nombre"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
                <select
                  aria-label="Filtrar por estado del evento"
                  className="h-11 w-full md:w-auto rounded-lg border border-gray-300 px-3 text-sm focus:border-violet-500 focus:ring-1 focus:ring-violet-500 focus:outline-none bg-white appearance-none"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">Todos los Estados</option>
                  <option value="PUBLISHED">Publicado</option>
                  <option value="DRAFT">Borrador</option>
                  <option value="COMPLETED">Completado</option>
                  <option value="CANCELLED">Cancelado</option>
                </select>
              </div>
            </Card>
          )}

          {/* Contenido Principal */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20 text-center">
              <Loader2 className="mr-3 h-8 w-8 animate-spin text-primary-500" />
              <p className="text-gray-600 text-lg font-medium">Cargando tus eventos...</p>
            </div>
          ) : !isLoading && filteredEvents.length === 0 ? (
            <Card className="text-center py-16 md:py-20 px-6 bg-white shadow-lg border border-gray-100 rounded-xl max-w-2xl mx-auto">
              <CardContent className="flex flex-col items-center">
                <div className="p-4 bg-violet-100 rounded-full mb-6 inline-flex border-4 border-violet-200">
                  <Star width="48" height="48" className="text-violet-600" fill="currentColor"/>
                </div>
                <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-3">
                  {searchTerm || statusFilter ? 'No se encontraron eventos' : 'Aún no tienes eventos creados'}
                </h2>
                <p className="text-base text-gray-600 mb-8 max-w-md mx-auto">
                  {searchTerm || statusFilter ? 'Prueba con otros términos de búsqueda o filtros.' : 'Crea tu primer evento para empezar a vender entradas y gestionar tus actividades.'}
                </p>
                {!searchTerm && !statusFilter && (
                  <Link href="/organizer/events/create" passHref>
                    <Button variant="primary" size="lg" className="h-12 text-lg rounded-xl shadow-md hover:shadow-lg transition-shadow">
                      <PlusCircle className="mr-2 h-5 w-5" />
                      Crear Evento
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="flex flex-col gap-6">
              {filteredEvents.map((event) => (
                <Card
                  key={event.id}
                  variant="default"
                  className="flex flex-col md:flex-row overflow-hidden bg-white hover:shadow-lg transition-shadow duration-300 group rounded-xl border border-gray-200 shadow-sm"
                >
                  {/* Imagen */}
                  <div className="relative h-48 w-full md:w-56 lg:w-64 md:h-auto flex-shrink-0 bg-gray-100">
                    {event.imageUrl ? (
                      <Image src={event.imageUrl} alt={`Imagen de ${event.title}`} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw"/>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <Calendar className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                    <Badge variant={getStatusBadgeVariant(event.status)} className="absolute top-3 right-3 shadow text-xs px-2.5 py-1 rounded-full font-semibold">
                      {getStatusBadgeText(event.status)}
                    </Badge>
                  </div>

                  {/* Contenido */}
                  <div className="flex flex-col flex-grow p-5 md:p-6">
                    <CardHeader className="p-0 mb-2">
                      <CardTitle className="text-lg md:text-xl font-semibold text-gray-800 line-clamp-2 group-hover:text-primary-600 transition-colors">
                        <Link href={`/organizer/events/${event.id}/dashboard`} className="focus:outline-none focus:ring-1 focus:ring-primary-300 rounded">
                          {event.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="p-0 flex-grow space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4 text-gray-500 flex-shrink-0" />
                        {formatDate(event.date, { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })}
                      </div>
                      <div className="flex items-start">
                        <MapPin className="mr-2 h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{event.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Ticket className="mr-2 h-4 w-4 text-gray-500 flex-shrink-0" />
                        <span className="font-medium text-gray-800">{event.soldTickets.toLocaleString()}</span>
                        <span className="mx-1 text-gray-500">/</span>
                        <span className="text-gray-700">{event.totalTickets.toLocaleString()} vendidos</span>
                        <span className="ml-2 font-semibold text-gray-900">
                          ({event.totalTickets > 0 ? ((event.soldTickets / event.totalTickets) * 100).toFixed(0) : 0}%)
                        </span>
                      </div>
                    </CardContent>

                    <CardFooter className="p-0 flex flex-col sm:flex-row gap-3 mt-auto pt-4 border-t border-gray-100">
                      <Link href={`/panel/my-events/${event.id}/edit`} className="w-full sm:w-auto flex-1" passHref>
                        <Button variant="outline" size="sm" fullWidth className="font-medium text-gray-700 hover:bg-gray-50 rounded-lg">
                          Editar
                        </Button>
                      </Link>
                      <Link href={`/organizer/events/${event.id}`} className="w-full sm:w-auto flex-1" passHref>
                        <Button variant="secondary" size="sm" fullWidth className="font-medium rounded-lg">
                          Ver Panel
                        </Button>
                      </Link>
                    </CardFooter>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Container>
      </main>
    </div>
  )
}