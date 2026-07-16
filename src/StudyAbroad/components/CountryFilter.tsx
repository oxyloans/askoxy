import React from "react";
import { Search, GraduationCap, ChevronDown } from "lucide-react";

interface UniversityFilterProps {
  universityNames: string[];
  selectedUniversity: string;
  onUniversityChange: (name: string) => void;
}

const CountryFilter: React.FC<UniversityFilterProps> = ({
  universityNames,
  selectedUniversity,
  onUniversityChange,
}) => {
  return (
    <div className="relative flex items-center">
      <GraduationCap className="absolute left-4 w-5 h-5 text-purple-500 pointer-events-none z-10" />
      <select
        value={selectedUniversity}
        onChange={(e) => onUniversityChange(e.target.value)}
        className="w-full pl-11 pr-10 py-3.5 border-2 border-purple-100 rounded-2xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 transition-all duration-300 bg-white text-gray-700 font-semibold cursor-pointer appearance-none shadow-sm hover:border-purple-300 text-[15px]"
        style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}
      >
        <option value="">All Universities</option>
        {universityNames.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-4 w-4 h-4 text-purple-400 pointer-events-none" />
    </div>
  );
};

export default CountryFilter;
