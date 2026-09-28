import React from 'react';
import { CalendarDays, Droplets } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { formatTemp } from '../utils/weatherUtils';

function DailyForecast({ dailyData, unit }) {
  if (!dailyData || dailyData.length === 0) return null;

  // Calculate overall min and max across the 7-day period for relative bar widths
  const allMins = dailyData.map((d) => d.tempMin);
  const allMaxs = dailyData.map((d) => d.tempMax);
  const globalMin = Math.min(...allMins);
  const globalMax = Math.max(...allMaxs);
  const tempRange = Math.max(globalMax - globalMin, 1);

  return (
    <div className="forecast-card daily-card">
      <div className="section-header">
        <div className="section-title-wrap">
          <CalendarDays size={18} className="section-header-icon" />
          <h2 className="section-title">7-Day Forecast</h2>
        </div>
      </div>

      <div className="daily-list-container">
        {dailyData.map((day) => {
          // Calculate proportional left offset and width for the temp bar
          const leftPercent = Math.max(0, Math.min(100, ((day.tempMin - globalMin) / tempRange) * 100));
          const rightPercent = Math.max(0, Math.min(100, ((day.tempMax - globalMin) / tempRange) * 100));
          const barWidth = Math.max(12, rightPercent - leftPercent);

          return (
            <div key={day.id} className="daily-row">
              <div className="daily-day-info">
                <span className="daily-name">{day.dayName}</span>
                <span className="daily-date">{day.fullDate}</span>
              </div>

              <div className="daily-condition-wrap">
                <WeatherIcon name={day.icon} size={22} />
                <span className="daily-condition-label">{day.weatherLabel}</span>
              </div>

              <div className="daily-rain-chance">
                {day.precipitationProb > 0 ? (
                  <div className="rain-badge">
                    <Droplets size={11} />
                    <span>{day.precipitationProb}%</span>
                  </div>
                ) : (
                  <span className="rain-none">0%</span>
                )}
              </div>

              <div className="daily-temp-bar-container">
                <span className="daily-temp-min">{formatTemp(day.tempMin, unit)}</span>
                <div className="temp-range-track">
                  <div
                    className="temp-range-fill"
                    style={{
                      left: `${leftPercent}%`,
                      width: `${barWidth}%`,
                    }}
                  />
                </div>
                <span className="daily-temp-max">{formatTemp(day.tempMax, unit)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default DailyForecast;
