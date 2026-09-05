"use client";

import dynamic from "next/dynamic";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import StatCard from "../../components/StatCard";
import StudentTable from "../../components/StudentTable";
import ProtectedRoute from "../../components/ProtectedRoute";
import SubjectDashboard from "../../components/SubjectDashboard";
import { useAuth, ROLE_SUBJECTS } from "../../context/AuthContext";

import { stats } from "../../data/mockData";

// Code splitting: chart.js/react-chartjs-2 se cargan en un chunk aparte,
// solo cuando el dashboard se monta, en vez de ir en el bundle principal.
const ChartSkeleton = () => (
  <div className="bg-white p-6 rounded-xl border border-gray-800 h-[300px] animate-pulse" />
);
const AttendanceChart = dynamic(() => import("../../components/AttendanceChart"), {
  ssr: false,
  loading: ChartSkeleton,
});
const RiskChart = dynamic(() => import("../../components/RiskChart"), {
  ssr: false,
  loading: ChartSkeleton,
});

// Dashboard original del Director — sin cambios respecto a la versión previa.
function DirectorDashboard() {
  return (
    <>

          {/* HEADER */}

          <div className="mb-8">
            <h1 className="font-serif text-5xl font-bold bg-gradient-to-r from-[#0D2B45] to-[#C89D4E] bg-clip-text text-transparent">
              Dashboard Académico
            </h1>

            <p className="text-gray-400 mt-2">
              Monitoreo general del rendimiento estudiantil.
            </p>
          </div>

          <div className="flex gap-6 mt-4 mb-8">

            <span className="text-green-400 text-sm">
              ● 150 estudiantes activos
            </span>

            <span className="text-cyan-400 text-sm">
              ● 91% asistencia promedio
            </span>

            <span className="text-yellow-400 text-sm">
              ● 10% seguimiento
            </span>

          </div>

          {/* RESUMEN */}

          <div className="bg-white rounded-xl border border-gray-800 p-6 mb-8 shadow-lg">

            <h2 className="font-serif text-xl font-semibold text-[#0D2B45] mb-3">
              Resumen General
            </h2>

            <p className="text-gray-400 leading-relaxed">
              SOFÍA analiza asistencia, rendimiento académico y factores de riesgo
              para apoyar la toma de decisiones educativas.
            </p>

          </div>

          {/* KPIs */}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

            {stats.map((stat) => (
              <StatCard
                key={stat.title}
                title={stat.title}
                value={stat.value}
              />
            ))}

          </div>

          {/* ALERTAS */}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

            <div className="bg-white rounded-xl border border-red-500/30 p-5">

              <h3 className="text-red-400 font-semibold mb-2">
                Riesgo Alto
              </h3>

              <p className="text-gray-300">
                12% de los estudiantes presentan indicadores críticos.
              </p>

            </div>

            <div className="bg-white rounded-xl border border-yellow-500/30 p-5">

              <h3 className="text-yellow-400 font-semibold mb-2">
                Seguimiento
              </h3>

              <p className="text-gray-300">
                10% requieren monitoreo constante.
              </p>

            </div>

            <div className="bg-white rounded-xl border border-cyan-500/30 p-5">

              <h3 className="text-cyan-400 font-semibold mb-2">
                Rendimiento
              </h3>

              <p className="text-gray-300">
                La mayoría mantiene desempeño estable.
              </p>

            </div>

          </div>

          {/* GRÁFICOS */}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">

            <AttendanceChart />

            <RiskChart />

          </div>

          {/* TABLA — vista general, solo lectura. Editar/eliminar vive en Estudiantes. */}
          <StudentTable readOnly />
    </>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const subject = user ? ROLE_SUBJECTS[user.role] : null;

  return (
    <ProtectedRoute
      allowedRoles={["director", "profesor_matematicas", "profesor_ingles", "profesor_quimica"]}
    >
      <div className="flex min-h-screen bg-[#F7F6F3]">
        <Sidebar />

        <div className="flex-1">
          <Navbar />

          <main className="p-8">
            {subject ? <SubjectDashboard subject={subject} /> : <DirectorDashboard />}
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}