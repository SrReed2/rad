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
    <nav className="sticky top-0 z-50 bg-[#1F2E3D] border-b border-[#2C3D4E] px-8 py-4 flex justify-between items-center">
      <div>
        <h1 className="text-lg font-semibold text-[#F1E9D8]">
          Dashboard Académico
        </h1>
        <p className="text-xs text-[#96876E] capitalize">{today}</p>
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
        <span className="hidden sm:flex items-center gap-1.5 text-xs text-[#7FB8C9]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#7FB8C9] animate-pulse" />
          Online
        </span>

        {/* Usuario */}
        {user && (
          <div className="text-right">
            <p className="text-sm font-medium text-[#F1E9D8] capitalize">{user.username}</p>
            <p className="text-xs text-[#96876E] capitalize">{user.role}</p>
          </div>
        )}

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-[#7FB8C9]/20 border border-[#7FB8C9]/40 flex items-center justify-center text-[#7FB8C9] font-bold text-sm">
          {user?.username?.[0]?.toUpperCase() ?? "R"}
        </div>
      </div>
    </nav>
  );
}
