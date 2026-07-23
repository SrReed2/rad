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
    <nav className="sticky top-0 z-50 bg-[#1F2E3D] border-b border-[#2C3D4E] px-8 py-4 flex justify-between items-center">
      <div>
        <h1 className="text-lg font-semibold text-[#F1E9D8]">
          Dashboard Académico
        </h1>
        <p className="text-xs text-[#96876E] capitalize">{today}</p>
      </div>

      <div className="flex items-center gap-4">
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
