"use client";

import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import ProtectedRoute from "../../components/ProtectedRoute";
import StudentsPageClient from "./StudentsPageClient";

export default function StudentsPage() {
  return (
    <ProtectedRoute allowedRoles={["director"]}>
      <div className="flex min-h-screen bg-[#F7F6F3]">
        <Sidebar />
        <div className="flex-1">
          <Navbar />
          <main className="p-8">
            <div className="mb-8">
              <h1 className="font-serif text-5xl font-black bg-gradient-to-r from-[#0D2B45] to-[#C89D4E] bg-clip-text text-transparent">
                Gestión de Estudiantes
              </h1>
              <p className="text-gray-400 mt-2">
                Registro, edición y monitoreo de riesgo académico.
              </p>
            </div>

            <StudentsPageClient />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
