"use client";

import { useState } from "react";
import SearchBar from "./SearchBar";
import { useStudents, Student } from "../context/StudentsContext";

interface StudentTableProps {
  onEdit?: (student: Student) => void;
}

export function getRisk(grade: number, attendance: number): "Alto" | "Medio" | "Bajo" {
  if (grade < 65 || attendance < 70) return "Alto";
  if (grade < 80 || attendance < 85) return "Medio";
  return "Bajo";
}

export function getStatus(grade: number): "Aprobado" | "Reprobado" {
  return grade >= 70 ? "Aprobado" : "Reprobado";
}

const RISK_STYLES = {
  Bajo: "bg-cyan-500/20 text-cyan-400",
  Medio: "bg-yellow-500/20 text-yellow-400",
  Alto: "bg-red-500/20 text-red-400",
};

const STATUS_STYLES = {
  Aprobado: "bg-green-500/20 text-green-400",
  Reprobado: "bg-red-500/20 text-red-400",
};

export default function StudentTable({ onEdit }: StudentTableProps) {
  const { students, deleteStudent } = useStudents();
  const [search, setSearch] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<keyof Student>("id");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const handleSort = (col: keyof Student) => {
    if (sortBy === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(col);
      setSortDir("asc");
    }
  };

  const filtered = students
    .filter((s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.subject ?? "").toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const va = a[sortBy] ?? "";
      const vb = b[sortBy] ?? "";
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  const confirmDelete = (id: number) => setConfirmDeleteId(id);
  const cancelDelete = () => setConfirmDeleteId(null);
  const executeDelete = () => {
    if (confirmDeleteId !== null) {
      deleteStudent(confirmDeleteId);
      setConfirmDeleteId(null);
    }
  };

  const SortIcon = ({ col }: { col: keyof Student }) => (
    <span className={`ml-1 text-xs ${sortBy === col ? "text-[#14495C]" : "text-gray-600"}`}>
      {sortBy === col ? (sortDir === "asc" ? "▲" : "▼") : "⇅"}
    </span>
  );

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-800">
      {/* Modal de confirmación */}
      {confirmDeleteId !== null && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white border border-red-500/30 rounded-xl p-8 w-[380px] shadow-2xl">
            <h3 className="font-serif text-lg font-bold text-[#26313D] mb-2">Confirmar eliminación</h3>
            <p className="text-gray-400 text-sm mb-6">
              ¿Estás seguro? Esta acción no se puede deshacer.
            </p>
            <div className="flex gap-3">
              <button
                onClick={executeDelete}
                className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-semibold py-2 rounded-lg transition-colors"
              >
                Eliminar
              </button>
              <button
                onClick={cancelDelete}
                className="flex-1 border border-gray-700 hover:border-gray-500 text-gray-400 py-2 rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="font-serif text-2xl font-bold text-[#26313D]">Estudiantes</h2>
        <span className="text-gray-400 text-sm">{filtered.length} registros</span>
      </div>

      <SearchBar search={search} setSearch={setSearch} />

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[#F1E8D6]">
            <tr className="text-left text-gray-400">
              <th
                className="p-4 cursor-pointer hover:text-[#14495C] transition-colors select-none"
                onClick={() => handleSort("id")}
              >
                ID <SortIcon col="id" />
              </th>
              <th
                className="cursor-pointer hover:text-[#14495C] transition-colors select-none"
                onClick={() => handleSort("name")}
              >
                Nombre <SortIcon col="name" />
              </th>
              <th className="hidden md:table-cell">Materia</th>
              <th
                className="cursor-pointer hover:text-[#14495C] transition-colors select-none"
                onClick={() => handleSort("grade")}
              >
                Nota <SortIcon col="grade" />
              </th>
              <th
                className="cursor-pointer hover:text-[#14495C] transition-colors select-none"
                onClick={() => handleSort("attendance")}
              >
                Asistencia <SortIcon col="attendance" />
              </th>
              <th>Estado</th>
              <th>Riesgo</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-gray-500">
                  No se encontraron estudiantes para "{search}".
                </td>
              </tr>
            ) : (
              filtered.map((student) => {
                const risk = getRisk(student.grade, student.attendance);
                const status = getStatus(student.grade);
                return (
                  <tr
                    key={student.id}
                    className="border-t border-gray-800 hover:bg-[#F1E8D6] transition-colors"
                  >
                    <td className="p-4 text-gray-400">{student.id}</td>
                    <td className="font-medium text-[#26313D]">{student.name}</td>
                    <td className="hidden md:table-cell text-gray-400">
                      {student.subject ?? "—"}
                    </td>
                    <td className="font-mono">{student.grade}</td>
                    <td className="font-mono">{student.attendance}%</td>
                    <td>
                      <span className={`${STATUS_STYLES[status]} px-3 py-1 rounded-full text-xs font-medium`}>
                        {status}
                      </span>
                    </td>
                    <td>
                      <span className={`${RISK_STYLES[risk]} px-3 py-1 rounded-full text-xs font-medium`}>
                        {risk}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2 py-2">
                        <button
                          onClick={() => onEdit?.(student)}
                          className="px-3 py-1 rounded bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 text-xs transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => confirmDelete(student.id)}
                          className="px-3 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 text-xs transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
