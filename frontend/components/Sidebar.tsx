"use client";

import Image from "next/image";
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
    <aside className="w-72 min-h-screen bg-[#0D2B45] border-r border-[#1E3A52] flex flex-col">
      {/* Logo — esquina superior izquierda, fondo exacto de la imagen para que se integre sin bordes */}
      <div
        className="flex items-center gap-3 pl-3 pr-5 py-3 border-b border-[#1E3A52]"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <Image
          src="/brand/sofia-icon.png"
          alt="SOFÍA"
          width={44}
          height={44}
          priority
          className="w-11 h-11 rounded-full shrink-0"
        />
        <div className="leading-tight">
          <p className="font-serif text-xl font-bold text-[#0D2B45]">SOFÍA</p>
          <p className="text-[9px] text-[#506577] tracking-widest uppercase">
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
                    ? "bg-[#C89D4E]/15 text-[#C89D4E] border border-[#C89D4E]/30"
                    : "text-[#A5B0BA] hover:text-[#F7F6F3] hover:bg-[#233E56]"
                }
              `}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#C89D4E]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer del sidebar */}
      <div className="mt-auto p-6 space-y-3">
        {/* Estado del sistema */}
        <div className="bg-[#233E56] rounded-lg p-4 border border-[#344D63]">
          <p className="text-xs text-[#A5B0BA] mb-1">Estado del Sistema</p>
          <p className="text-[#C89D4E] font-semibold text-sm">● Online</p>
        </div>

        {/* Usuario */}
        {user && (
          <div className="bg-[#19364E] rounded-lg p-3 border border-[#1E3A52] flex items-center justify-between">
            <div>
              <p className="text-xs text-[#A5B0BA]">Sesión</p>
              <p className="text-sm text-[#F7F6F3] font-medium capitalize">{user.username}</p>
              <p className="text-xs text-[#7C8C9A] capitalize">{user.role}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Cerrar sesión"
              className="text-[#7C8C9A] hover:text-[#D98B78] transition-colors text-xl p-1"
            >
              ⏻
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
