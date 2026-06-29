import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import StudentsPageClient from "./StudentsPageClient";

export default function StudentsPage() {
  return (
    <div className="flex min-h-screen bg-[#1A1A1F]">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-8">
          <div className="mb-8">
            <h1 className="text-5xl font-black bg-gradient-to-r from-[#06B6D4] to-[#1E3A8A] bg-clip-text text-transparent">
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
  );
}
