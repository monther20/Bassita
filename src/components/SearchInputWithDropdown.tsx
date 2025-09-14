import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FiSearch } from "react-icons/fi";
import SearchDropdown, { SearchResult } from './SearchDropdown';
import { useSearch } from '@/hooks/useDashboard';

interface SearchInputWithDropdownProps {
  placeholder: string;
  width?: string;
  height?: string;
  className?: string;
  onItemSelect?: (item: SearchResult) => void;
}

export default function SearchInputWithDropdown({
  placeholder,
  width = "w-full",
  height = "h-10",
  className = "",
  onItemSelect = () => {}
}: SearchInputWithDropdownProps) {
  const [query, setQuery] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout>();

  // Use the enhanced search hook
  const searchResults = useSearch(debouncedQuery);

  // Debounced search effect
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300); // 300ms debounce delay

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query]);

  // Show/hide dropdown based on search results
  useEffect(() => {
    if (debouncedQuery.trim() && searchResults.total > 0) {
      setIsDropdownVisible(true);
    } else {
      setIsDropdownVisible(false);
    }
  }, [debouncedQuery, searchResults.total]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
  };

  // Handle input focus
  const handleInputFocus = () => {
    if (debouncedQuery.trim() && searchResults.total > 0) {
      setIsDropdownVisible(true);
    }
  };

  // Handle input blur (with delay to allow dropdown clicks)
  const handleInputBlur = () => {
    // Small delay to allow dropdown item clicks to register
    setTimeout(() => {
      setIsDropdownVisible(false);
    }, 150);
  };

  // Handle item selection
  const handleItemSelect = (item: SearchResult) => {
    setQuery(''); // Clear search after selection
    setDebouncedQuery(''); // Clear debounced query too
    setIsDropdownVisible(false);
    onItemSelect(item);
    inputRef.current?.blur(); // Remove focus from input
  };

  // Handle dropdown close
  const handleDropdownClose = () => {
    setIsDropdownVisible(false);
    inputRef.current?.blur();
  };

  // Transform search results to SearchResult format
  const transformedResults = {
    boards: searchResults.boards.map(board => ({
      id: board.id,
      name: board.name,
      type: 'board' as const,
      icon: board.icon,
      workspaceId: board.workspaceId,
      workspaceName: board.workspaceName
    })),
    workspaces: searchResults.workspaces.map(workspace => ({
      id: workspace.id,
      name: workspace.name,
      type: 'workspace' as const,
      memberCount: workspace.memberCount,
      boardCount: workspace.boardCount
    })),
    organizations: searchResults.organizations.map(org => ({
      id: org.id,
      name: org.name,
      type: 'organization' as const,
      memberCount: org.memberCount,
      boardCount: org.boardCount
    })),
    total: searchResults.total
  };

  return (
    <div ref={containerRef} className={`relative ${width}`}>
      <div className={`flex items-center bg-background-secondary rounded-lg px-4 py-2 focus-within:shadow-glow-purple transition-all ${height} ${className}`}>
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          className="bg-transparent outline-none flex-grow text-text-primary text-sm font-display font-normal placeholder:text-text-secondary"
          autoComplete="off"
        />
        <button 
          className="ml-2 text-text-secondary hover:text-text-primary transition-colors"
          onClick={() => inputRef.current?.focus()}
        >
          <FiSearch size={20} />
        </button>
      </div>

      {/* Search Dropdown */}
      <SearchDropdown
        isVisible={isDropdownVisible}
        searchResults={transformedResults}
        onClose={handleDropdownClose}
        onItemSelect={handleItemSelect}
      />

      {/* Loading indicator */}
      {searchResults.isLoading && debouncedQuery.trim() && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background-floating rounded-lg border border-background-tertiary shadow-lg z-50 px-3 py-2">
          <div className="flex items-center gap-2 text-text-secondary text-sm">
            <div className="w-4 h-4 border-2 border-spotlight-purple/30 border-t-spotlight-purple rounded-full animate-spin" />
            Searching...
          </div>
        </div>
      )}
    </div>
  );
}