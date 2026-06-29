import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { StudentsProvider } from "../context/StudentsContext";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RAD - Risk Analysis Dashboard",
  description: "Plataforma de análisis de riesgo académico estudiantil",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${geist.className} bg-[#1A1A1F] text-[#E5E7EB]`}>
        <AuthProvider>
          <StudentsProvider>
            {children}
          </StudentsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
