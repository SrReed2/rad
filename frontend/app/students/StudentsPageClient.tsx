"use client";

import { useState } from "react";
import StudentForm from "../../components/StudentForm";
import StudentTable from "../../components/StudentTable";
import { Student, useStudents } from "../../context/StudentsContext";
import { getRisk } from "../../components/StudentTable";

export default function StudentsPageClient() {
  const { students } = useStudents();
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const totalStudents = students.length;
  const highRisk = students.filter((s) => getRisk(s.grade, s.attendance) === "Alto").length;
  const approved = students.filter((s) => s.grade >= 70).length;
  const approvalRate = totalStudents > 0 ? Math.round((approved / totalStudents) * 100) : 0;

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