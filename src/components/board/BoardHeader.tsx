"use client";

import Button from "@/components/buttoon";
import { FiShare, FiMoreHorizontal } from "react-icons/fi";
import * as Icons from "react-icons/fi";
import React, { useState, useEffect } from "react";

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="bg-background-secondary border-b border-background-tertiary p-1 responsive-px-sm">
      <div className="flex items-center justify-between max-w-screen mx-auto">
        {/* Left section - Board title with icon */}
        <div className="flex items-center responsive-gap-sm min-w-0 flex-1">
          <span className="text-xl md:text-2xl flex-shrink-0">{Icons[boardIcon as keyof typeof Icons] && React.createElement(Icons[boardIcon as keyof typeof Icons])}</span>
          <div className="min-w-0 flex-1">
            <h1 className="text-text-primary text-base md:text-xl font-display font-semibold truncate">
              {boardName}
            </h1>
            <p className="text-text-tertiary text-xs md:text-sm font-display">Board</p>
          </div>
        </div>

        {/* Center section - Member avatars - hide on mobile if too many members */}
        <div className="flex items-center responsive-gap-xs mx-2 md:mx-4">
          {members.slice(0, isMobile ? 2 : members.length).map((member, index) => (
            <div
              key={index}
              className={`w-6 h-6 md:w-8 md:h-8 rounded-full bg-${member.color} text-text-primary text-xs md:text-sm font-display font-medium flex items-center justify-center hover:scale-110 transition-transform cursor-pointer`}
              title={member.name}
            >
              {member.name}
            </div>
          ))}
          {members.length > 2 && isMobile && (
            <div className="w-6 h-6 rounded-full bg-background-member text-text-primary text-xs font-display font-medium flex items-center justify-center">
              +{members.length - 2}
            </div>
          )}
        </div>

        {/* Right section - Share button and menu */}
        <div className="flex items-center responsive-gap-sm">
          <Button
            label="Share"
            onClick={onShare}
            size="sm"
            iconPosition="left"
            className="hidden md:flex"
          />
          <button
            onClick={onShare}
            className="p-2 rounded-lg hover:bg-background-tertiary transition-colors touch-target md:hidden"
            aria-label="Share"
          >
            <FiShare className="icon-sm text-text-secondary hover:text-text-primary" />
          </button>
          <button
            onClick={onMenu}
            className="p-2 rounded-lg hover:bg-background-tertiary transition-colors touch-target"
            aria-label="More options"
          >
            <FiMoreHorizontal className="icon-sm md:icon-md text-text-secondary hover:text-text-primary" />
          </button>
        </div>
      </div>
    </div>
  );
}