"use client";

import { MessageSquare } from "lucide-react";
import { useRouter } from "next/navigation";

interface MessageButtonProps {
  eventId: string;
  className?: string;
}

export default function EventMessagesButton({ eventId, className = "" }: MessageButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(`/panel/my-events/${eventId}/messages`)}
      className={`flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium ${className}`}
      title="Enviar mensaje a asistentes"
    >
      <MessageSquare className="w-4 h-4" />
      <span>Mensajes</span>
    </button>
  );
}
