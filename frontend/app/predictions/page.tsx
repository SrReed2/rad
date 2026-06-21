import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";

import { predictions } from "../../data/predictions";

export default function PredictionsPage() {
  return (
    <div className="flex bg-[#1A1A1F] min-h-screen">

      <Sidebar />

      <div className="flex-1">

        <Navbar />

        <main className="p-8">

          <h1 className="text-3xl font-bold text-[#E5E7EB] mb-8">
            Predicciones de Riesgo
          </h1>

          <div className="grid grid-cols-3 gap-6 mb-8">

            <div className="bg-[#25252D] p-6 rounded-xl border border-gray-800">
              <h3>Bajo Riesgo</h3>
              <p className="text-4xl font-bold mt-2">78%</p>
            </div>

            <div className="bg-[#25252D] p-6 rounded-xl border border-gray-800">
              <h3>Riesgo Medio</h3>
              <p className="text-4xl font-bold mt-2">10%</p>
            </div>

            <div className="bg-[#25252D] p-6 rounded-xl border border-gray-800">
              <h3>Riesgo Alto</h3>
              <p className="text-4xl font-bold mt-2">12%</p>
            </div>

          </div>

          <div className="bg-[#25252D] rounded-xl p-6 border border-gray-800">

            <table className="w-full">

              <thead>

                <tr className="text-left text-gray-400">

                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Riesgo</th>

                </tr>

              </thead>

              <tbody>

                {predictions.map((student) => (

                  <tr
                    key={student.id}
                    className="border-t border-gray-800"
                  >

                    <td className="py-3">
                      {student.id}
                    </td>

                    <td>
                      {student.name}
                    </td>

                    <td>
                      {student.risk}
                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

        </main>

      </div>

    </div>
  );
}