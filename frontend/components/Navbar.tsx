"use client";

import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user } = useAuth();

  const today = new Date().toLocaleDateString("es-NI", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <nav className="sticky top-0 z-50 bg-[#202027] border-b border-gray-800 px-8 py-4 flex justify-between items-center">
      <div>
        <h1 className="text-lg font-bold text-[#E5E7EB]">
          Dashboard Académico
        </h1>
        <p className="text-xs text-gray-500 capitalize">{today}</p>
      </div>

      <div className="flex items-center gap-4">
        {/* Indicador online */}
        <span className="hidden sm:flex items-center gap-1.5 text-xs text-cyan-400">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          Online
        </span>

        {/* Usuario */}
        {user && (
          <div className="text-right">
            <p className="text-sm font-medium text-[#E5E7EB] capitalize">{user.username}</p>
            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
          </div>
        )}

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-[#06B6D4]/20 border border-[#06B6D4]/40 flex items-center justify-center text-[#06B6D4] font-bold text-sm">
          {user?.username?.[0]?.toUpperCase() ?? "R"}
        </div>
      </div>
    </nav>
  );
}
