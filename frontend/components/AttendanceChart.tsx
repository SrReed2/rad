"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function AttendanceChart() {
  const data = {
    labels: [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
    ],

    datasets: [
      {
        label: "Asistencia",
        data: [75, 82, 79, 85, 90, 92],
        borderColor: "#0D2B45",
        backgroundColor: "rgba(13, 43, 69, 0.08)",
        pointBackgroundColor: "#0D2B45",
        pointBorderColor: "#FFFFFF",
        pointRadius: 4,
        tension: 0.35,
        fill: true,
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-800">

      <h2 className="font-serif text-xl font-bold text-[#0D2B45] mb-4">
        Evolución de Asistencia
      </h2>

      <Line data={data} />

    </div>
  );
}