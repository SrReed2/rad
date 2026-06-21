import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RAD Dashboard",
  description: "Risk Analysis Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${geist.className} bg-[#1A1A1F] text-[#E5E7EB]`}
      >
        {children}
      </body>
    </html>
  );
}