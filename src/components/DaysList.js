import React from 'react';

// Function to determine if it's currently day or night in a specific timezone
function isDaytime(forecastDate) {
  const hours = forecastDate.getHours();
  return hours >= 6 && hours < 18; // Example: Daytime from 6 AM to 6 PM
}

function DaysList({ daysData }) {
  const today = new Date();

  // Mapping of OpenWeatherMap icons to Boxicons
  const weatherIconMap = {
    '01d': 'bx-sun',
    '01n': 'bx-moon',
    '02d': 'bx-cloud-sun',
    '02n': 'bx-cloud-moon',
    '03d': 'bx-cloud',
    '03n': 'bx-cloud',
    '04d': 'bx-cloud',
    '04n': 'bx-cloud',
    '09d': 'bx-cloud-drizzle',
    '09n': 'bx-cloud-drizzle',
    '10d': 'bx-cloud-light-rain',
    '10n': 'bx-cloud-light-rain',
    '11d': 'bx-cloud-lightning',
    '11n': 'bx-cloud-lightning',
    '13d': 'bx-cloud-snow',
    '13n': 'bx-cloud-snow',
    '50d': 'bx-wind',
    '50n': 'bx-wind'
  };

  const uniqueDays = new Set();
  let count = 0;

  return (
    <ul className="days-list">
      {daysData
        .map((dayData) => {
          const forecastDate = new Date(dayData.dt_txt);
          const isDay = isDaytime(forecastDate);
          const iconCode = dayData.weather[0].icon;
          const dayAbbreviation = forecastDate.toLocaleDateString('en', { weekday: 'short' });
          const dayTemp = `${Math.round(dayData.main.temp)}°C`;

          if (!uniqueDays.has(dayAbbreviation) && forecastDate.getDate() !== today.getDate()) {
            uniqueDays.add(dayAbbreviation);
            count++;
            return (
              <li key={count}>
                <i className={`bx ${isDay ? weatherIconMap[iconCode.replace('n', 'd')] : weatherIconMap[iconCode]}`}></i>
                <span>{dayAbbreviation}</span>
                <span className="day-temp">{dayTemp}</span>
              </li>
            );
          }

          return null;
        })
        .filter(Boolean)
        .slice(0, 4)}
    </ul>
  );
}

export default DaysList;
