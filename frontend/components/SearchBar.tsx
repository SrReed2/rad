"use client";

interface SearchBarProps {
  search: string;
  setSearch: (value: string) => void;
}

export default function SearchBar({
  search,
  setSearch,
}: SearchBarProps) {
  return (
    <input
      type="text"
      placeholder="Buscar estudiante..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="
      w-full
      bg-[#F6EFE0]
      border
      border-gray-800
      rounded-xl
      px-5
      py-4
      text-[#26313D]
      outline-none
      focus:border-[#14495C]
      transition-colors
      mb-6
      "
    />
  );
}