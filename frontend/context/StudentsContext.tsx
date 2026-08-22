"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { apiFetch } from "../lib/api";
import { useAuth } from "./AuthContext";

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
  addStudent: (s: Omit<Student, "id">) => Promise<void>;
  updateStudent: (id: number, data: Partial<Omit<Student, "id">>) => Promise<void>;
  deleteStudent: (id: number) => Promise<void>;
}

const StudentsContext = createContext<StudentsContextType | null>(null);

export function StudentsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    if (!user) {
      setStudents([]);
      return;
    }
    apiFetch<Student[]>("/students/").then(setStudents).catch(console.error);
  }, [user]);

  const addStudent = async (data: Omit<Student, "id">) => {
    const created = await apiFetch<Student>("/students/", {
      method: "POST",
      body: JSON.stringify({ ...data, email: `${data.name.toLowerCase().replace(/\s+/g, ".")}@student.local`, password: "change-me" }),
    });
    setStudents((prev) => [...prev, created]);
  };

  const updateStudent = async (id: number, data: Partial<Omit<Student, "id">>) => {
    const updated = await apiFetch<Student>(`/students/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    setStudents((prev) => prev.map((s) => (s.id === id ? updated : s)));
  };

  const deleteStudent = async (id: number) => {
    await apiFetch<void>(`/students/${id}`, { method: "DELETE" });
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
