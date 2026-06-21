export default function Sidebar() {
  return (
    <aside
      className="
      w-72
      min-h-screen
      bg-[#202027]
      border-r
      border-gray-800
      flex
      flex-col
      "
    >
      <div className="p-8">
        <h1 className="text-4xl font-bold text-[#06B6D4]">
          RAD
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Risk Analysis Dashboard
        </p>
      </div>

      <nav className="flex flex-col gap-3 px-6 mt-4">

        <a
          href="/dashboard"
          className="text-[#E5E7EB] hover:text-[#06B6D4] transition-colors"
        >
          Dashboard
        </a>

        <a
          href="/students"
          className="text-[#E5E7EB] hover:text-[#06B6D4] transition-colors"
        >
          Estudiantes
        </a>

        <a
          href="/attendance"
          className="text-[#E5E7EB] hover:text-[#06B6D4] transition-colors"
        >
          Asistencia
        </a>

        <a
          href="#"
          className="text-[#E5E7EB] hover:text-[#06B6D4] transition-colors"
        >
          Predicciones
        </a>

      </nav>

      <div className="mt-auto p-6">

        <div className="bg-[#2E2E38] rounded-lg p-4 border border-gray-700">

          <p className="text-xs text-gray-400">
            Estado del Sistema
          </p>

          <p className="text-cyan-400 font-semibold mt-1">
            ● Online
          </p>

        </div>

      </div>
    </aside>
  );
}