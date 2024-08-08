import React, { useState } from 'react';
import DayInfo from './DayInfo';
import DaysList from './DaysList';
import SearchBar from './SearchBar'; // Import the SearchBar component


function RightInfo({ weatherData, onLocationChange, onSelectLocation }) {
  const [isSearchBarVisible, setSearchBarVisible] = useState(false);

  // Toggle the visibility of SearchBar
  const handleSearchButtonClick = () => {
    setSearchBarVisible(!isSearchBarVisible);
  };

  // Ensure weatherData and weatherData.list are defined and have data
  if (!weatherData || !weatherData.list || weatherData.list.length === 0) {
    return (
      <div>
        <div>No forecast data available.</div>
        {/* Render SearchBar here */}
        <SearchBar 
          onSelectLocation={onSelectLocation} 
          className={isSearchBarVisible ? '' : 'hidden'}
        />
      </div>
    );
  }

  return (
    <div className="right-info">
      {/* Ensure there is data for today before accessing */}
      <DayInfo todayData={weatherData.list[0]} />
      
      {/* Slice ensures there are additional days to display */}
      <DaysList daysData={weatherData.list.slice(1)} />
      
      <div className="btn-container">
        <button className="loc-button" onClick={handleSearchButtonClick}>
          {isSearchBarVisible ? 'Close Search' : 'Search Location'}
        </button>
      </div>

      {/* Render SearchBar here if visible */}
      {isSearchBarVisible && <SearchBar onSelectLocation={onSelectLocation} />}
    </div>
  );
}

export default RightInfo;
