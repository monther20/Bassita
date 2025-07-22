"use client";

import { useRouter } from "next/navigation";
import { FiArrowRight } from "react-icons/fi";

interface ShowAllBoardsCardProps {
  workspaceId: string;
  totalBoards: number;
  className?: string;
}

export default function ShowAllBoardsCard({
  workspaceId,
  totalBoards,
  className = "",
}: ShowAllBoardsCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/workspace/${encodeURIComponent(workspaceId)}`);
  };

  return (
    <button
      onClick={handleClick}
      className={`relative flex flex-col items-center justify-center w-full h-30 rounded-lg bg-background-secondary border-2 border-dashed border-spotlight-purple/50 hover:border-spotlight-purple transition-all duration-200 hover:bg-background-secondary/50 cursor-pointer group ${className}`}
    >
      <div className="flex flex-col items-center gap-2">
        <div className="p-3 rounded-full bg-background-member/10 group-hover:bg-spotlight-purple/20 transition-colors duration-200">
          <FiArrowRight className="w-5 h-5 text-background-member group-hover:text-spotlight-purple transition-colors duration-200" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-text-primary font-display">
            Show All Boards
          </p>
          <p className="text-xs text-text-tertiary">
            {totalBoards} total boards
          </p>
        </div>
      </div>
    </button>
  );
}