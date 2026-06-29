interface StatCardProps {
  title: string;
  value: string | number;
  trend?: { value: string; positive: boolean };
}

export default function StatCard({ title, value, trend }: StatCardProps) {
  return (
    <div
      className="
        bg-[#25252D] rounded-xl border border-gray-800 p-6
        shadow-[0_8px_30px_rgba(0,0,0,0.25)]
        hover:border-[#06B6D4] hover:-translate-y-1
        transition-all duration-300
      "
    >
      <p className="text-xs text-gray-400 uppercase tracking-widest">{title}</p>
      <h3 className="text-4xl font-black text-[#E5E7EB] mt-3">{value}</h3>
      {trend && (
        <p className={`text-xs mt-2 ${trend.positive ? "text-green-400" : "text-red-400"}`}>
          {trend.positive ? "▲" : "▼"} {trend.value}
        </p>
      )}
    </div>
  );
}
