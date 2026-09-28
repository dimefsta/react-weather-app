import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2 } from 'lucide-react';
import { searchCities } from '../services/weatherService';

function SearchBar({ onSelectLocation, searchInputRef }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const containerRef = useRef(null);
  const internalInputRef = useRef(null);
  const inputRef = searchInputRef || internalInputRef;

  // Debounced search
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchCities(query);
        setSuggestions(results);
        setIsOpen(results.length > 0);
        setActiveIndex(-1);
      } catch (err) {
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 280);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item) => {
    onSelectLocation(item);
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    setActiveIndex(-1);
    if (inputRef.current) inputRef.current.blur();
  };

  const handleKeyDown = (e) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'Enter' && query.trim().length >= 2) {
        onSelectLocation(query.trim());
        setIsOpen(false);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        handleSelect(suggestions[activeIndex]);
      } else if (query.trim().length >= 2) {
        onSelectLocation(suggestions[0] || query.trim());
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div className="search-bar-wrapper relative z-50 w-full" ref={containerRef}>
      <div className="search-input-box">
        <Search className="search-icon" size={18} />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length >= 2 && suggestions.length > 0 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search city, province, or country..."
          aria-label="Search city or location"
          autoComplete="off"
        />
        {isLoading && <Loader2 className="search-spinner" size={16} />}
        {query && !isLoading && (
          <button
            type="button"
            className="clear-button"
            onClick={handleClear}
            aria-label="Clear search input"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {isOpen && (
        <ul className="search-dropdown absolute top-[calc(100%+6px)] left-0 right-0 z-[9999]" role="listbox">
          {suggestions.map((item, index) => {
            const isSelected = index === activeIndex;
            return (
              <li
                key={item.id || index}
                role="option"
                aria-selected={isSelected}
                className={`search-dropdown-item ${isSelected ? 'active' : ''}`}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <div className="item-pin-box">
                  <MapPin size={16} />
                </div>
                <div className="item-text">
                  <span className="item-name">{item.name}</span>
                  <span className="item-details">
                    {item.admin1 ? `${item.admin1}, ` : ''}
                    {item.country}
                  </span>
                </div>
                {item.countryCode && (
                  <span className="item-country-badge">{item.countryCode}</span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
