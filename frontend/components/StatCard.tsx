interface StatCardProps {
  title: string;
  value: string | number;
}

export default function StatCard({
  title,
  value,
}: StatCardProps) {
  return (
    <div
      className="
      bg-[#25252D]
      rounded-xl
      border
      border-gray-800
      p-6
      shadow-[0_8px_30px_rgba(0,0,0,0.25)]
      hover:border-[#06B6D4]
      hover:-translate-y-1
      transition-all
      duration-300
      "
    >
      <p className="text-sm text-gray-400 uppercase tracking-wide">
        {title}
      </p>

      <h3 className="text-4xl font-bold text-[#E5E7EB] mt-4">
        {value}
      </h3>
    </div>
  );
}