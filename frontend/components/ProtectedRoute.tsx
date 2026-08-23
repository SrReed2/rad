"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, Role } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  /** Roles permitidos para esta ruta. Si se omite, solo exige estar autenticado. */
  allowedRoles?: Role[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const forbidden = !!user && !!allowedRoles && !allowedRoles.includes(user.role);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (forbidden) {
      // Autenticado pero sin permiso para esta vista → lo mandamos a su dashboard.
      router.replace("/dashboard");
    }
  }, [user, isLoading, forbidden, router]);

  if (isLoading || !user || forbidden) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F6EFE0] text-gray-400">
        Verificando sesión...
      </div>
    );
  }

  return <>{children}</>;
}
