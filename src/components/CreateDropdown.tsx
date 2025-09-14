"use client";

import { useState, useRef, useEffect } from "react";
import { FiPlus, FiFolder, FiLayout, FiChevronDown, FiUsers } from "react-icons/fi";

interface CreateDropdownProps {
  onCreateBoard: () => void;
  onCreateWorkspace: () => void;
  onCreateOrganization: () => void;
  size?: "sm" | "md" | "lg";
  variant?: "button" | "icon";
}

export default function CreateDropdown({
  onCreateBoard,
  onCreateWorkspace,
  onCreateOrganization,
  size = "md",
  variant = "button"
}: CreateDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const handleCreateBoard = () => {
    setIsOpen(false);
    onCreateBoard();
  };

  const handleCreateWorkspace = () => {
    setIsOpen(false);
    onCreateWorkspace();
  };

  const handleCreateOrganization = () => {
    setIsOpen(false);
    onCreateOrganization();
  };

  const buttonSizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg"
  };

  const iconSizes = {
    sm: "p-2",
    md: "p-2",
    lg: "p-3"
  };

  if (variant === "icon") {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className={`${iconSizes[size]} bg-gradient-to-r from-spotlight-purple to-spotlight-pink rounded-full hover:shadow-glow-purple transition-all cursor-pointer touch-target`}
          aria-label="Create new item"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <FiPlus className="icon-sm text-text-primary" />
        </button>

        {isOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-background-secondary border border-background-tertiary rounded-lg shadow-lg z-50 overflow-hidden">
            <div className="py-2">
              <button
                onClick={handleCreateBoard}
                className="w-full flex items-center gap-3 px-4 py-3 text-text-primary hover:bg-spotlight-purple/10 hover:scale-[1.02] transition-all duration-200 text-left group"
              >
                <div className="w-8 h-8 bg-spotlight-purple/20 rounded-md flex items-center justify-center group-hover:bg-spotlight-purple/30 transition-colors">
                  <FiLayout className="w-4 h-4 text-spotlight-purple" />
                </div>
                <div>
                  <div className="font-medium">Create Board</div>
                  <div className="text-xs text-text-secondary">Start a new kanban board</div>
                </div>
              </button>

              <button
                onClick={handleCreateWorkspace}
                className="w-full flex items-center gap-3 px-4 py-3 text-text-primary hover:bg-spotlight-pink/10 hover:scale-[1.02] transition-all duration-200 text-left group"
              >
                <div className="w-8 h-8 bg-spotlight-pink/20 rounded-md flex items-center justify-center group-hover:bg-spotlight-pink/30 transition-colors">
                  <FiFolder className="w-4 h-4 text-spotlight-pink" />
                </div>
                <div>
                  <div className="font-medium">Create Workspace</div>
                  <div className="text-xs text-text-secondary">Organize boards in a workspace</div>
                </div>
              </button>

              <button
                onClick={handleCreateOrganization}
                className="w-full flex items-center gap-3 px-4 py-3 text-text-primary hover:bg-spotlight-green/10 hover:scale-[1.02] transition-all duration-200 text-left group"
              >
                <div className="w-8 h-8 bg-spotlight-green/20 rounded-md flex items-center justify-center group-hover:bg-spotlight-green/30 transition-colors">
                  <FiUsers className="w-4 h-4 text-spotlight-green" />
                </div>
                <div>
                  <div className="font-medium">Create Organization</div>
                  <div className="text-xs text-text-secondary">Start a new organization</div>
                </div>
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`${buttonSizes[size]} bg-gradient-to-r from-spotlight-purple to-spotlight-pink text-text-primary px-4 py-2 rounded-lg hover:shadow-glow-purple transition-all cursor-pointer flex items-center gap-2`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>Create</span>
        <FiChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-58 bg-background-secondary border border-background-tertiary rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="py-2">
            <button
              onClick={handleCreateBoard}
              className="w-full flex items-center gap-3 px-4 py-3 text-text-primary hover:bg-spotlight-purple/10 hover:scale-[1.02] transition-all duration-200 text-left group"
            >
              <div className="w-8 h-8 bg-spotlight-purple/20 rounded-md flex items-center justify-center group-hover:bg-spotlight-purple/30 transition-colors">
                <FiLayout className="w-4 h-4 text-spotlight-purple" />
              </div>
              <div>
                <div className="font-medium">Create Board</div>
                <div className="text-xs text-text-secondary">Start a new kanban board</div>
              </div>
            </button>

            <button
              onClick={handleCreateWorkspace}
              className="w-full flex items-center gap-3 px-4 py-3 text-text-primary hover:bg-spotlight-pink/10 hover:scale-[1.02] transition-all duration-200 text-left group"
            >
              <div className="w-8 h-8 bg-spotlight-pink/20 rounded-md flex items-center justify-center group-hover:bg-spotlight-pink/30 transition-colors">
                <FiFolder className="w-4 h-4 text-spotlight-pink" />
              </div>
              <div>
                <div className="font-medium">Create Workspace</div>
                <div className="text-xs text-text-secondary">Organize boards in a workspace</div>
              </div>
            </button>

            <button
              onClick={handleCreateOrganization}
              className="w-full flex items-center gap-3 px-4 py-3 text-text-primary hover:bg-spotlight-green/10 hover:scale-[1.02] transition-all duration-200 text-left group"
            >
              <div className="w-8 h-8 bg-spotlight-green/20 rounded-md flex items-center justify-center group-hover:bg-spotlight-green/30 transition-colors">
                <FiUsers className="w-4 h-4 text-spotlight-green" />
              </div>
              <div>
                <div className="font-medium">Create Organization</div>
                <div className="text-xs text-text-secondary">Start a new organization</div>
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}