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
        backgroundColor: ["#14495C", "#9C7A34", "#8B4130"],
        borderColor: ["#F6EFE0", "#F6EFE0", "#F6EFE0"],
        borderWidth: 3,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        labels: { color: "#6B6152", font: { size: 12 } },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-800">
      <h2 className="font-serif text-xl font-bold text-[#26313D] mb-4">
        Distribución de Riesgo
      </h2>
      <div className="max-w-xs mx-auto">
        <Pie data={data} options={options} />
      </div>
    </div>
  );
}
