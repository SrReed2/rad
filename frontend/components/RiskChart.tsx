"use client";

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

  const counts = { Bajo: 0, Medio: 0, Alto: 0 };
  students.forEach((s) => {
    counts[getRisk(s.grade, s.attendance)]++;
  });

  const data = {
    labels: ["Bajo", "Medio", "Alto"],
    datasets: [
      {
        data: [counts.Bajo, counts.Medio, counts.Alto],
        backgroundColor: ["#06B6D4", "#EAB308", "#EF4444"],
        borderColor: ["#25252D", "#25252D", "#25252D"],
        borderWidth: 3,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        labels: { color: "#9CA3AF", font: { size: 12 } },
      },
    },
  };

  return (
    <div className="bg-[#25252D] p-6 rounded-xl border border-gray-800">
      <h2 className="text-xl font-bold text-[#E5E7EB] mb-4">
        Distribución de Riesgo
      </h2>
      <div className="max-w-xs mx-auto">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}
