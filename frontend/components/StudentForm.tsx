"use client";

import { useState, useEffect } from "react";
import { useStudents, Student } from "../context/StudentsContext";

interface StudentFormProps {
  /** Si se pasa, el formulario entra en modo edición */
  editingStudent?: Student | null;
  /** Callback para limpiar el estado de edición en el padre */
  onCancelEdit?: () => void;
}

const EMPTY_FORM = {
  name: "",
  grade: "",
  attendance: "",
  subject: "",
  period: "",
};

export default function StudentForm({
  editingStudent,
  onCancelEdit,
}: StudentFormProps) {
  const { addStudent, updateStudent } = useStudents();

  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<typeof EMPTY_FORM>>({});
  const [success, setSuccess] = useState("");

  // Cargar datos cuando se pasa un estudiante a editar
  useEffect(() => {
    if (editingStudent) {
      setForm({
        name: editingStudent.name,
        grade: String(editingStudent.grade),
        attendance: String(editingStudent.attendance),
        subject: editingStudent.subject ?? "",
        period: editingStudent.period ?? "",
      });
      setErrors({});
      setSuccess("");
    } else {
      setForm(EMPTY_FORM);
    }
  }, [editingStudent]);

  const validate = () => {
    const newErrors: Partial<typeof EMPTY_FORM> = {};
    if (!form.name.trim()) newErrors.name = "El nombre es obligatorio.";
    const grade = Number(form.grade);
    if (!form.grade) newErrors.grade = "La nota es obligatoria.";
    else if (grade < 0 || grade > 100) newErrors.grade = "La nota debe estar entre 0 y 100.";
    const att = Number(form.attendance);
    if (!form.attendance) newErrors.attendance = "La asistencia es obligatoria.";
    else if (att < 0 || att > 100) newErrors.attendance = "La asistencia debe estar entre 0 y 100.";
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof EMPTY_FORM]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const data = {
      name: form.name.trim(),
      grade: Number(form.grade),
      attendance: Number(form.attendance),
      subject: form.subject.trim() || undefined,
      period: form.period.trim() || undefined,
    };

    if (editingStudent) {
      updateStudent(editingStudent.id, data);
      setSuccess(`✓ Estudiante "${data.name}" actualizado correctamente.`);
      onCancelEdit?.();
    } else {
      addStudent(data);
      setSuccess(`✓ Estudiante "${data.name}" registrado correctamente.`);
    }

    setForm(EMPTY_FORM);
    setErrors({});
    setTimeout(() => setSuccess(""), 4000);
  };

  const isEditing = !!editingStudent;

  return (
    <div className="bg-[#25252D] p-6 rounded-xl border border-gray-800">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-[#E5E7EB]">
          {isEditing ? `Editando: ${editingStudent.name}` : "Registrar Estudiante"}
        </h2>
        {isEditing && (
          <button
            onClick={onCancelEdit}
            className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
          >
            ✕ Cancelar edición
          </button>
        )}
      </div>

      {/* Éxito */}
      {success && (
        <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-lg px-4 py-3 mb-4">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Nombre */}
        <div className="md:col-span-2 xl:col-span-1">
          <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wide">
            Nombre completo *
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Ej. María López"
            className={`
              w-full p-3 rounded-lg bg-[#1A1A1F] text-[#E5E7EB]
              border transition-colors outline-none
              ${errors.name ? "border-red-500" : "border-gray-700 focus:border-[#06B6D4]"}
            `}
          />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Nota */}
        <div>
          <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wide">
            Nota (0–100) *
          </label>
          <input
            type="number"
            name="grade"
            value={form.grade}
            onChange={handleChange}
            placeholder="Ej. 78"
            min={0}
            max={100}
            className={`
              w-full p-3 rounded-lg bg-[#1A1A1F] text-[#E5E7EB]
              border transition-colors outline-none
              ${errors.grade ? "border-red-500" : "border-gray-700 focus:border-[#06B6D4]"}
            `}
          />
          {errors.grade && <p className="text-red-400 text-xs mt-1">{errors.grade}</p>}
        </div>

        {/* Asistencia */}
        <div>
          <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wide">
            Asistencia % (0–100) *
          </label>
          <input
            type="number"
            name="attendance"
            value={form.attendance}
            onChange={handleChange}
            placeholder="Ej. 85"
            min={0}
            max={100}
            className={`
              w-full p-3 rounded-lg bg-[#1A1A1F] text-[#E5E7EB]
              border transition-colors outline-none
              ${errors.attendance ? "border-red-500" : "border-gray-700 focus:border-[#06B6D4]"}
            `}
          />
          {errors.attendance && (
            <p className="text-red-400 text-xs mt-1">{errors.attendance}</p>
          )}
        </div>

        {/* Materia */}
        <div>
          <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wide">
            Materia
          </label>
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            placeholder="Ej. Matemáticas"
            className="
              w-full p-3 rounded-lg bg-[#1A1A1F] text-[#E5E7EB]
              border border-gray-700 focus:border-[#06B6D4] outline-none transition-colors
            "
          />
        </div>

        {/* Período */}
        <div>
          <label className="block text-xs text-gray-400 mb-1 uppercase tracking-wide">
            Período
          </label>
          <input
            type="text"
            name="period"
            value={form.period}
            onChange={handleChange}
            placeholder="Ej. 2024-I"
            className="
              w-full p-3 rounded-lg bg-[#1A1A1F] text-[#E5E7EB]
              border border-gray-700 focus:border-[#06B6D4] outline-none transition-colors
            "
          />
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          className="
            bg-[#06B6D4] hover:bg-cyan-400 transition-colors
            text-white font-semibold px-8 py-3 rounded-lg text-sm
          "
        >
          {isEditing ? "Actualizar" : "Guardar"}
        </button>
        {!isEditing && (
          <button
            type="button"
            onClick={() => { setForm(EMPTY_FORM); setErrors({}); }}
            className="
              border border-gray-700 hover:border-gray-500 text-gray-400
              hover:text-gray-200 px-6 py-3 rounded-lg text-sm transition-colors
            "
          >
            Limpiar
          </button>
        )}
      </div>
    </div>
  );
}
