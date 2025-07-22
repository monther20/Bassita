"use client";

import { Button } from "../buttoon";
import { FiShare, FiMoreHorizontal } from "react-icons/fi";

interface Member {
  name: string;
  color: string;
}

interface BoardHeaderProps {
  boardName: string;
  boardIcon: string;
  members: Member[];
  onShare?: () => void;
  onMenu?: () => void;
}

export default function BoardHeader({
  boardName,
  boardIcon,
  members,
  onShare = () => console.log("Share clicked"),
  onMenu = () => console.log("Menu clicked")
}: BoardHeaderProps) {
  return (
    <div className="bg-background-secondary border-b border-background-tertiary p-1 px-6">
      <div className="flex items-center justify-between max-w-screen mx-auto">
        {/* Left section - Board title with icon */}
        <div className="flex items-center responsive-gap-sm">
          <span className="text-2xl">{boardIcon}</span>
          <div>
            <h1 className="text-text-primary text-xl font-display font-semibold">
              {boardName}
            </h1>
            <p className="text-text-tertiary text-sm font-display">Board</p>
          </div>
        </div>

        {/* Center section - Member avatars */}
        <div className="flex items-center responsive-gap-xs">
          {members.map((member, index) => (
            <div
              key={index}
              className={`w-8 h-8 rounded-full bg-${member.color} text-text-primary text-sm font-display font-medium flex items-center justify-center hover:scale-110 transition-transform cursor-pointer`}
              title={member.name}
            >
              {member.name}
            </div>
          ))}
        </div>

        {/* Right section - Share button and menu */}
        <div className="flex items-center responsive-gap-sm">
          <Button
            label="Share"
            onClick={onShare}
            size="sm"
            iconPosition="left"
          />
          <button
            onClick={onMenu}
            className="p-2 rounded-lg hover:bg-background-tertiary transition-colors touch-target"
            aria-label="More options"
          >
            <FiMoreHorizontal className="icon-md text-text-secondary hover:text-text-primary" />
          </button>
        </div>
      </div>
    </div>
  );
}