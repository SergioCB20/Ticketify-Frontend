"use client";

import { useState, useEffect } from "react";
import { X, Send, Users, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import eventMessageService, {
  EventAttendee,
  SendMessageData,
} from "@/services/eventMessageService";

interface SendMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: string;
  eventTitle: string;
  onSuccess?: () => void;
}

export default function SendMessageModal({
  isOpen,
  onClose,
  eventId,
  eventTitle,
  onSuccess,
}: SendMessageModalProps) {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [attendees, setAttendees] = useState<EventAttendee[]>([]);
  const [isLoadingAttendees, setIsLoadingAttendees] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar asistentes cuando se abre el modal
  useEffect(() => {
    if (isOpen && eventId) {
      loadAttendees();
    }
  }, [isOpen, eventId]);

  const loadAttendees = async () => {
    setIsLoadingAttendees(true);
    setError(null);
    try {
      const data = await eventMessageService.getEventAttendees(eventId);
      setAttendees(data);
    } catch (err: any) {
      console.error("Error loading attendees:", err);
      setError("Error al cargar los asistentes");
    } finally {
      setIsLoadingAttendees(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim() || !content.trim()) {
      setError("Por favor completa todos los campos");
      return;
    }

    if (attendees.length === 0) {
      setError("No hay asistentes para enviar el mensaje");
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      const messageData: SendMessageData = {
        subject: subject.trim(),
        content: content.trim(),
        messageType: "BROADCAST",
      };

      await eventMessageService.sendMessageToAttendees(eventId, messageData);

      // Mostrar éxito
      setShowSuccess(true);
      setSubject("");
      setContent("");

      // Cerrar después de 2 segundos
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
        onSuccess?.();
      }, 2000);
    } catch (err: any) {
      console.error("Error sending message:", err);
      setError(
        err.response?.data?.detail || "Error al enviar el mensaje. Intenta nuevamente."
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    if (!isSending) {
      setSubject("");
      setContent("");
      setError(null);
      setShowSuccess(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Send className="w-6 h-6 text-purple-600" />
              Enviar Mensaje a Asistentes
            </h2>
            <p className="text-sm text-gray-600 mt-1">{eventTitle}</p>
          </div>
          <button
            onClick={handleClose}
            disabled={isSending}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="m-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-semibold text-green-900">¡Mensaje enviado exitosamente!</p>
              <p className="text-sm text-green-700">
                El mensaje se ha enviado a {attendees.length} asistentes
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="m-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Recipients Preview */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-purple-900 mb-2">
              <Users className="w-5 h-5" />
              <span className="font-semibold">Destinatarios</span>
            </div>
            {isLoadingAttendees ? (
              <div className="flex items-center gap-2 text-purple-700">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Cargando asistentes...</span>
              </div>
            ) : (
              <p className="text-sm text-purple-700">
                Este mensaje se enviará a{" "}
                <span className="font-bold">{attendees.length} asistentes</span> con
                tickets activos
              </p>
            )}
          </div>

          {/* Subject */}
          <div>
            <label
              htmlFor="subject"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Asunto del mensaje *
            </label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              maxLength={200}
              placeholder="Ej: Recordatorio importante sobre el evento"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              disabled={isSending}
              required
            />
            <p className="text-xs text-gray-500 mt-1">{subject.length}/200 caracteres</p>
          </div>

          {/* Content */}
          <div>
            <label
              htmlFor="content"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Mensaje *
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              maxLength={5000}
              rows={10}
              placeholder="Escribe tu mensaje aquí...

Puedes incluir:
- Recordatorios importantes
- Cambios en la programación
- Instrucciones de acceso
- Agradecimientos
- Actualizaciones del evento"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
              disabled={isSending}
              required
            />
            <p className="text-xs text-gray-500 mt-1">{content.length}/5000 caracteres</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSending}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSending || attendees.length === 0 || isLoadingAttendees}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-500 text-white rounded-lg hover:from-purple-700 hover:to-cyan-600 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Enviar Mensaje a {attendees.length} Asistentes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
