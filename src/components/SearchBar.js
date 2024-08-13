import React, { useState, useEffect } from 'react';
import './SearchBar.css';

function SearchBar({ onSelectLocation }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSuggestionsVisible, setSuggestionsVisible] = useState(false);

  // Function to fetch city suggestions with more details
  const fetchSuggestions = async (query) => {
    if (!query || query.length <= 2) return;

    const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
    const apiUrl = `https://api.openweathermap.org/data/2.5/find?q=${query}&type=like&sort=population&cnt=5&appid=${apiKey}&units=metric`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data && data.list) {
        const formattedSuggestions = data.list.map(city => ({
          name: city.name,
          country: city.sys.country,
          state: city.state || '',
          fullDisplay: `${city.name}, ${city.state ? city.state + ', ' : ''}${city.sys.country}`
        }));
        setSuggestions(formattedSuggestions);
        setSuggestionsVisible(true);
      }
    } catch (error) {
      console.error('Error fetching city suggestions:', error);
    }
  };

  useEffect(() => {
    fetchSuggestions(query);
  }, [query]);

  const handleInputChange = (event) => {
    setQuery(event.target.value);
    if (event.target.value.length <= 2) {
      setSuggestionsVisible(false);
    }
  };

  const handleSearch = () => {
    if (query) {
      onSelectLocation(query);
      setSuggestionsVisible(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.fullDisplay);
    setSuggestions([]);
    setSuggestionsVisible(false);
    onSelectLocation(suggestion.name); // or suggestion.fullDisplay if more detail is needed
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
      {isSuggestionsVisible && suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion.fullDisplay}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SearchBar;
