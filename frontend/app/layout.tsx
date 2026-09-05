import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { StudentsProvider } from "../context/StudentsContext";

export const metadata: Metadata = {
  title: "SOFÍA - Panel de Análisis Académico",
  description: "Plataforma de análisis de riesgo académico estudiantil",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-[#F6EFE0] text-[#26313D]">
        <AuthProvider>
          <StudentsProvider>
            {children}
          </StudentsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
