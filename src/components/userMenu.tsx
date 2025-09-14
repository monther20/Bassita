import { useAuth } from "@/hooks/useAuth";
import Avatar from "./Avatar";
import {
  FiLogOut,
  FiChevronDown,
} from "react-icons/fi";
import { BsBellFill } from "react-icons/bs";
import { useState, useRef, useEffect } from "react";

export function UserMenu() {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  if (!user) return null;

  return (
    <div className="flex items-center responsive-gap-xs">
      {/* User dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="touch-target flex items-center responsive-gap-xs bg-background-tertiary rounded-lg hover:shadow-glow-purple transition-all duration-200 p-2 cursor-pointer"
        >
          <Avatar 
            src={user.avatar} 
            name={user.name} 
            size="sm"
          />
          <FiChevronDown
            className={`text-spotlight-purple transition-transform duration-200 icon-xs ${isDropdownOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 md:w-64 bg-background-floating rounded-lg border border-gray-700/30 shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
            <div className="py-1 md:py-2">
              {/* User info */}
              <div className="px-4 md:px-5 py-3 md:py-4">
                <div className="flex items-center gap-3 mb-2">
                  <Avatar 
                    src={user.avatar} 
                    name={user.name} 
                    size="md"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-sm md:text-base text-text-primary font-semibold truncate">
                      {user.name}
                    </div>
                  </div>
                </div>
                <div className="text-xs md:text-sm text-text-secondary break-words leading-relaxed">
                  {user.email}
                </div>
              </div>

              <button
                onClick={() => {
                  logout();
                  setIsDropdownOpen(false);
                }}
                className="w-full h-full px-4 md:px-5 py-2.5 md:py-3 text-left text-text-primary hover:bg-spotlight-red/10 hover:scale-[1.02] transition-all duration-200 flex items-center responsive-gap-xs touch-target group"
              >
                <FiLogOut className="icon-xs text-spotlight-red group-hover:text-spotlight-red transition-colors" />
                <span className="font-display text-sm md:text-base">Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
