"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "▦" },
  { label: "Estudiantes", href: "/students", icon: "◈" },
  { label: "Asistencia", href: "/attendance", icon: "◷" },
  { label: "Predicciones", href: "/predictions", icon: "◉" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside className="w-72 min-h-screen bg-[#202027] border-r border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="p-8 border-b border-gray-800">
        <h1 className="text-4xl font-black text-[#06B6D4] tracking-tight">RAD</h1>
        <p className="text-xs text-gray-500 mt-1 tracking-widest uppercase">
          Risk Analysis Dashboard
        </p>
      </div>

      {/* Navegación */}
      <nav className="flex flex-col gap-1 px-4 mt-6">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                transition-all duration-200
                ${
                  isActive
                    ? "bg-[#06B6D4]/15 text-[#06B6D4] border border-[#06B6D4]/30"
                    : "text-gray-400 hover:text-[#E5E7EB] hover:bg-[#2E2E38]"
                }
              `}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#06B6D4]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer del sidebar */}
      <div className="mt-auto p-6 space-y-3">
        {/* Estado del sistema */}
        <div className="bg-[#2E2E38] rounded-lg p-4 border border-gray-700">
          <p className="text-xs text-gray-400 mb-1">Estado del Sistema</p>
          <p className="text-cyan-400 font-semibold text-sm">● Online</p>
        </div>

        {/* Usuario */}
        {user && (
          <div className="bg-[#25252D] rounded-lg p-3 border border-gray-800 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400">Sesión</p>
              <p className="text-sm text-[#E5E7EB] font-medium capitalize">{user.username}</p>
              <p className="text-xs text-gray-500 capitalize">{user.role}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Cerrar sesión"
              className="text-gray-500 hover:text-red-400 transition-colors text-xl p-1"
            >
              ⏻
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
