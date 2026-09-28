import React from 'react';
import { Star, X, MapPin } from 'lucide-react';

function FavoritesBar({ favorites, activeCityName, onSelectLocation, onRemoveFavorite }) {
  if (!favorites || favorites.length === 0) {
    return (
      <div className="favorites-bar empty">
        <span className="favorites-empty-text">
          No favorite cities saved yet. Tap the star icon to bookmark your favorite places.
        </span>
      </div>
    );
  }

  return (
    <div className="favorites-bar">
      <div className="favorites-label">
        <Star size={14} className="star-icon" fill="currentColor" />
        <span>Favorites</span>
      </div>
      <div className="favorites-scroll-container">
        {favorites.map((fav) => {
          const isActive =
            activeCityName &&
            fav.name.toLowerCase() === activeCityName.toLowerCase();

          return (
            <div
              key={`${fav.name}-${fav.country}`}
              className={`favorite-pill ${isActive ? 'active' : ''}`}
            >
              <button
                type="button"
                className="fav-name-btn"
                onClick={() => onSelectLocation(fav)}
              >
                <MapPin size={13} className="pill-pin" />
                <span className="pill-title">{fav.name}</span>
                {fav.countryCode && (
                  <span className="pill-country">{fav.countryCode}</span>
                )}
              </button>
              <button
                type="button"
                className="fav-remove-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFavorite(fav.name);
                }}
                title={`Remove ${fav.name} from favorites`}
                aria-label={`Remove ${fav.name}`}
              >
                <X size={12} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FavoritesBar;
