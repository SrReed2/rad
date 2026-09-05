"use client";

import { useMemo } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import { useStudents } from "../context/StudentsContext";
import { getRisk } from "./StudentTable";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function RiskChart() {
  const { students } = useStudents();

  // useMemo: evita recalcular el conteo de riesgo en cada render;
  // solo se recalcula si cambia la lista de estudiantes.
  const counts = useMemo(() => {
    const c = { Bajo: 0, Medio: 0, Alto: 0 };
    students.forEach((s) => {
      c[getRisk(s.grade, s.attendance)]++;
    });
    return c;
  }, [students]);

  const data = {
    labels: ["Bajo", "Medio", "Alto"],
    datasets: [
      {
        data: [counts.Bajo, counts.Medio, counts.Alto],
        backgroundColor: ["#0D2B45", "#9C7A34", "#8B4130"],
        borderColor: ["#F7F6F3", "#F7F6F3", "#F7F6F3"],
        borderWidth: 3,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        labels: { color: "#506577", font: { size: 12 } },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-800">
      <h2 className="font-serif text-xl font-bold text-[#0D2B45] mb-4">
        Distribución de Riesgo
      </h2>
      <div className="max-w-xs mx-auto">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}
