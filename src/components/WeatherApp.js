import React, { useState, useEffect } from 'react';
import './WeatherApp.css';
import LeftInfo from './LeftInfo';
import RightInfo from './RightInfo';
import SearchBar from './SearchBar';

function WeatherApp() {
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState('Athens,Greece');

  useEffect(() => {
    fetchWeatherData(location);
  }, [location]);

  const fetchWeatherData = (location) => {
    const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.cod === "200") {
          setWeatherData(data);
          setError(null);
        } else {
          setWeatherData(null);
          setError(`Location not found: ${location}. Please try another location.`);
        }
      })
      .catch((error) => {
        console.error("Error fetching weather data:", error);
        setError("An error occurred while fetching the weather data.");
      });
  };

  const handleLocationChange = (newLocation) => {
    setLocation(newLocation);
  };

  if (error) {
    return (
      <div>
        <div className="error">{error}</div>
        <SearchBar onSelectLocation={handleLocationChange} />
      </div>
    );
  }

  if (!weatherData) return <div>Loading...</div>;

  return (
    <div className="container">
      <LeftInfo weatherData={weatherData} />
      <RightInfo 
        weatherData={weatherData} 
        onLocationChange={() => {}} 
        onSelectLocation={handleLocationChange} // Pass down the onSelectLocation function
      />
    </div>
  );
}

export default WeatherApp;
