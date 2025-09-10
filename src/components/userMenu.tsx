import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import {
  FiInfo,
  FiBell,
  FiUser,
  FiSettings,
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
      {/* Notification bell */}
      <button
        onClick={() => console.log("click")}
        className="p-2 touch-target flex items-center justify-center bg-background-tertiary rounded-lg hover:shadow-glow-purple transition-colors cursor-pointer"
      >
        <BsBellFill className="icon-xs text-spotlight-purple" />
      </button>

      {/* User dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="touch-target flex items-center responsive-gap-xs bg-background-tertiary rounded-lg hover:shadow-glow-purple transition-all duration-200 p-2 cursor-pointer"
        >
          {user.avatar && (
            <Image
              src={user.avatar}
              alt={user.name}
              className="w-5 h-5 md:w-7 md:h-7 rounded-lg"
              width={32}
              height={32}
            />
          )}
          <FiChevronDown
            className={`text-spotlight-purple transition-transform duration-200 icon-xs ${isDropdownOpen ? "rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 top-full mt-2 w-44 md:w-48 bg-background-floating rounded-lg border border-background-tertiary shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
            <div className="py-1 md:py-2">
              <button
                onClick={() => {
                  console.log("Profile clicked");
                  setIsDropdownOpen(false);
                }}
                className="w-full px-3 md:px-4 py-2 md:py-2.5 text-left text-text-primary hover:bg-background-tertiary transition-colors duration-150 flex items-center responsive-gap-xs touch-target"
              >
                <FiUser className="icon-xs text-spotlight-purple" />
                <span className="font-display text-sm md:text-base">Profile</span>
              </button>

              <button
                onClick={() => {
                  console.log("Settings clicked");
                  setIsDropdownOpen(false);
                }}
                className="w-full px-3 md:px-4 py-2 md:py-2.5 text-left text-text-primary hover:bg-background-tertiary transition-colors duration-150 flex items-center responsive-gap-xs touch-target"
              >
                <FiSettings className="icon-xs text-spotlight-purple" />
                <span className="font-display text-sm md:text-base">Settings</span>
              </button>

              <div className="border-t border-background-tertiary my-1"></div>

              <button
                onClick={() => {
                  logout();
                  setIsDropdownOpen(false);
                }}
                className="w-full px-3 md:px-4 py-2 md:py-2.5 text-left text-text-primary hover:bg-background-tertiary transition-colors duration-150 flex items-center responsive-gap-xs touch-target"
              >
                <FiLogOut className="icon-xs text-spotlight-red" />
                <span className="font-display text-sm md:text-base">Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
