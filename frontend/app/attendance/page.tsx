"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import ProtectedRoute from "../../components/ProtectedRoute";
import { useStudents } from "../../context/StudentsContext";
import { useAuth, ROLE_SUBJECTS } from "../../context/AuthContext";
import { getRisk } from "../../components/StudentTable";

// Code splitting: chart.js queda en un chunk separado del bundle principal.
const AttendanceChart = dynamic(() => import("../../components/AttendanceChart"), {
  ssr: false,
  loading: () => (
    <div className="bg-white p-6 rounded-xl border border-gray-800 h-[300px] animate-pulse" />
  ),
});

const RISK_BADGE: Record<string, string> = {
  Bajo: "bg-cyan-500/20 text-cyan-400",
  Medio: "bg-yellow-500/20 text-yellow-400",
  Alto: "bg-red-500/20 text-red-400",
};

const getAttBar = (val: number) => {
  const color = val >= 85 ? "bg-cyan-500" : val >= 80 ? "bg-yellow-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-gray-800 rounded-full h-2">
        <div className={`${color} h-2 rounded-full`} style={{ width: `${val}%` }} />
      </div>
      <span className="text-xs font-mono w-10 text-right">{val}%</span>
    </div>
  );
};

export default function AttendancePage() {
  const { students: allStudents } = useStudents();
  const { user } = useAuth();
  const subjectFilter = user ? ROLE_SUBJECTS[user.role] : null;

  // Si el rol tiene materia asignada (cualquier profesor), solo ve su propia clase.
  const students = useMemo(
    () => (subjectFilter ? allStudents.filter((s) => s.subject === subjectFilter) : allStudents),
    [allStudents, subjectFilter]
  );

  const [search, setSearch] = useState("");
  const [filterRisk, setFilterRisk] = useState<"Todos" | "Alto" | "Medio" | "Bajo">("Todos");

  // Filtrado + orden cronológico (por id de registro) — se recalcula solo si cambian sus dependencias.
  const filtered = useMemo(() => {
    return students
      .filter((s) => {
        const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
        const risk = getRisk(s.grade, s.attendance);
        const matchRisk = filterRisk === "Todos" || risk === filterRisk;
        return matchSearch && matchRisk;
      })
      .sort((a, b) => a.id - b.id);
  }, [students, search, filterRisk]);

  const { avgAttendance, critical, good } = useMemo(() => {
    const avg =
      students.length > 0
        ? Math.round(students.reduce((acc, s) => acc + s.attendance, 0) / students.length)
        : 0;
    return {
      avgAttendance: avg,
      critical: students.filter((s) => s.attendance < 80).length,
      good: students.filter((s) => s.attendance >= 90).length,
    };
  }, [students]);

  return (
    <ProtectedRoute
      allowedRoles={["director", "profesor_matematicas", "profesor_ingles", "profesor_quimica"]}
    >
    <div className="flex min-h-screen bg-[#F7F6F3]">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-5xl font-black bg-gradient-to-r from-[#0D2B45] to-[#C89D4E] bg-clip-text text-transparent">
              Asistencia{subjectFilter ? ` — ${subjectFilter}` : ""}
            </h1>
            <p className="text-gray-400 mt-2">
              {subjectFilter
                ? "Registro de asistencia de tu clase, solo lectura."
                : "Control de asistencia y seguimiento por estudiante."}
            </p>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-5 rounded-xl border border-gray-800">
              <p className="text-gray-400 text-sm">Promedio General</p>
              <h2 className="text-3xl font-bold text-[#0D2B45] mt-1">{avgAttendance}%</h2>
            </div>
            <div className="bg-white p-5 rounded-xl border border-green-500/20">
              <p className="text-gray-400 text-sm">Asistencia ≥ 90%</p>
              <h2 className="text-3xl font-bold text-green-400 mt-1">{good}</h2>
            </div>
            <div className="bg-white p-5 rounded-xl border border-red-500/20">
              <p className="text-gray-400 text-sm">Asistencia Crítica &lt; 80%</p>
              <h2 className="text-3xl font-bold text-red-400 mt-1">{critical}</h2>
            </div>
          </div>

          {/* Gráfico */}
          <div className="mb-8">
            <AttendanceChart />
          </div>

          {/* Tabla de asistencia */}
          <div className="bg-white rounded-xl p-6 border border-gray-800">
            <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-[#0D2B45]">
                Registro de Asistencia
              </h2>

              <div className="flex gap-3 flex-wrap">
                {/* Búsqueda */}
                <input
                  type="text"
                  placeholder="Buscar estudiante..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-[#F7F6F3] border border-gray-700 rounded-lg px-4 py-2 text-sm text-[#0D2B45] outline-none focus:border-[#0D2B45] transition-colors"
                />

                {/* Filtro riesgo */}
                {(["Todos", "Alto", "Medio", "Bajo"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setFilterRisk(r)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      filterRisk === r
                        ? "bg-[#0D2B45]/20 text-[#0D2B45] border border-[#0D2B45]/30"
                        : "border border-gray-700 text-gray-400 hover:text-gray-200"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#EBECEA]">
                  <tr className="text-left text-gray-400">
                    <th className="p-4">Estudiante</th>
                    <th className="hidden md:table-cell">Materia</th>
                    <th>Asistencia</th>
                    <th className="hidden lg:table-cell">Riesgo</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-12 text-gray-500">
                        Sin resultados para los filtros actuales.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((s) => {
                      const risk = getRisk(s.grade, s.attendance);
                      return (
                        <tr
                          key={s.id}
                          className="border-t border-gray-800 hover:bg-[#EBECEA] transition-colors"
                        >
                          <td className="p-4 font-medium text-[#0D2B45]">{s.name}</td>
                          <td className="hidden md:table-cell text-gray-400">
                            {s.subject ?? "—"}
                          </td>
                          <td className="pr-4 w-48">{getAttBar(s.attendance)}</td>
                          <td className="hidden lg:table-cell">
                            <span className={`${RISK_BADGE[risk]} px-3 py-1 rounded-full text-xs font-medium`}>
                              {risk}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
    </ProtectedRoute>
  );
}
