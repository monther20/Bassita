import { FiSearch } from "react-icons/fi";

interface SearchInputProps {
  placeholder: string;
  width?: string;
  height?: string;
  className?: string;
}

export default function SearchInput({ 
  placeholder, 
  width = "w-full", 
  height = "h-10", 
  className = "" 
}: SearchInputProps) {
  return (
    <div className={`flex items-center bg-background-secondary rounded-full px-4 py-2 focus-within:shadow-glow-purple transition-all ${width} ${height} ${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        className="bg-transparent outline-none flex-grow text-text-primary text-sm font-display font-normal placeholder:text-text-secondary"
      />
      <button className="ml-2 text-text-secondary hover:text-text-primary transition-colors">
        <FiSearch size={20} />
      </button>
    </div>
  );
}
