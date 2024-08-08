import React, { useState, useEffect } from 'react';
import './SearchBar.css';

function SearchBar({ onSelectLocation }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionsVisible, setSuggestionsVisible] = useState(false);

  useEffect(() => {
    if (query.length > 2) {
      // Simulate fetching suggestions
      fetchSuggestions(query).then((results) => {
        setSuggestions(results);
        setSuggestionsVisible(true);
      });
    } else {
      setSuggestions([]);
      setSuggestionsVisible(false);
    }
  }, [query]);

  const fetchSuggestions = async (query) => {
    // Replace with actual API call
    return [
      'New York',
      'Newport',
      'New Orleans',
      // Other suggestions
    ].filter(location => location.toLowerCase().includes(query.toLowerCase()));
  };

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSearch = () => {
    if (query) {
      onSelectLocation(query);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setSuggestions([]);
    setSuggestionsVisible(false);
    onSelectLocation(suggestion);
  };

  return (
    <div className="search-bar-container">
      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Enter city or country"
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {isSuggestionsVisible && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
