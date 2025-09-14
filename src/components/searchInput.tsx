import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FiSearch } from "react-icons/fi";
import SearchDropdown, { SearchResult } from './SearchDropdown';

interface SearchInputProps {
  placeholder: string;
  width?: string;
  height?: string;
  className?: string;
  onSearch?: (query: string) => {
    boards: SearchResult[];
    workspaces: SearchResult[];
    organizations: SearchResult[];
    total: number;
  };
  onItemSelect?: (item: SearchResult) => void;
}

export default function SearchInput({
  placeholder,
  width = "w-full",
  height = "h-10",
  className = "",
  onSearch,
  onItemSelect = () => {}
}: SearchInputProps) {
  const [query, setQuery] = useState('');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [searchResults, setSearchResults] = useState({
    boards: [] as SearchResult[],
    workspaces: [] as SearchResult[],
    organizations: [] as SearchResult[],
    total: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout>();

  // Debounced search function
  const debouncedSearch = useCallback((searchQuery: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (searchQuery.trim() && onSearch) {
        setIsLoading(true);
        try {
          const results = onSearch(searchQuery.trim());
          setSearchResults(results);
          setIsDropdownVisible(results.total > 0);
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults({ boards: [], workspaces: [], organizations: [], total: 0 });
          setIsDropdownVisible(false);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSearchResults({ boards: [], workspaces: [], organizations: [], total: 0 });
        setIsDropdownVisible(false);
        setIsLoading(false);
      }
    }, 300); // 300ms debounce delay
  }, [onSearch]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    debouncedSearch(newQuery);
  };

  // Handle input focus
  const handleInputFocus = () => {
    if (query.trim() && searchResults.total > 0) {
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
    setIsDropdownVisible(false);
    onItemSelect(item);
    inputRef.current?.blur(); // Remove focus from input
  };

  // Handle dropdown close
  const handleDropdownClose = () => {
    setIsDropdownVisible(false);
    inputRef.current?.blur();
  };

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

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
        searchResults={searchResults}
        onClose={handleDropdownClose}
        onItemSelect={handleItemSelect}
      />

      {/* Loading indicator */}
      {isLoading && (
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
