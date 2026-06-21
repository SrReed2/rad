"use client";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

export default function RiskChart() {
  const data = {
    labels: [
      "Bajo",
      "Medio",
      "Alto",
    ],

    datasets: [
      {
        data: [78, 10, 12],

        backgroundColor: [
          "#06B6D4",
          "#1E3A8A",
          "#EF4444",
        ],
      },
    ],
  };

  return (
    <div className="bg-[#25252D] p-6 rounded-xl border border-gray-800">
      <h2 className="text-xl font-bold mb-4">
        Distribución de Riesgo
      </h2>

      <Pie data={data} />
    </div>
  );
}