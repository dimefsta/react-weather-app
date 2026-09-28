import React from 'react';
import { AlertCircle, RotateCcw, MapPin } from 'lucide-react';

function ErrorMessage({ error, onRetry, onSelectLocation }) {
  const suggestions = [
    { name: 'Athens', country: 'Greece', countryCode: 'GR', latitude: 37.9838, longitude: 23.7278 },
    { name: 'Tokyo', country: 'Japan', countryCode: 'JP', latitude: 35.6895, longitude: 139.6917 },
    { name: 'London', country: 'United Kingdom', countryCode: 'GB', latitude: 51.5074, longitude: -0.1278 },
    { name: 'New York', country: 'United States', countryCode: 'US', latitude: 40.7128, longitude: -74.0060 },
  ];

  return (
    <div className="error-card">
      <div className="error-icon-box">
        <AlertCircle size={36} className="error-icon" />
      </div>
      <h3 className="error-title">Weather Data Unavailable</h3>
      <p className="error-description">{error}</p>

      <div className="error-actions">
        <button type="button" className="retry-btn" onClick={onRetry}>
          <RotateCcw size={16} />
          <span>Try Again</span>
        </button>
      </div>

      <div className="error-fallback-section">
        <span className="fallback-label">Or explore major cities:</span>
        <div className="fallback-pills">
          {suggestions.map((city) => (
            <button
              key={city.name}
              type="button"
              className="fallback-pill-btn"
              onClick={() => onSelectLocation(city)}
            >
              <MapPin size={13} />
              <span>{city.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ErrorMessage;
