"use client";

import { useMemo, useState } from "react";
import StudentForm from "../../components/StudentForm";
import StudentTable from "../../components/StudentTable";
import { Student, useStudents } from "../../context/StudentsContext";
import { getRisk } from "../../components/StudentTable";

export default function StudentsPageClient() {
  const { students } = useStudents();
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const { totalStudents, highRisk, approvalRate } = useMemo(() => {
    const total = students.length;
    const high = students.filter((s) => getRisk(s.grade, s.attendance) === "Alto").length;
    const approved = students.filter((s) => s.grade >= 60).length;
    return {
      totalStudents: total,
      highRisk: high,
      approvalRate: total > 0 ? Math.round((approved / total) * 100) : 0,
    };
  }, [students]);

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl border border-gray-800">
          <p className="text-gray-400 text-sm">Total registrados</p>
          <h2 className="text-3xl font-bold text-[#26313D] mt-1">{totalStudents}</h2>
        </div>
        <div className="bg-white p-5 rounded-xl border border-red-500/20">
          <p className="text-gray-400 text-sm">Riesgo Alto</p>
          <h2 className="text-3xl font-bold text-red-400 mt-1">{highRisk}</h2>
        </div>
        <div className="bg-white p-5 rounded-xl border border-green-500/20">
          <p className="text-gray-400 text-sm">Tasa de Aprobación</p>
          <h2 className="text-3xl font-bold text-green-400 mt-1">{approvalRate}%</h2>
        </div>
      </div>

      <div className="mb-8">
        <StudentForm
          editingStudent={editingStudent}
          onCancelEdit={() => setEditingStudent(null)}
        />
      </div>

      <StudentTable onEdit={(s) => setEditingStudent(s)} />
    </>
  );
}