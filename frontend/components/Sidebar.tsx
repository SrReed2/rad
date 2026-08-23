"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth, Role } from "../context/AuthContext";
import { useRouter } from "next/navigation";

const ALL_ROLES: Role[] = ["director", "profesor_matematicas", "profesor_ingles", "profesor_quimica"];

const ALL_NAV_ITEMS: { label: string; href: string; icon: string; roles: Role[] }[] = [
  { label: "Dashboard", href: "/dashboard", icon: "▦", roles: ALL_ROLES },
  { label: "Estudiantes", href: "/students", icon: "◈", roles: ["director"] },
  { label: "Asistencia", href: "/attendance", icon: "◷", roles: ALL_ROLES },
  { label: "Predicciones", href: "/predictions", icon: "◉", roles: ["director"] },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  // Menú filtrado dinámicamente según el rol de la sesión activa.
  const NAV_ITEMS = ALL_NAV_ITEMS.filter((item) => user && item.roles.includes(user.role));

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside className="w-72 min-h-screen bg-[#1F2E3D] border-r border-[#2C3D4E] flex flex-col">
      {/* Logo — esquina superior izquierda, fondo exacto de la imagen para que se integre sin bordes */}
      <div
        className="flex items-center gap-3 pl-3 pr-5 py-3 border-b border-[#2C3D4E]"
        style={{ backgroundColor: "#F9F8F6" }}
      >
        <img
          src="/brand/sofia-icon.png"
          alt="SOFÍA"
          className="w-11 h-11 rounded-full shrink-0"
        />
        <div className="leading-tight">
          <p className="font-serif text-xl font-bold text-[#1F2E3D]">SOFÍA</p>
          <p className="text-[9px] text-[#6B6152] tracking-widest uppercase">
            Panel Académico
          </p>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex flex-col gap-1 px-5 mt-5">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-5 py-3.5 rounded-lg text-sm font-medium
                transition-all duration-200
                ${
                  isActive
                    ? "bg-[#7FB8C9]/15 text-[#7FB8C9] border border-[#7FB8C9]/30"
                    : "text-[#B9AD97] hover:text-[#F1E9D8] hover:bg-[#2C3F54]"
                }
              `}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#7FB8C9]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer del sidebar */}
      <div className="mt-auto p-6 space-y-3">
        {/* Estado del sistema */}
        <div className="bg-[#2C3F54] rounded-lg p-4 border border-[#37495B]">
          <p className="text-xs text-[#B9AD97] mb-1">Estado del Sistema</p>
          <p className="text-[#7FB8C9] font-semibold text-sm">● Online</p>
        </div>

        {/* Usuario */}
        {user && (
          <div className="bg-[#24384A] rounded-lg p-3 border border-[#2C3D4E] flex items-center justify-between">
            <div>
              <p className="text-xs text-[#B9AD97]">Sesión</p>
              <p className="text-sm text-[#F1E9D8] font-medium capitalize">{user.username}</p>
              <p className="text-xs text-[#96876E] capitalize">{user.role}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Cerrar sesión"
              className="text-[#96876E] hover:text-[#D98B78] transition-colors text-xl p-1"
            >
              ⏻
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
