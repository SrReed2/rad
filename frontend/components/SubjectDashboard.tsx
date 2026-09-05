"use client";

import { useMemo } from "react";
import StatCard from "./StatCard";
import StudentTable, { getRisk } from "./StudentTable";
import { useStudents } from "../context/StudentsContext";

interface SubjectDashboardProps {
  /** Materia por la que se filtra (debe coincidir con Student.subject). */
  subject: string;
}

export default function SubjectDashboard({ subject }: SubjectDashboardProps) {
  const { students } = useStudents();

  // Solo estudiantes matriculados en la materia del docente autenticado.
  const subjectStudents = useMemo(
    () => students.filter((s) => s.subject === subject),
    [students, subject]
  );

  const { avgGrade, avgAttendance, highRisk } = useMemo(() => {
    const total = subjectStudents.length;
    const avgG = total > 0 ? Math.round(subjectStudents.reduce((acc, s) => acc + s.grade, 0) / total) : 0;
    const avgA = total > 0 ? Math.round(subjectStudents.reduce((acc, s) => acc + s.attendance, 0) / total) : 0;
    const high = subjectStudents.filter((s) => getRisk(s.grade, s.attendance) === "Alto").length;
    return { avgGrade: avgG, avgAttendance: avgA, highRisk: high };
  }, [subjectStudents]);

  return (
    <>
      <div className="mb-8">
        <h1 className="font-serif text-5xl font-bold bg-gradient-to-r from-[#0D2B45] to-[#C89D4E] bg-clip-text text-transparent">
          Dashboard — {subject}
        </h1>
        <p className="text-gray-400 mt-2">
          Vista filtrada con los estudiantes y métricas exclusivos de tu clase.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard title="Estudiantes" value={subjectStudents.length} />
        <StatCard title="Nota Promedio" value={avgGrade} />
        <StatCard title="Asistencia Promedio" value={`${avgAttendance}%`} />
        <StatCard title="Riesgo Alto" value={highRisk} />
      </div>

      {/* Tabla ya filtrada por materia — solo lectura, sin acciones de edición/eliminación */}
      <StudentTable students={subjectStudents} readOnly />
    </>
  );
}
