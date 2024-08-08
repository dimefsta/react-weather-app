import React from 'react';

function DayInfo({ todayData }) {
  return (
    <div className="day-info">
      <div>
        <span className="title">PRECIPITATION</span>
        <span className="value">{Math.round(todayData.pop * 100)}%</span>
      </div>
      <div>
        <span className="title">HUMIDITY</span>
        <span className="value">{todayData.main.humidity}%</span>
      </div>
      <div>
        <span className="title">WIND SPEED</span>
        <span className="value">{todayData.wind.speed} km/h</span>
      </div>
    </div>
  );
}

export default DayInfo;
