'use client';

import { useState, useEffect } from 'react';

export default function SearchBar({ 
  searchQuery, 
  setSearchQuery, 
  placeholder = "Search...",
  onSearch,
  totalItems = 0,
  filteredItems = 0,
  showCount = true
}) {
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <div className="relative w-full">
      <div className={`
        relative flex items-center
        bg-black/60 border 
        ${isFocused ? 'border-purple-500 ring-2 ring-purple-500/30' : 'border-gray-600'}
        rounded-xl transition-all duration-200
      `}>
        {/* Search Icon */}
        <div className="absolute left-3 sm:left-4 text-gray-400">
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Search Input */}
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full pl-9 sm:pl-11 pr-10 sm:pr-12 py-2.5 sm:py-3 
            bg-transparent text-white placeholder-gray-400 
            text-sm sm:text-base
            focus:outline-none
            rounded-xl"
        />

        {/* Clear Button */}
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 sm:right-4 text-gray-400 hover:text-white transition-colors"
            aria-label="Clear search"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Search Shortcut */}
        <div className="hidden sm:block absolute right-12 text-xs text-gray-500">
          {!searchQuery && '⌘K'}
        </div>
      </div>

      {/* Search Stats */}
      {showCount && searchQuery && (
        <div className="mt-2 text-xs sm:text-sm text-gray-400">
          Found {filteredItems} {filteredItems === 1 ? 'result' : 'results'} 
          {totalItems > 0 && ` out of ${totalItems}`}
        </div>
      )}
    </div>
  );
}