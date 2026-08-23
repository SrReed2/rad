import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Fraunces } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { StudentsProvider } from "../context/StudentsContext";

const geist = Geist({
  subsets: ["latin"],
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  title: "SOFIA",
  description: "Plataforma de análisis de riesgo académico estudiantil",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${geist.className} ${fraunces.variable} bg-[#F6EFE0] text-[#26313D]`}>
        <AuthProvider>
          <StudentsProvider>
            {children}
          </StudentsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
