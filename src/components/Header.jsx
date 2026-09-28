import React from 'react';
import {
  CloudSun,
  Navigation,
  RotateCw,
  Star,
  BookmarkCheck,
} from 'lucide-react';
import SearchBar from './SearchBar';

function Header({
  onSelectLocation,
  onUseCurrentLocation,
  onRefresh,
  isRefreshing,
  unit,
  onToggleUnit,
  currentLocation,
  isFavorite,
  onToggleFavorite,
  showFavoritesBar,
  onToggleFavoritesBar,
}) {
  const isCurrentFav = currentLocation && isFavorite(currentLocation.name);

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="brand-logo">
          <div className="logo-icon-wrapper">
            <CloudSun size={24} className="brand-icon" />
          </div>
          <div className="brand-text">
            <span className="brand-title">SkyPulse</span>
            <span className="brand-subtitle">Live Weather</span>
          </div>
        </div>
      </div>

      <div className="header-center">
        <SearchBar onSelectLocation={onSelectLocation} />
      </div>

      <div className="header-right">
        {/* Toggle current location into favorites */}
        {currentLocation && (
          <button
            type="button"
            className={`action-btn fav-toggle-btn ${isCurrentFav ? 'is-fav' : ''}`}
            onClick={() => onToggleFavorite(currentLocation)}
            title={isCurrentFav ? 'Remove from favorites' : 'Save to favorites'}
            aria-label="Toggle favorite"
          >
            <Star size={18} fill={isCurrentFav ? 'currentColor' : 'none'} />
          </button>
        )}

        {/* View favorites drawer/bar */}
        <button
          type="button"
          className={`action-btn ${showFavoritesBar ? 'active' : ''}`}
          onClick={onToggleFavoritesBar}
          title="Toggle favorites bar"
          aria-label="Toggle favorites bar"
        >
          <BookmarkCheck size={18} />
        </button>

        {/* Use Geolocation */}
        <button
          type="button"
          className="action-btn"
          onClick={onUseCurrentLocation}
          title="Use my current GPS location"
          aria-label="Use current location"
        >
          <Navigation size={18} />
        </button>

        {/* Unit Toggle */}
        <button
          type="button"
          className="action-btn unit-btn"
          onClick={onToggleUnit}
          title={`Switch to °${unit === 'C' ? 'F' : 'C'}`}
          aria-label="Toggle temperature unit"
        >
          <span className="unit-label">°{unit}</span>
        </button>

        {/* Refresh */}
        <button
          type="button"
          className={`action-btn refresh-btn ${isRefreshing ? 'spinning' : ''}`}
          onClick={onRefresh}
          title="Refresh forecast data"
          aria-label="Refresh weather data"
        >
          <RotateCw size={18} />
        </button>
      </div>
    </header>
  );
}

export default Header;
