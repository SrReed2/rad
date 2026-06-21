import { students } from "../data/students";

export default function StudentTable() {
  const getRisk = (
    grade: number,
    attendance: number
  ) => {
    if (grade < 65 || attendance < 70)
      return "Alto";

    if (grade < 80 || attendance < 85)
      return "Medio";

    return "Bajo";
  };

  const getStatus = (grade: number) => {
    return grade >= 70
      ? "Aprobado"
      : "Reprobado";
  };

  return (
    <div className="bg-[#25252D] rounded-xl p-6 border border-gray-800">

      <h2 className="text-2xl font-bold text-[#E5E7EB] mb-6">
        Estudiantes
      </h2>

      <div className="overflow-x-auto">

        <table className="w-full rounded-lg overflow-hidden">

          <thead className="bg-[#2E2E38]">

            <tr className="text-left text-gray-400">

              <th className="p-4">ID</th>
              <th>Nombre</th>
              <th>Nota</th>
              <th>Asistencia</th>
              <th>Estado</th>
              <th>Riesgo</th>

            </tr>

          </thead>

          <tbody>

            {students.map((student) => {

              const risk = getRisk(
                student.grade,
                student.attendance
              );

              const status = getStatus(
                student.grade
              );

              return (
                <tr
                  key={student.id}
                  className="
                  border-t
                  border-gray-800
                  hover:bg-[#2E2E38]
                  transition-colors
                  "
                >

                  <td className="p-4">
                    {student.id}
                  </td>

                  <td>{student.name}</td>

                  <td>{student.grade}</td>

                  <td>{student.attendance}%</td>

                  <td>

                    <span
                      className={
                        status === "Aprobado"
                          ? "bg-green-500/20 text-green-400 px-4 py-1 rounded-full text-sm"
                          : "bg-red-500/20 text-red-400 px-4 py-1 rounded-full text-sm"
                      }
                    >
                      {status}
                    </span>

                  </td>

                  <td>

                    <span
                      className={
                        risk === "Bajo"
                          ? "bg-cyan-500/20 text-cyan-400 px-4 py-1 rounded-full text-sm"
                          : risk === "Medio"
                          ? "bg-yellow-500/20 text-yellow-400 px-4 py-1 rounded-full text-sm"
                          : "bg-red-500/20 text-red-400 px-4 py-1 rounded-full text-sm"
                      }
                    >
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
  );
}