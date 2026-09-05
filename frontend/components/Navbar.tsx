"use client";

import { Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useSofiaPanel } from "../context/SofiaPanelContext";

export default function Navbar() {
  const { user } = useAuth();
  const { isOpen, toggle } = useSofiaPanel();

  const today = new Date().toLocaleDateString("es-NI", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <nav className="sticky top-0 z-50 bg-[#0D2B45] border-b border-[#1E3A52] px-8 py-4 flex justify-between items-center">
      <div>
        <h1 className="text-lg font-semibold text-[#F7F6F3]">
          Dashboard Académico
        </h1>
        <p className="text-xs text-[#7C8C9A] capitalize">{today}</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Acceso al asistente SOFIA */}
        <button
          type="button"
          onClick={toggle}
          aria-pressed={isOpen}
          aria-label="Abrir asistente SOFIA"
          className="flex items-center gap-1.5 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm shadow-indigo-500/30 transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          <Sparkles className="h-3.5 w-3.5" />
          SOFIA
        </button>

        {/* Indicador online */}
        <span className="hidden sm:flex items-center gap-1.5 text-xs text-[#C89D4E]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C89D4E] animate-pulse" />
          Online
        </span>

        {/* Usuario */}
        {user && (
          <div className="text-right">
            <p className="text-sm font-medium text-[#F7F6F3] capitalize">{user.username}</p>
            <p className="text-xs text-[#7C8C9A] capitalize">{user.role}</p>
          </div>
        )}

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-[#C89D4E]/20 border border-[#C89D4E]/40 flex items-center justify-center text-[#C89D4E] font-bold text-sm">
          {user?.username?.[0]?.toUpperCase() ?? "R"}
        </div>
      </div>
    </nav>
  );
}
