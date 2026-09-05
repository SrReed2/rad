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
      bg-[#F7F6F3]
      border
      border-gray-800
      rounded-xl
      px-5
      py-4
      text-[#0D2B45]
      outline-none
      focus:border-[#0D2B45]
      transition-colors
      mb-6
      "
    />
  );
}