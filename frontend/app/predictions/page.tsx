"use client";

import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import RiskChart from "../../components/RiskChart";
import { useStudents } from "../../context/StudentsContext";
import { getRisk, getStatus } from "../../components/StudentTable";
import { apiFetch } from "../../lib/api";

interface RiskResult {
  student_id: number;
  risk_score: number;
  status: string;
}

const RISK_STYLES = {
  Bajo: {
    badge: "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30",
    card: "border-cyan-500/30",
    label: "text-cyan-400",
  },
  Medio: {
    badge: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
    card: "border-yellow-500/30",
    label: "text-yellow-400",
  },
  Alto: {
    badge: "bg-red-500/20 text-red-400 border border-red-500/30",
    card: "border-red-500/30",
    label: "text-red-400",
  },
};

export default function PredictionsPage() {
  const { students } = useStudents();
  const [riskResults, setRiskResults] = useState<RiskResult[]>([]);

  useEffect(() => {
    apiFetch<{ results: RiskResult[] }>("/predictions/risk")
      .then((response) => setRiskResults(response.results))
      .catch(console.error);
  }, []);

  const riskForStudent = (studentId: number, grade: number, attendance: number) => {
    const prediction = riskResults.find((result) => result.student_id === studentId);
    if (!prediction) return getRisk(grade, attendance);
    if (prediction.risk_score > 0.66) return "Alto" as const;
    if (prediction.risk_score > 0.33) return "Medio" as const;
    return "Bajo" as const;
  };

  // Calcular distribución dinámica desde el contexto
  const total = students.length;
  const counts = { Bajo: 0, Medio: 0, Alto: 0 };
  students.forEach((s) => {
    counts[riskForStudent(s.id, s.grade, s.attendance)]++;
  });

  const pct = (n: number) =>
    total > 0 ? Math.round((n / total) * 100) : 0;

  // Ordenar por riesgo: Alto primero
  const ORDER = { Alto: 0, Medio: 1, Bajo: 2 };
  const sorted = [...students].sort(
    (a, b) =>
      ORDER[riskForStudent(a.id, a.grade, a.attendance)] -
      ORDER[riskForStudent(b.id, b.grade, b.attendance)]
  );

  return (
    <div className="flex min-h-screen bg-[#F6EFE0]">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <main className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif text-5xl font-black bg-gradient-to-r from-[#14495C] to-[#B78A4D] bg-clip-text text-transparent">
              Predicciones de Riesgo
            </h1>
            <p className="text-gray-400 mt-2">
              Clasificación automática basada en nota y asistencia.
              {/* TODO Agosto: conectar al endpoint de inferencia ML */}
            </p>
          </div>

          {/* Distribución */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {(["Bajo", "Medio", "Alto"] as const).map((level) => (
              <div
                key={level}
                className={`bg-white p-6 rounded-xl border ${RISK_STYLES[level].card}`}
              >
                <p className="text-gray-400 text-sm mb-1">{level} Riesgo</p>
                <p className={`text-4xl font-black mt-2 ${RISK_STYLES[level].label}`}>
                  {pct(counts[level])}%
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  {counts[level]} de {total} estudiantes
                </p>
                {/* Barra */}
                <div className="mt-3 bg-gray-800 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full ${
                      level === "Bajo" ? "bg-cyan-500" : level === "Medio" ? "bg-yellow-500" : "bg-red-500"
                    }`}
                    style={{ width: `${pct(counts[level])}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Gráfico + info */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
            <RiskChart />

            <div className="bg-white p-6 rounded-xl border border-gray-800">
              <h3 className="font-serif text-lg font-bold text-[#26313D] mb-4">
                Criterios de Clasificación
              </h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                  <span className="text-red-400 text-lg mt-0.5">●</span>
                  <div>
                    <p className="text-red-400 font-semibold">Riesgo Alto</p>
                    <p className="text-gray-400 mt-0.5">
                      Nota &lt; 65 <em>o</em> asistencia &lt; 70%. Requiere intervención inmediata.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
                  <span className="text-yellow-400 text-lg mt-0.5">●</span>
                  <div>
                    <p className="text-yellow-400 font-semibold">Riesgo Medio</p>
                    <p className="text-gray-400 mt-0.5">
                      Nota &lt; 80 <em>o</em> asistencia &lt; 85%. Monitoreo continuo recomendado.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/20">
                  <span className="text-cyan-400 text-lg mt-0.5">●</span>
                  <div>
                    <p className="text-cyan-400 font-semibold">Bajo Riesgo</p>
                    <p className="text-gray-400 mt-0.5">
                      Nota ≥ 80 y asistencia ≥ 85%. Desempeño estable.
                    </p>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-lg bg-[#F1E8D6] border border-gray-700">
                  <p className="text-xs text-gray-500">
                    ⚙️ <span className="text-gray-400">Agosto:</span> se integrará el endpoint de inferencia
                    ML para predicciones basadas en múltiples variables.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabla completa */}
          <div className="bg-white rounded-xl p-6 border border-gray-800">
            <h2 className="font-serif text-xl font-bold text-[#26313D] mb-5">
              Listado por Nivel de Riesgo
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#F1E8D6]">
                  <tr className="text-left text-gray-400">
                    <th className="p-4">ID</th>
                    <th>Nombre</th>
                    <th className="hidden md:table-cell">Materia</th>
                    <th>Nota</th>
                    <th>Asistencia</th>
                    <th>Estado</th>
                    <th>Riesgo</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((s) => {
                    const risk = riskForStudent(s.id, s.grade, s.attendance);
                    const status = getStatus(s.grade);
                    return (
                      <tr
                        key={s.id}
                        className="border-t border-gray-800 hover:bg-[#F1E8D6] transition-colors"
                      >
                        <td className="p-4 text-gray-400">{s.id}</td>
                        <td className="font-medium text-[#26313D]">{s.name}</td>
                        <td className="hidden md:table-cell text-gray-400">
                          {s.subject ?? "—"}
                        </td>
                        <td className="font-mono">{s.grade}</td>
                        <td className="font-mono">{s.attendance}%</td>
                        <td>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              status === "Aprobado"
                                ? "bg-green-500/20 text-green-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {status}
                          </span>
                        </td>
                        <td>
                          <span className={`${RISK_STYLES[risk].badge} px-3 py-1 rounded-full text-xs font-medium`}>
                            {risk}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
