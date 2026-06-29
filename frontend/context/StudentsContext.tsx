"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

export interface Student {
  id: number;
  name: string;
  grade: number;
  attendance: number;
  subject?: string;
  period?: string;
}

interface StudentsContextType {
  students: Student[];
  addStudent: (s: Omit<Student, "id">) => void;
  updateStudent: (id: number, data: Partial<Omit<Student, "id">>) => void;
  deleteStudent: (id: number) => void;
}

const StudentsContext = createContext<StudentsContextType | null>(null);

// Dataset inicial — en Agosto se reemplazará con fetch al endpoint real
const INITIAL_STUDENTS: Student[] = [
  { id: 1, name: "Ana López", grade: 89, attendance: 95, subject: "Matemáticas", period: "2024-I" },
  { id: 2, name: "Carlos Ruiz", grade: 72, attendance: 80, subject: "Física", period: "2024-I" },
  { id: 3, name: "María Torres", grade: 95, attendance: 99, subject: "Química", period: "2024-I" },
  { id: 4, name: "Luis Pérez", grade: 60, attendance: 65, subject: "Biología", period: "2024-I" },
  { id: 5, name: "José Martínez", grade: 45, attendance: 55, subject: "Historia", period: "2024-I" },
  { id: 6, name: "Andrea Castillo", grade: 82, attendance: 91, subject: "Literatura", period: "2024-I" },
  { id: 7, name: "Roberto Sánchez", grade: 78, attendance: 88, subject: "Matemáticas", period: "2024-I" },
  { id: 8, name: "Laura Gómez", grade: 91, attendance: 97, subject: "Física", period: "2024-I" },
  { id: 9, name: "Miguel Ángel Díaz", grade: 63, attendance: 71, subject: "Química", period: "2024-I" },
  { id: 10, name: "Patricia Flores", grade: 55, attendance: 60, subject: "Biología", period: "2024-I" },
];

export function StudentsProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);

  const addStudent = (data: Omit<Student, "id">) => {
    const newId = students.length > 0 ? Math.max(...students.map((s) => s.id)) + 1 : 1;
    setStudents((prev) => [...prev, { id: newId, ...data }]);
  };

  const updateStudent = (id: number, data: Partial<Omit<Student, "id">>) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...data } : s))
    );
  };

  const deleteStudent = (id: number) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <StudentsContext.Provider
      value={{ students, addStudent, updateStudent, deleteStudent }}
    >
      {children}
    </StudentsContext.Provider>
  );
}

export function useStudents() {
  const ctx = useContext(StudentsContext);
  if (!ctx) throw new Error("useStudents debe usarse dentro de <StudentsProvider>");
  return ctx;
}
