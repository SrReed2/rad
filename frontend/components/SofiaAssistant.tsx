"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MoreVertical, Search, Send, Sparkles, X } from "lucide-react";

interface SofiaMessage {
  id: string;
  role: "user" | "sofia";
  text: string;
  timestamp: string;
}

const formatTime = () =>
  new Date().toLocaleTimeString("es-ES", { hour: "numeric", minute: "2-digit" });

const INITIAL_MESSAGES: SofiaMessage[] = [
  {
    id: "welcome",
    role: "sofia",
    text: "Hola, soy SOFIA. Puedo ayudarte a consultar asistencia, riesgo académico o resumir el desempeño de un curso. ¿En qué te ayudo hoy?",
    timestamp: formatTime(),
  },
];

// Respuestas de demostración — sustituir por la integración real con el backend / modelo.
const DEMO_REPLIES = [
  "Estoy revisando esa información en el panel académico, dame un momento.",
  "Según los últimos registros, esa métrica se actualizó hoy. ¿Quieres el detalle por curso?",
  "Puedo generar un resumen de riesgo para ese grupo. ¿Lo prefieres por asistencia o por calificación?",
];

interface SofiaAssistantProps {
  /** Si se provee, muestra un botón de cierre en el encabezado (uso como panel flotante). */
  onClose?: () => void;
}

export default function SofiaAssistant({ onClose }: SofiaAssistantProps) {
  const [messages, setMessages] = useState<SofiaMessage[]>(INITIAL_MESSAGES);
  const [draft, setDraft] = useState("");
  const [quickQuery, setQuickQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll al último mensaje (o al indicador de "escribiendo...").
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMessage: SofiaMessage = {
      id: crypto.randomUUID(),
      role: "user",
      text: trimmed,
      timestamp: formatTime(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setDraft("");
    setQuickQuery("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    setIsTyping(true);
    // Simulación de respuesta — reemplazar por la llamada real al asistente.
    window.setTimeout(() => {
      const reply = DEMO_REPLIES[Math.floor(Math.random() * DEMO_REPLIES.length)];
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "sofia", text: reply, timestamp: formatTime() },
      ]);
      setIsTyping(false);
    }, 1100);
  };

  const handleDraftChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraft(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 128)}px`;
  };

  const handleComposerKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(draft);
    }
  };

  const handleQuickSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage(quickQuery);
    }
  };

  return (
    <aside className="flex h-full w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-slate-700/50 bg-slate-900 shadow-lg">
      {/* Encabezado */}
      <div className="flex items-center justify-between border-b border-slate-700/50 px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/20">
            <span className="absolute inset-0 -z-10 animate-pulse rounded-xl bg-indigo-500/40 blur-md" />
            <Sparkles className="h-[18px] w-[18px] text-white" />
          </div>
          <div>
            <h2 className="text-[15px] font-semibold leading-tight tracking-tight text-slate-100">
              SOFIA
            </h2>
            <div className="mt-0.5 flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              <p className="text-xs text-slate-400">Asistente Virtual · En línea</p>
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <button
            type="button"
            aria-label="Más opciones"
            className="rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar SOFIA"
              className="ml-1 rounded-lg p-1.5 text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Búsqueda rápida */}
      <div className="px-4 pt-4">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={quickQuery}
            onChange={(e) => setQuickQuery(e.target.value)}
            onKeyDown={handleQuickSearchKeyDown}
            placeholder="Buscar o preguntar a SOFIA..."
            className="w-full rounded-full border border-slate-700/50 bg-slate-800/80 py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 outline-none transition-all focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/50"
          />
        </div>
      </div>

      {/* Historial de conversación */}
      <div ref={scrollRef} className="flex-1 space-y-5 overflow-y-auto px-4 py-5">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {isTyping && <TypingBubble />}
      </div>

      {/* Caja de entrada */}
      <div className="border-t border-slate-700/50 p-4">
        <div className="flex items-end gap-2 rounded-2xl border border-slate-700/50 bg-slate-800 px-3 py-2 transition-all focus-within:border-indigo-500/40 focus-within:ring-2 focus-within:ring-indigo-500/50">
          <textarea
            ref={textareaRef}
            value={draft}
            onChange={handleDraftChange}
            onKeyDown={handleComposerKeyDown}
            rows={1}
            placeholder="Escribe tu mensaje para SOFIA..."
            className="max-h-32 flex-1 resize-none bg-transparent py-1.5 text-sm text-slate-200 placeholder-slate-500 outline-none placeholder:truncate"
          />
          <div className="flex items-center gap-1 pb-0.5">
            <button
              type="button"
              onClick={() => setIsRecording((v) => !v)}
              aria-pressed={isRecording}
              aria-label="Entrada por voz"
              className={`rounded-full p-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 ${
                isRecording
                  ? "bg-red-500/20 text-red-400"
                  : "text-slate-400 hover:bg-slate-700/50 hover:text-slate-200"
              }`}
            >
              <Mic className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => sendMessage(draft)}
              disabled={!draft.trim()}
              aria-label="Enviar mensaje"
              className="flex items-center gap-1.5 rounded-full bg-indigo-600 py-2 pl-3.5 pr-3 text-sm font-medium text-white transition-colors hover:bg-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500"
            >
              <span className="hidden sm:inline">Enviar</span>
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
        <p className="mt-2 px-1 text-[11px] text-slate-600">
          SOFIA puede cometer errores. Verifica la información importante.
        </p>
      </div>
    </aside>
  );
}

function MessageBubble({ message }: { message: SofiaMessage }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%]">
          <div className="rounded-2xl rounded-tr-sm bg-slate-700 px-4 py-3 text-sm leading-relaxed text-slate-100 shadow-sm">
            {message.text}
          </div>
          <span className="mr-1 mt-1.5 block text-right text-[11px] text-slate-500">
            {message.timestamp}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex max-w-[85%] items-start gap-2.5">
      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-[11px] font-bold text-white shadow-sm">
        S
      </div>
      <div>
        <div className="rounded-2xl rounded-tl-sm border border-slate-700/40 bg-slate-800 px-4 py-3 text-sm leading-relaxed text-slate-200 shadow-sm">
          {message.text}
        </div>
        <span className="ml-1 mt-1.5 block text-[11px] text-slate-500">{message.timestamp}</span>
      </div>
    </div>
  );
}

function TypingBubble() {
  return (
    <div className="flex items-start gap-2.5">
      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-[11px] font-bold text-white">
        S
      </div>
      <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-slate-700/40 bg-slate-800 px-4 py-3.5">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500 [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500 [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500" />
      </div>
    </div>
  );
}
