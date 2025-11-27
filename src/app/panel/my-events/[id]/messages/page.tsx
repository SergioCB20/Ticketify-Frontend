"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  MessageSquare,
  Send,
  Users,
  CheckCircle2,
  XCircle,
  Calendar,
  ArrowLeft,
  Loader2,
  Mail,
  TrendingUp,
} from "lucide-react";
import eventMessageService, {
  EventMessage,
  MessageStats,
} from "@/services/eventMessageService";
import SendMessageModal from "@/components/organizer/SendMessageModal";
import { EventService } from "@/services/api/events";

interface Event {
  id: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  venue: string;
  status: string;
}

export default function EventMessagesPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [messages, setMessages] = useState<EventMessage[]>([]);
  const [stats, setStats] = useState<MessageStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (eventId) {
      loadData();
    }
  }, [eventId, currentPage]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      // Cargar evento
      const eventData = await EventService.getEventById(eventId);
      setEvent(eventData);

      // Cargar mensajes
      const messagesData = await eventMessageService.getEventMessages(
        eventId,
        currentPage,
        10
      );
      setMessages(messagesData.messages);
      setTotalPages(messagesData.pagination.pages);

      // Cargar estadísticas
      const statsData = await eventMessageService.getMessageStats(eventId);
      setStats(statsData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMessageSent = () => {
    loadData();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-cyan-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Volver
          </button>

          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-purple-600" />
                Mensajes a Asistentes
              </h1>
              <p className="text-gray-600">{event?.title}</p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-lg hover:from-purple-700 hover:to-cyan-600 transition-all font-semibold flex items-center gap-2 shadow-lg"
            >
              <Send className="w-5 h-5" />
              Enviar Nuevo Mensaje
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Mail className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-sm font-medium text-gray-600">
                  Total Mensajes
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalMessages}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-cyan-100 rounded-lg">
                  <Users className="w-5 h-5 text-cyan-600" />
                </div>
                <span className="text-sm font-medium text-gray-600">
                  Total Destinatarios
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalRecipients}
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-sm font-medium text-gray-600">
                  Tasa de Éxito
                </span>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {stats.averageSuccessRate}%
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-orange-600" />
                </div>
                <span className="text-sm font-medium text-gray-600">
                  Último Envío
                </span>
              </div>
              <p className="text-sm font-semibold text-gray-900">
                {stats.lastMessageSent
                  ? formatDate(stats.lastMessageSent)
                  : "Nunca"}
              </p>
            </div>
          </div>
        )}

        {/* Messages List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">
              Historial de Mensajes
            </h2>
          </div>

          {messages.length === 0 ? (
            <div className="p-12 text-center">
              <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No has enviado mensajes aún
              </h3>
              <p className="text-gray-600 mb-6">
                Comienza a comunicarte con los asistentes de tu evento
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-lg hover:from-purple-700 hover:to-cyan-600 transition-all font-semibold inline-flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                Enviar Primer Mensaje
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {message.subject}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {message.content.replace(/<[^>]*>/g, "")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {message.sentAt
                          ? formatDate(message.sentAt)
                          : "No enviado"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        {message.totalRecipients} destinatarios
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <span className="text-green-600 font-medium">
                        {message.successfulSends} enviados
                      </span>
                    </div>

                    {message.failedSends > 0 && (
                      <div className="flex items-center gap-2">
                        <XCircle className="w-4 h-4 text-red-600" />
                        <span className="text-red-600 font-medium">
                          {message.failedSends} fallidos
                        </span>
                      </div>
                    )}

                    <div className="ml-auto">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          message.successRate >= 90
                            ? "bg-green-100 text-green-700"
                            : message.successRate >= 70
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {message.successRate}% éxito
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-6 border-t border-gray-100 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <span className="text-sm text-gray-600">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      <SendMessageModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        eventId={eventId}
        eventTitle={event?.title || ""}
        onSuccess={handleMessageSent}
      />
    </div>
  );
}
