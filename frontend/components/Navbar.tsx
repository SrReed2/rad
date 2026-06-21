export default function Navbar() {
  const today = new Date().toLocaleDateString();

  return (
    <nav
      className="
      sticky
      top-0
      z-50
      bg-[#202027]
      border-b
      border-gray-800
      px-8
      py-4
      flex
      justify-between
      items-center
      "
    >
      <div>
        <h1 className="text-2xl font-bold text-[#06B6D4]">
          Dashboard Académico
        </h1>

        <p className="text-sm text-gray-500">
          Monitoreo de rendimiento estudiantil
        </p>
      </div>

      <div className="text-right">
        <p className="text-[#E5E7EB]">
          Administrador
        </p>

        <p className="text-xs text-gray-500">
          {today}
        </p>
      </div>
    </nav>
  );
}
