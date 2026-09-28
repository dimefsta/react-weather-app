import React from 'react';
import {
  Sun,
  Wind,
  Sunrise,
  Sunset,
  Droplets,
  Eye,
  Gauge,
  Cloud,
  Navigation,
} from 'lucide-react';
import {
  formatSpeed,
  formatDistance,
  formatTemp,
  getCompassDirection,
  calculateSunProgress,
  getAirComfortDescription,
} from '../utils/weatherUtils';

function WeatherMetrics({ weatherData, unit }) {
  if (!weatherData) return null;

  const { current, sunTimes } = weatherData;
  const sunProgress = calculateSunProgress(sunTimes.rawSunrise, sunTimes.rawSunset);
  const comfort = getAirComfortDescription(current.humidity);
  const compassDir = getCompassDirection(current.windDirection);

  // Pressure evaluation
  let pressureStatus = 'Normal';
  if (current.pressure > 1020) pressureStatus = 'High Pressure';
  else if (current.pressure < 1005) pressureStatus = 'Low Pressure';

  // Visibility evaluation
  let visibilityStatus = 'Clear';
  if (current.visibility >= 10) visibilityStatus = 'Excellent';
  else if (current.visibility >= 6) visibilityStatus = 'Good';
  else if (current.visibility >= 2) visibilityStatus = 'Moderate';
  else visibilityStatus = 'Poor (Foggy)';

  return (
    <div className="metrics-grid">
      {/* 1. UV Index */}
      <div className="metric-card uv-card">
        <div className="metric-card-top">
          <div className="metric-header-title">
            <Sun size={17} className="metric-title-icon" />
            <span>UV Index</span>
          </div>
          <span className="metric-badge" style={{ backgroundColor: `${current.uvColor}25`, color: current.uvColor }}>
            {current.uvLevel}
          </span>
        </div>
        <div className="metric-value-box">
          <span className="metric-number">{current.uvIndex}</span>
          <span className="metric-unit">/ 11+</span>
        </div>
        <div className="uv-meter-track">
          <div
            className="uv-meter-fill"
            style={{
              width: `${Math.min(100, (current.uvIndex / 12) * 100)}%`,
              backgroundColor: current.uvColor,
            }}
          />
        </div>
        <p className="metric-hint">
          {current.uvIndex <= 2
            ? 'Safe for outdoor exposure'
            : current.uvIndex <= 5
            ? 'Sunscreen recommended'
            : 'Protection required, seek shade'}
        </p>
      </div>

      {/* 2. Wind & Gusts */}
      <div className="metric-card wind-card">
        <div className="metric-card-top">
          <div className="metric-header-title">
            <Wind size={17} className="metric-title-icon" />
            <span>Wind & Gusts</span>
          </div>
          <span className="metric-badge neutral">
            {compassDir} ({current.windDirection}°)
          </span>
        </div>
        <div className="metric-value-box">
          <span className="metric-number">{formatSpeed(current.windSpeed, unit)}</span>
        </div>
        <div className="wind-compass-row">
          <div
            className="compass-disc"
            title={`Direction: ${current.windDirection}°`}
          >
            <Navigation
              size={18}
              className="compass-needle"
              style={{ transform: `rotate(${current.windDirection}deg)` }}
            />
          </div>
          <div className="wind-details">
            <span className="gust-text">
              Gusts up to <strong>{formatSpeed(current.windGusts, unit)}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* 3. Sunrise & Sunset */}
      <div className="metric-card sun-card">
        <div className="metric-card-top">
          <div className="metric-header-title">
            <Sunrise size={17} className="metric-title-icon" />
            <span>Sun Schedule</span>
          </div>
          <span className="metric-badge neutral">
            {current.isDay ? 'Daytime' : 'Nighttime'}
          </span>
        </div>
        <div className="sun-times-row">
          <div className="sun-event">
            <Sunrise size={20} className="event-icon rise" />
            <div className="event-info">
              <span className="event-label">Sunrise</span>
              <span className="event-time">{sunTimes.sunrise}</span>
            </div>
          </div>
          <div className="sun-event">
            <Sunset size={20} className="event-icon set" />
            <div className="event-info">
              <span className="event-label">Sunset</span>
              <span className="event-time">{sunTimes.sunset}</span>
            </div>
          </div>
        </div>
        <div className="sun-arc-track">
          <div
            className="sun-arc-fill"
            style={{ width: `${sunProgress}%` }}
          />
          <div
            className="sun-arc-marker"
            style={{ left: `${sunProgress}%` }}
          />
        </div>
        <p className="metric-hint">
          {current.isDay ? `${100 - sunProgress}% daylight remaining` : 'Sun below horizon'}
        </p>
      </div>

      {/* 4. Humidity & Dew Point */}
      <div className="metric-card humidity-card">
        <div className="metric-card-top">
          <div className="metric-header-title">
            <Droplets size={17} className="metric-title-icon" />
            <span>Humidity & Air</span>
          </div>
          <span className="metric-badge neutral">{comfort.label}</span>
        </div>
        <div className="metric-value-box">
          <span className="metric-number">{current.humidity}</span>
          <span className="metric-unit">%</span>
        </div>
        <div className="metric-sub-bar">
          <span className="dew-point-text">
            Dew point is <strong>{formatTemp(current.dewPoint, unit)}</strong>
          </span>
        </div>
        <p className="metric-hint">{comfort.sub}</p>
      </div>

      {/* 5. Visibility & Pressure */}
      <div className="metric-card visibility-card">
        <div className="metric-card-top">
          <div className="metric-header-title">
            <Eye size={17} className="metric-title-icon" />
            <span>Visibility</span>
          </div>
          <span className="metric-badge neutral">{visibilityStatus}</span>
        </div>
        <div className="metric-value-box">
          <span className="metric-number">{formatDistance(current.visibility, unit)}</span>
        </div>
        <div className="pressure-sub-row">
          <Gauge size={15} className="pressure-icon" />
          <span>Pressure: <strong>{current.pressure} hPa</strong></span>
          <span className="pressure-tag">({pressureStatus})</span>
        </div>
        <p className="metric-hint">Horizon view is clear and unhindered</p>
      </div>

      {/* 6. Precipitation & Cloud Cover */}
      <div className="metric-card cloud-card">
        <div className="metric-card-top">
          <div className="metric-header-title">
            <Cloud size={17} className="metric-title-icon" />
            <span>Cloud & Moisture</span>
          </div>
          <span className="metric-badge neutral">
            {current.cloudCover}% Coverage
          </span>
        </div>
        <div className="metric-value-box">
          <span className="metric-number">{current.cloudCover}</span>
          <span className="metric-unit">%</span>
        </div>
        <div className="cloud-bar-track">
          <div
            className="cloud-bar-fill"
            style={{ width: `${current.cloudCover}%` }}
          />
        </div>
        <p className="metric-hint">
          {current.precipitation > 0
            ? `${current.precipitation} mm accumulated rain`
            : 'No active surface precipitation'}
        </p>
      </div>
    </div>
  );
}

export default WeatherMetrics;
