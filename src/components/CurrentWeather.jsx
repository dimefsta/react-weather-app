import React from 'react';
import {
  MapPin,
  Calendar,
  Clock,
  ArrowUp,
  ArrowDown,
  Droplets,
  Wind,
  CloudRain,
} from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { formatTemp, formatSpeed } from '../utils/weatherUtils';

function CurrentWeather({ weatherData, unit }) {
  if (!weatherData) return null;

  const { location, current } = weatherData;

  return (
    <div className={`current-weather-hero theme-${current.theme}`}>
      <div className="hero-ambient-glow" />

      <div className="hero-content">
        {/* Top bar with location and date */}
        <div className="hero-top">
          <div className="location-info">
            <div className="location-badge">
              <MapPin size={16} className="loc-pin-icon" />
              <h1 className="city-title">{location.name}</h1>
              {location.countryCode && (
                <span className="country-tag">{location.countryCode}</span>
              )}
            </div>
            <p className="admin-subtitle">
              {location.admin1 ? `${location.admin1}, ` : ''}
              {location.country}
            </p>
          </div>

          <div className="datetime-info">
            <div className="date-item">
              <Calendar size={14} />
              <span>{current.localDate}</span>
            </div>
            <div className="time-item">
              <Clock size={14} />
              <span>{current.localTime}</span>
            </div>
          </div>
        </div>

        {/* Center Section: Big Temp, Condition, and Weather Illustration */}
        <div className="hero-body">
          <div className="temp-block">
            <div className="temp-main-row">
              <span className="main-temp-val">{formatTemp(current.temp, unit)}</span>
              <div className="weather-badge">
                <span className="condition-text">{current.weatherLabel}</span>
              </div>
            </div>

            <div className="temp-sub-row">
              <span className="feels-like-text">
                Feels like <strong>{formatTemp(current.feelsLike, unit)}</strong>
              </span>

              <div className="high-low-pill">
                <span className="hl-item high">
                  <ArrowUp size={13} />
                  {formatTemp(current.tempMax, unit)}
                </span>
                <span className="hl-divider">•</span>
                <span className="hl-item low">
                  <ArrowDown size={13} />
                  {formatTemp(current.tempMin, unit)}
                </span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="icon-pulse-wrapper">
              <WeatherIcon name={current.icon} size={84} className="hero-big-icon" />
            </div>
          </div>
        </div>

        {/* Hero Bottom quick bar */}
        <div className="hero-stats-footer">
          <div className="footer-stat-item">
            <Droplets size={16} className="stat-icon-drop" />
            <div className="stat-text">
              <span className="stat-label">Humidity</span>
              <span className="stat-val">{current.humidity}%</span>
            </div>
          </div>

          <div className="footer-stat-divider" />

          <div className="footer-stat-item">
            <Wind size={16} className="stat-icon-wind" />
            <div className="stat-text">
              <span className="stat-label">Wind</span>
              <span className="stat-val">{formatSpeed(current.windSpeed, unit)}</span>
            </div>
          </div>

          <div className="footer-stat-divider" />

          <div className="footer-stat-item">
            <CloudRain size={16} className="stat-icon-rain" />
            <div className="stat-text">
              <span className="stat-label">Precipitation</span>
              <span className="stat-val">{current.precipitation} mm</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CurrentWeather;
