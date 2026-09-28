import { useState, useEffect, useCallback } from 'react';
import { fetchWeatherData, fetchWeatherDataByCoords, reverseGeocode } from '../services/weatherService';

const LOCATION_STORAGE_KEY = 'weather_app_last_location_v1';
const UNIT_STORAGE_KEY = 'weather_app_unit_v1';

export const useWeather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState(() => {
    try {
      const stored = localStorage.getItem(LOCATION_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to read location from localStorage:', e);
    }
    return { name: 'Athens', country: 'Greece', countryCode: 'GR', latitude: 37.9838, longitude: 23.7278 };
  });

  const [unit, setUnit] = useState(() => {
    try {
      const storedUnit = localStorage.getItem(UNIT_STORAGE_KEY);
      if (storedUnit === 'C' || storedUnit === 'F') return storedUnit;
    } catch (e) {
      console.warn('Failed to read unit from localStorage:', e);
    }
    return 'C';
  });

  const toggleUnit = useCallback(() => {
    setUnit((prev) => {
      const next = prev === 'C' ? 'F' : 'C';
      try {
        localStorage.setItem(UNIT_STORAGE_KEY, next);
      } catch (e) {}
      return next;
    });
  }, []);

  const loadWeather = useCallback(async (targetLocation) => {
    setLoading(true);
    setError(null);

    try {
      let data;
      if (typeof targetLocation === 'object' && targetLocation.latitude && targetLocation.longitude) {
        data = await fetchWeatherDataByCoords(targetLocation.latitude, targetLocation.longitude, targetLocation);
      } else {
        data = await fetchWeatherData(targetLocation);
      }

      setWeatherData(data);
      // Persist successful location
      try {
        localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(data.location));
      } catch (e) {}
    } catch (err) {
      console.error('Weather load error:', err);
      setError(err.message || 'Unable to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (location) {
      loadWeather(location);
    }
  }, [location, loadWeather]);

  const selectLocation = useCallback((newLoc) => {
    setLocation(newLoc);
  }, []);

  const refreshWeather = useCallback(() => {
    if (location) {
      loadWeather(location);
    }
  }, [location, loadWeather]);

  const useCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const locMeta = await reverseGeocode(latitude, longitude);
          setLocation(locMeta);
        } catch (err) {
          setLocation({
            name: 'Current Location',
            country: '',
            countryCode: '',
            latitude,
            longitude,
          });
        }
      },
      (geoErr) => {
        setLoading(false);
        let msg = 'Failed to retrieve your location.';
        if (geoErr.code === geoErr.PERMISSION_DENIED) {
          msg = 'Location permission was denied. Please allow location access or search manually.';
        } else if (geoErr.code === geoErr.POSITION_UNAVAILABLE) {
          msg = 'Location information is currently unavailable.';
        } else if (geoErr.code === geoErr.TIMEOUT) {
          msg = 'Location request timed out. Please try again.';
        }
        setError(msg);
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  }, []);

  return {
    weatherData,
    loading,
    error,
    unit,
    toggleUnit,
    selectLocation,
    refreshWeather,
    useCurrentLocation,
  };
};
