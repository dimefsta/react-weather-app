import React from 'react';

function DaysList({ daysData }) {
  const today = new Date();
  const weatherIconMap = {
    '01d': 'sun',
    '01n': 'moon',
    '02d': 'sun',
    '02n': 'moon',
    '03d': 'cloud',
    '03n': 'cloud',
    // Add other mappings...
  };

  const uniqueDays = new Set();
  let count = 0;

  return (
    <ul className="days-list">
      {daysData.map((dayData) => {
        const forecastDate = new Date(dayData.dt_txt);
        const dayAbbreviation = forecastDate.toLocaleDateString('en', { weekday: 'short' });
        const dayTemp = `${Math.round(dayData.main.temp)}°C`;
        const iconCode = dayData.weather[0].icon;

        if (!uniqueDays.has(dayAbbreviation) && forecastDate.getDate() !== today.getDate()) {
          uniqueDays.add(dayAbbreviation);
          count++;
          return (
            <li key={count}>
              <i className={`bx bx-${weatherIconMap[iconCode]}`}></i>
              <span>{dayAbbreviation}</span>
              <span className="day-temp">{dayTemp}</span>
            </li>
          );
        }

        return null;
      }).filter(Boolean).slice(0, 4)}
    </ul>
  );
}

export default DaysList;
