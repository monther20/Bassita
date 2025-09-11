"use client";

import { FiPlus } from "react-icons/fi";

interface AddColumnButtonProps {
  onClick?: () => void;
}

export default function AddColumnButton({
  onClick = () => console.log("Add column clicked")
}: AddColumnButtonProps) {
  return (
    <div className="flex flex-col h-full min-w-[280px] w-80">
      <button
        onClick={onClick}
        className="w-full h-12 rounded-xl border-2 border-dashed border-spotlight-purple/50 hover:border-spotlight-purple text-spotlight-purple/70 hover:text-spotlight-purple hover:text-text-primary transition-all duration-200 cursor-pointer font-display font-medium text-sm flex items-center justify-center gap-2 hover:shadow-glow-purple/20"
      >
        <FiPlus size={16} />
        Add Column
      </button>
    </div>
  );
}