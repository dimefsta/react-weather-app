import { useState, useEffect } from 'react';

const STORAGE_KEY = 'weather_app_favorites_v1';

const DEFAULT_FAVORITES = [
  { name: 'Athens', country: 'Greece', countryCode: 'GR', latitude: 37.9838, longitude: 23.7278 },
  { name: 'Tokyo', country: 'Japan', countryCode: 'JP', latitude: 35.6895, longitude: 139.6917 },
  { name: 'New York', country: 'United States', countryCode: 'US', latitude: 40.7128, longitude: -74.0060 },
  { name: 'London', country: 'United Kingdom', countryCode: 'GB', latitude: 51.5074, longitude: -0.1278 },
  { name: 'Paris', country: 'France', countryCode: 'FR', latitude: 48.8566, longitude: 2.3522 },
];

export const useFavorites = () => {
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse favorites from localStorage:', e);
    }
    return DEFAULT_FAVORITES;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.warn('Failed to save favorites to localStorage:', e);
    }
  }, [favorites]);

  const addFavorite = (location) => {
    if (!location || !location.name) return;
    setFavorites((prev) => {
      // Avoid duplicate by name and country
      const exists = prev.some(
        (f) => f.name.toLowerCase() === location.name.toLowerCase() &&
               (!location.country || f.country.toLowerCase() === location.country.toLowerCase())
      );
      if (exists) return prev;
      return [
        {
          name: location.name,
          country: location.country || '',
          countryCode: location.countryCode || '',
          admin1: location.admin1 || '',
          latitude: location.latitude,
          longitude: location.longitude,
        },
        ...prev,
      ];
    });
  };

  const removeFavorite = (cityName) => {
    setFavorites((prev) => prev.filter((f) => f.name.toLowerCase() !== cityName.toLowerCase()));
  };

  const isFavorite = (cityName) => {
    if (!cityName) return false;
    return favorites.some((f) => f.name.toLowerCase() === cityName.toLowerCase());
  };

  const toggleFavorite = (location) => {
    if (!location || !location.name) return;
    if (isFavorite(location.name)) {
      removeFavorite(location.name);
    } else {
      addFavorite(location);
    }
  };

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
  };
};
