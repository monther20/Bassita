import { useState, useEffect, useRef } from "react";
import { FiSearch, FiX, FiClock, FiArrowRight } from "react-icons/fi";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Recent searches mock data
  const recentSearches = [
    "Marketing Campaign",
    "Design System",
    "User Dashboard"
  ];

  // Quick actions mock data
  const quickActions = [
    { label: "Create new board", action: () => console.log("Create board") },
    { label: "Add new member", action: () => console.log("Add member") },
    { label: "View templates", action: () => console.log("View templates") }
  ];

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl mx-4 bg-background-floating rounded-lg border border-background-tertiary shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
        {/* Search Input */}
        <div className="flex items-center responsive-px-sm py-4 border-b border-background-tertiary">
          <FiSearch className="icon-md text-text-secondary mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search boards, workspaces, and more..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-text-primary placeholder:text-text-secondary outline-none text-lg font-display"
          />
          <button
            onClick={onClose}
            className="touch-target p-2 rounded-lg hover:bg-background-tertiary transition-colors"
          >
            <FiX className="icon-md text-text-secondary" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-96 overflow-y-auto">
          {query.length === 0 ? (
            <div className="responsive-px-sm py-4 space-y-6">
              {/* Recent Searches */}
              <div>
                <h3 className="text-text-secondary text-sm font-display font-medium mb-3 flex items-center responsive-gap-xs">
                  <FiClock className="icon-xs" />
                  Recent searches
                </h3>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => setQuery(search)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-background-tertiary transition-colors text-text-primary font-display"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-text-secondary text-sm font-display font-medium mb-3">
                  Quick actions
                </h3>
                <div className="space-y-1">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        action.action();
                        onClose();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-background-tertiary transition-colors text-text-primary font-display flex items-center justify-between group"
                    >
                      <span>{action.label}</span>
                      <FiArrowRight className="icon-xs text-text-secondary group-hover:text-text-primary transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="responsive-px-sm py-4">
              <div className="text-text-secondary text-sm font-display mb-3">
                Search results for "{query}"
              </div>
              <div className="text-text-secondary text-center py-8">
                No results found. Try a different search term.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-background-tertiary responsive-px-sm py-3">
          <div className="flex items-center justify-between text-xs text-text-secondary font-display">
            <span>Press ESC to close</span>
            <span>↵ to select</span>
          </div>
        </div>
      </div>
    </div>
  );
}