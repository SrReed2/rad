interface StatCardProps {
  title: string;
  value: string | number;
  trend?: { value: string; positive: boolean };
}

export default function StatCard({ title, value, trend }: StatCardProps) {
  return (
    <div
      className="
        bg-white rounded-xl border border-gray-800 p-6
        shadow-[0_8px_30px_rgba(13,43,69,0.10)]
        hover:border-[#0D2B45] hover:-translate-y-1
        transition-all duration-300
      "
    >
      <p className="text-xs text-gray-400 uppercase tracking-widest">{title}</p>
      <h3 className="text-4xl font-black text-[#0D2B45] mt-3">{value}</h3>
      {trend && (
        <p className={`text-xs mt-2 ${trend.positive ? "text-green-400" : "text-red-400"}`}>
          {trend.positive ? "▲" : "▼"} {trend.value}
        </p>
      )}
    </div>
  );
}
