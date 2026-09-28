import React, { useRef } from 'react';
import { Clock, ChevronLeft, ChevronRight, Droplets } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { formatTemp } from '../utils/weatherUtils';

function HourlyForecast({ hourlyData, unit }) {
  const scrollRef = useRef(null);

  if (!hourlyData || hourlyData.length === 0) return null;

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -260 : 260;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="forecast-card hourly-card">
      <div className="section-header">
        <div className="section-title-wrap">
          <Clock size={18} className="section-header-icon" />
          <h2 className="section-title">Hourly Forecast</h2>
          <span className="section-tag">24 Hours</span>
        </div>
        <div className="scroll-controls">
          <button
            type="button"
            className="control-btn"
            onClick={() => handleScroll('left')}
            aria-label="Scroll hourly forecast left"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            type="button"
            className="control-btn"
            onClick={() => handleScroll('right')}
            aria-label="Scroll hourly forecast right"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="hourly-scroll-track" ref={scrollRef}>
        {hourlyData.map((item, index) => {
          const isNow = index === 0;
          return (
            <div
              key={item.id}
              className={`hourly-item ${isNow ? 'is-now' : ''}`}
            >
              <span className="hourly-time">{isNow ? 'Now' : item.time}</span>
              <div className="hourly-icon-wrap">
                <WeatherIcon name={item.icon} size={28} />
              </div>
              <span className="hourly-temp">{formatTemp(item.temp, unit)}</span>
              <div className="hourly-pop">
                {item.precipitationProb > 0 ? (
                  <>
                    <Droplets size={11} className="pop-icon" />
                    <span>{item.precipitationProb}%</span>
                  </>
                ) : (
                  <span className="pop-empty">-</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default HourlyForecast;
