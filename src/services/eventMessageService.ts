/**
 * Servicio para mensajes a asistentes de eventos
 */

import api from '../lib/api';

export interface EventMessage {
  id: string;
  subject: string;
  content: string;
  messageType: 'INDIVIDUAL' | 'BROADCAST' | 'FILTERED';
  totalRecipients: number;
  successfulSends: number;
  failedSends: number;
  successRate: number;
  recipientFilters?: string;
  sentAt?: string;
  isSent: boolean;
  eventId: string;
  organizerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventAttendee {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  ticketCount: number;
  ticketTypes: string[];
}

export interface MessageStats {
  totalMessages: number;
  totalRecipients: number;
  averageSuccessRate: number;
  lastMessageSent?: string;
}

export interface SendMessageData {
  subject: string;
  content: string;
  messageType: 'BROADCAST' | 'FILTERED' | 'INDIVIDUAL';
  recipientFilters?: string;
}

export interface MessagesListResponse {
  messages: EventMessage[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const eventMessageService = {
  /**
   * Enviar mensaje a los asistentes de un evento
   */
  sendMessageToAttendees: async (eventId: string, data: SendMessageData): Promise<EventMessage> => {
    const response = await api.post(`/events/${eventId}/messages`, data);
    return response.data;
  },

  /**
   * Obtener historial de mensajes enviados
   */
  getEventMessages: async (
    eventId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<MessagesListResponse> => {
    const response = await api.get(`/events/${eventId}/messages`, {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Obtener detalles de un mensaje específico
   */
  getMessageDetails: async (eventId: string, messageId: string): Promise<EventMessage> => {
    const response = await api.get(`/events/${eventId}/messages/${messageId}`);
    return response.data;
  },

  /**
   * Obtener lista de asistentes del evento
   */
  getEventAttendees: async (
    eventId: string,
    ticketTypeId?: string
  ): Promise<EventAttendee[]> => {
    const response = await api.get(`/events/${eventId}/attendees`, {
      params: ticketTypeId ? { ticket_type_id: ticketTypeId } : {},
    });
    return response.data;
  },

  /**
   * Obtener estadísticas de mensajes
   */
  getMessageStats: async (eventId: string): Promise<MessageStats> => {
    const response = await api.get(`/events/${eventId}/messages/stats`);
    return response.data;
  },
};

export default eventMessageService;
