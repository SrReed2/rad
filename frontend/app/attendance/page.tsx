"use client";

import { useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import AttendanceChart from "../../components/AttendanceChart";
import { useStudents } from "../../context/StudentsContext";
import { getRisk } from "../../components/StudentTable";

const MONTHS = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

export default function AttendancePage() {
  const { students } = useStudents();
  const [search, setSearch] = useState("");
  const [filterRisk, setFilterRisk] = useState<"Todos" | "Alto" | "Medio" | "Bajo">("Todos");

  const filtered = students.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const risk = getRisk(s.grade, s.attendance);
    const matchRisk = filterRisk === "Todos" || risk === filterRisk;
    return matchSearch && matchRisk;
  });

  const avgAttendance =
    students.length > 0
      ? Math.round(students.reduce((acc, s) => acc + s.attendance, 0) / students.length)
      : 0;

  const critical = students.filter((s) => s.attendance < 70).length;
  const good = students.filter((s) => s.attendance >= 90).length;

  const getAttBar = (val: number) => {
    const color = val >= 85 ? "bg-cyan-500" : val >= 70 ? "bg-yellow-500" : "bg-red-500";
    return (
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-gray-800 rounded-full h-2">
          <div className={`${color} h-2 rounded-full`} style={{ width: `${val}%` }} />
        </div>
        <span className="text-xs font-mono w-10 text-right">{val}%</span>
      </div>
    );
  };

  const RISK_BADGE: Record<string, string> = {
    Bajo: "bg-cyan-500/20 text-cyan-400",
    Medio: "bg-yellow-500/20 text-yellow-400",
    Alto: "bg-red-500/20 text-red-400",
  };

  return (
    <div className="flex min-h-screen bg-[#1A1A1F]">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-5xl font-black bg-gradient-to-r from-[#06B6D4] to-[#1E3A8A] bg-clip-text text-transparent">
              Asistencia
            </h1>
            <p className="text-gray-400 mt-2">
              Control de asistencia y seguimiento por estudiante.
            </p>
          </div>

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-[#25252D] p-5 rounded-xl border border-gray-800">
              <p className="text-gray-400 text-sm">Promedio General</p>
              <h2 className="text-3xl font-bold text-[#06B6D4] mt-1">{avgAttendance}%</h2>
            </div>
            <div className="bg-[#25252D] p-5 rounded-xl border border-green-500/20">
              <p className="text-gray-400 text-sm">Asistencia ≥ 90%</p>
              <h2 className="text-3xl font-bold text-green-400 mt-1">{good}</h2>
            </div>
            <div className="bg-[#25252D] p-5 rounded-xl border border-red-500/20">
              <p className="text-gray-400 text-sm">Asistencia Crítica &lt; 70%</p>
              <h2 className="text-3xl font-bold text-red-400 mt-1">{critical}</h2>
            </div>
          </div>

          {/* Gráfico */}
          <div className="mb-8">
            <AttendanceChart />
          </div>

          {/* Tabla de asistencia */}
          <div className="bg-[#25252D] rounded-xl p-6 border border-gray-800">
            <div className="flex flex-col md:flex-row gap-4 mb-6 items-start md:items-center justify-between">
              <h2 className="text-xl font-bold text-[#E5E7EB]">
                Registro de Asistencia
              </h2>

              <div className="flex gap-3 flex-wrap">
                {/* Búsqueda */}
                <input
                  type="text"
                  placeholder="Buscar estudiante..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-[#1A1A1F] border border-gray-700 rounded-lg px-4 py-2 text-sm text-[#E5E7EB] outline-none focus:border-[#06B6D4] transition-colors"
                />

                {/* Filtro riesgo */}
                {(["Todos", "Alto", "Medio", "Bajo"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setFilterRisk(r)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      filterRisk === r
                        ? "bg-[#06B6D4]/20 text-[#06B6D4] border border-[#06B6D4]/30"
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
                <thead className="bg-[#2E2E38]">
                  <tr className="text-left text-gray-400">
                    <th className="p-4">Estudiante</th>
                    <th className="hidden md:table-cell">Materia</th>
                    <th>Asistencia</th>
                    <th className="hidden lg:table-cell">Riesgo</th>
                    <th className="hidden xl:table-cell">Mes actual</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-gray-500">
                        Sin resultados para los filtros actuales.
                      </td>
                    </tr>
                  ) : (
                    filtered.map((s) => {
                      const risk = getRisk(s.grade, s.attendance);
                      const currentMonth = MONTHS[new Date().getMonth()];
                      return (
                        <tr
                          key={s.id}
                          className="border-t border-gray-800 hover:bg-[#2E2E38] transition-colors"
                        >
                          <td className="p-4 font-medium text-[#E5E7EB]">{s.name}</td>
                          <td className="hidden md:table-cell text-gray-400">
                            {s.subject ?? "—"}
                          </td>
                          <td className="pr-4 w-48">{getAttBar(s.attendance)}</td>
                          <td className="hidden lg:table-cell">
                            <span className={`${RISK_BADGE[risk]} px-3 py-1 rounded-full text-xs font-medium`}>
                              {risk}
                            </span>
                          </td>
                          <td className="hidden xl:table-cell text-gray-400 text-xs">
                            {currentMonth}: {s.attendance}%
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
  );
}
