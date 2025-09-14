import { useState, useEffect, useRef } from "react";
import { FiSearch, FiX, FiClock, FiArrowRight, FiLayout, FiFolder } from "react-icons/fi";
import { useSearch, useRecentlyViewed } from "@/hooks/useDashboard";
import { useRouter } from "next/navigation";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateBoard?: () => void;
  onCreateWorkspace?: () => void;
}

export default function SearchModal({ 
  isOpen, 
  onClose, 
  onCreateBoard = () => console.log("Create board"),
  onCreateWorkspace = () => console.log("Create workspace")
}: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  
  // Use real data
  const { recentItems, addRecentItem } = useRecentlyViewed();
  const searchResults = useSearch(query);

  // Recent searches from recently viewed items
  const recentSearches = recentItems
    .filter(item => item.type === 'board')
    .slice(0, 5)
    .map(item => item.name);

  // Quick actions with real handlers
  const quickActions = [
    { 
      label: "Create new board", 
      icon: FiLayout,
      action: () => {
        onCreateBoard();
        onClose();
      }
    },
    { 
      label: "Create new workspace", 
      icon: FiFolder,
      action: () => {
        onCreateWorkspace();
        onClose();
      }
    }
  ];

  const handleItemClick = (item: { id: string; name: string; type: 'board' | 'workspace'; workspaceId?: string; workspaceName?: string }) => {
    addRecentItem(item);
    
    if (item.type === 'board') {
      router.push(`/board/${item.id}`);
    } else {
      router.push(`/workspace/${item.id}`);
    }
    
    onClose();
  };

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
              {recentSearches.length > 0 && (
                <div>
                  <h3 className="text-text-secondary text-sm font-display font-medium mb-3 flex items-center responsive-gap-xs">
                    <FiClock className="icon-xs" />
                    Recent boards
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
              )}

              {/* Quick Actions */}
              <div>
                <h3 className="text-text-secondary text-sm font-display font-medium mb-3">
                  Quick actions
                </h3>
                <div className="space-y-1">
                  {quickActions.map((action, index) => {
                    const IconComponent = action.icon;
                    return (
                      <button
                        key={index}
                        onClick={action.action}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-background-tertiary transition-colors text-text-primary font-display flex items-center gap-3 group"
                      >
                        <div className="w-8 h-8 bg-spotlight-purple/20 rounded-md flex items-center justify-center">
                          <IconComponent className="w-4 h-4 text-spotlight-purple" />
                        </div>
                        <span className="flex-1">{action.label}</span>
                        <FiArrowRight className="icon-xs text-text-secondary group-hover:text-text-primary transition-colors" />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="responsive-px-sm py-4">
              <div className="text-text-secondary text-sm font-display mb-3">
                Search results for &quot;{query}&quot; ({searchResults.total} found)
              </div>
              
              {searchResults.total === 0 ? (
                <div className="text-text-secondary text-center py-8">
                  No results found. Try a different search term.
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Workspaces Results */}
                  {searchResults.workspaces.length > 0 && (
                    <div>
                      <h3 className="text-text-secondary text-sm font-display font-medium mb-2 flex items-center gap-2">
                        <FiFolder className="w-4 h-4" />
                        Workspaces ({searchResults.workspaces.length})
                      </h3>
                      <div className="space-y-1">
                        {searchResults.workspaces.map((workspace) => (
                          <button
                            key={workspace.id}
                            onClick={() => handleItemClick({
                              id: workspace.id,
                              name: workspace.name,
                              type: 'workspace'
                            })}
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-background-tertiary transition-colors text-text-primary font-display flex items-center gap-3"
                          >
                            <div className="w-8 h-8 bg-spotlight-pink/20 rounded-md flex items-center justify-center">
                              <FiFolder className="w-4 h-4 text-spotlight-pink" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{workspace.name}</div>
                              <div className="text-xs text-text-secondary">
                                {workspace.boardCount} boards • {workspace.memberCount} members
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Boards Results */}
                  {searchResults.boards.length > 0 && (
                    <div>
                      <h3 className="text-text-secondary text-sm font-display font-medium mb-2 flex items-center gap-2">
                        <FiLayout className="w-4 h-4" />
                        Boards ({searchResults.boards.length})
                      </h3>
                      <div className="space-y-1">
                        {searchResults.boards.map((board) => (
                          <button
                            key={board.id}
                            onClick={() => handleItemClick({
                              id: board.id,
                              name: board.name,
                              type: 'board',
                              workspaceId: board.workspaceId,
                              workspaceName: board.workspaceName
                            })}
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-background-tertiary transition-colors text-text-primary font-display flex items-center gap-3"
                          >
                            <div className="w-8 h-8 bg-spotlight-purple/20 rounded-md flex items-center justify-center text-lg">
                              {board.icon}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{board.name}</div>
                              <div className="text-xs text-text-secondary">
                                {board.workspaceName}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
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