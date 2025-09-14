import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiLayout, FiFolder, FiUsers, FiArrowRight } from 'react-icons/fi';

export interface SearchResult {
  id: string;
  name: string;
  type: 'board' | 'workspace' | 'organization';
  icon?: string;
  workspaceId?: string;
  workspaceName?: string;
  memberCount?: number;
  boardCount?: number;
}

interface SearchDropdownProps {
  isVisible: boolean;
  searchResults: {
    boards: SearchResult[];
    workspaces: SearchResult[];
    organizations: SearchResult[];
    total: number;
  };
  onClose: () => void;
  onItemSelect: (item: SearchResult) => void;
  className?: string;
}

export default function SearchDropdown({
  isVisible,
  searchResults,
  onClose,
  onItemSelect,
  className = ''
}: SearchDropdownProps) {
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  console.log('searchResusssssssssslts', searchResults);

  // Flatten all results for keyboard navigation
  const allResults = [
    ...searchResults.boards,
    ...searchResults.workspaces,
    ...searchResults.organizations
  ];

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isVisible) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev =>
            prev < allResults.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && allResults[selectedIndex]) {
            handleItemClick(allResults[selectedIndex]);
          }
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, selectedIndex, allResults, onClose]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchResults]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose]);

  const handleItemClick = (item: SearchResult) => {
    onItemSelect(item);

    // Navigate to the appropriate route
    switch (item.type) {
      case 'board':
        router.push(`/organization/${item.workspaceId}/workspace/${item.workspaceId}/board/${item.id}`);
        break;
      case 'workspace':
        router.push(`/organization/${item.workspaceId}/workspace/${item.id}`);
        break;
      case 'organization':
        router.push(`/organization/${item.id}`);
        break;
    }
  };

  const getItemIcon = (item: SearchResult, isSelected: boolean = false) => {
    const baseClasses = "w-8 h-8 rounded-md flex items-center justify-center transition-all duration-200";
    const iconClasses = "w-4 h-4 transition-all duration-200";

    switch (item.type) {
      case 'board':
        return (
          <div className={`${baseClasses} ${isSelected ? 'bg-spotlight-purple/30 scale-105' : 'bg-spotlight-purple/20 group-hover:bg-spotlight-purple/25 group-hover:scale-105'}`}>
            <FiLayout className={`${iconClasses} text-spotlight-purple`} />
          </div>
        );
      case 'workspace':
        return (
          <div className={`${baseClasses} ${isSelected ? 'bg-spotlight-pink/30 scale-105' : 'bg-spotlight-pink/20 group-hover:bg-spotlight-pink/25 group-hover:scale-105'}`}>
            <FiFolder className={`${iconClasses} text-spotlight-pink`} />
          </div>
        );
      case 'organization':
        return (
          <div className={`${baseClasses} ${isSelected ? 'bg-spotlight-blue/30 scale-105' : 'bg-spotlight-blue/20 group-hover:bg-spotlight-blue/25 group-hover:scale-105'}`}>
            <FiUsers className={`${iconClasses} text-spotlight-blue`} />
          </div>
        );
    }
  };

  const getItemDetails = (item: SearchResult) => {
    switch (item.type) {
      case 'board':
        return item.workspaceName || 'Unknown workspace';
      case 'workspace':
        return `${item.boardCount || 0} boards • ${item.memberCount || 0} members`;
      case 'organization':
        return `${item.memberCount || 0} members`;
    }
  };

  const renderSection = (title: string, items: SearchResult[], iconComponent: React.ReactNode) => {
    if (items.length === 0) return null;

    const startIndex = allResults.findIndex(result => result.type === items[0].type);

    return (
      <div className="mb-2">
        <h3 className="text-text-secondary text-sm font-display font-medium mb-2 flex items-center gap-2 px-3">
          {iconComponent}
          {title} ({items.length})
        </h3>
        <div>
          {items.map((item, index) => {
            const globalIndex = startIndex + index;
            const isSelected = globalIndex === selectedIndex;

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`group w-full text-left px-3 py-2 transition-all duration-200 text-text-primary font-display flex items-center gap-3 ${
                  isSelected 
                    ? 'bg-background-tertiary shadow-sm' 
                    : 'hover:bg-background-secondary hover:shadow-sm'
                  }`}
              >
                {getItemIcon(item, isSelected)}
                <div className="flex-1 min-w-0">
                  <div className={`font-medium truncate transition-colors duration-200 ${isSelected ? 'text-text-primary' : 'group-hover:text-text-primary'}`}>{item.name}</div>
                  <div className={`text-xs truncate transition-colors duration-200 ${isSelected ? 'text-text-secondary' : 'text-text-secondary group-hover:text-text-primary/80'}`}>
                    {getItemDetails(item)}
                  </div>
                </div>
                {isSelected && (
                  <FiArrowRight className="w-4 h-4 text-text-secondary flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  if (!isVisible || searchResults.total === 0) {
    return null;
  }

  return (
    <div
      ref={dropdownRef}
      className={`absolute top-full left-0 right-0 mt-1 bg-background-floating rounded-lg border border-background-tertiary shadow-2xl z-50 max-h-96 overflow-y-auto ${className}`}
    >
      <div className="py-2">
        {searchResults.total === 0 ? (
          <div className="px-3 py-4 text-center text-text-secondary">
            No results found
          </div>
        ) : (
          <>
            {renderSection(
              'Boards',
              searchResults.boards,
              <FiLayout className="w-4 h-4" />
            )}
            {renderSection(
              'Workspaces',
              searchResults.workspaces,
              <FiFolder className="w-4 h-4" />
            )}
            {renderSection(
              'Organizations',
              searchResults.organizations,
              <FiUsers className="w-4 h-4" />
            )}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-background-tertiary px-3 py-2">
        <div className="flex items-center justify-between text-xs text-text-secondary font-display">
          <span>↑↓ to navigate</span>
          <div className="flex items-center gap-3">
            <span>↵ to select</span>
            <span>ESC to close</span>
          </div>
        </div>
      </div>
    </div>
  );
}