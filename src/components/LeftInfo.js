import React from 'react';

function LeftInfo({ weatherData }) {
  if (!weatherData || !weatherData.list || weatherData.list.length === 0) {
    return <div>No weather data available.</div>;
  }

  const today = new Date();
  const todayWeather = weatherData.list[0];
  const weatherIconMap = {
    '01d': 'sun',
    '01n': 'moon',
    '02d': 'sun',
    '02n': 'moon',
    '03d': 'cloud',
    '03n': 'cloud',
    '04d': 'cloud',
    '04n': 'cloud',
    '09d': 'cloud-rain',
    '09n': 'cloud-rain',
    '10d': 'cloud-rain',
    '10n': 'cloud-rain',
    '11d': 'cloud-lightning',
    '11n': 'cloud-lightning',
    '13d': 'cloud-snow',
    '13n': 'cloud-snow',
    '50d': 'water',
    '50n': 'water'
  };

  return (
    <div className="left-info">
      <div className="pic-gradient"></div>
      <div className="today-info">
        <h2>{today.toLocaleDateString('en', { weekday: 'long' })}</h2>
        <span>{today.toLocaleDateString('en', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        <div>
          <i className='bx bx-current-location'></i>
          <span>{weatherData.city.name}, {weatherData.city.country}</span>
        </div>
      </div>
      <div className="today-weather">
        <i className={`bx bx-${weatherIconMap[todayWeather.weather[0].icon]}`}></i>
        <h1 className="weather-temp">{Math.round(todayWeather.main.temp)}°C</h1>
        <h3>{todayWeather.weather[0].description}</h3>
      </div>
    </div>
  );
}

export default LeftInfo;
