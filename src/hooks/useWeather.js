import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchWeatherData, fetchWeatherDataByCoords, reverseGeocode } from '../services/weatherService';

const LOCATION_STORAGE_KEY = 'weather_app_last_location_v1';
const UNIT_STORAGE_KEY = 'weather_app_unit_v1';

export const useWeather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const lastFetchedKeyRef = useRef('');

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

  const clearToast = useCallback(() => {
    setToast(null);
  }, []);

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
    const locKey = typeof targetLocation === 'object' && targetLocation
      ? `${targetLocation.latitude}_${targetLocation.longitude}_${targetLocation.name || ''}`
      : String(targetLocation);

    if (lastFetchedKeyRef.current === locKey) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let data;
      if (typeof targetLocation === 'object' && targetLocation.latitude != null && targetLocation.longitude != null) {
        data = await fetchWeatherDataByCoords(targetLocation.latitude, targetLocation.longitude, targetLocation);
      } else {
        data = await fetchWeatherData(targetLocation);
      }

      lastFetchedKeyRef.current = locKey;
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
    lastFetchedKeyRef.current = '';
    setLocation(newLoc);
  }, []);

  const refreshWeather = useCallback(() => {
    if (location) {
      lastFetchedKeyRef.current = '';
      loadWeather(location);
    }
  }, [location, loadWeather]);

  const useCurrentLocation = useCallback(() => {
    if (typeof window === 'undefined' || !navigator || !navigator.geolocation) {
      setToast({
        id: Date.now(),
        type: 'error',
        message: 'Geolocation is not supported by your browser. Please search for your city above.',
        actionLabel: 'Search City',
      });
      return;
    }

    setIsLocating(true);
    setLoading(true);
    setError(null);

    const geoOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    const handleSuccess = async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        // Pass coordinates directly to fetch weather data immediately,
        // and resolve precise suburb / neighborhood in parallel
        const [locMeta, weatherResult] = await Promise.all([
          reverseGeocode(latitude, longitude).catch((err) => {
            console.warn('Reverse geocode error, falling back to coordinates:', err);
            return {
              name: 'Current Location',
              city: '',
              country: '',
              countryCode: '',
              admin1: '',
              latitude,
              longitude,
              fullDisplay: `GPS Location (${latitude.toFixed(2)}, ${longitude.toFixed(2)})`,
            };
          }),
          fetchWeatherDataByCoords(latitude, longitude, { latitude, longitude }),
        ]);

        const combinedLocation = {
          ...weatherResult.location,
          ...locMeta,
          latitude,
          longitude,
          fullDisplay: locMeta.fullDisplay || `${locMeta.name}${locMeta.country ? `, ${locMeta.country}` : ''}`,
        };

        const combinedData = {
          ...weatherResult,
          location: combinedLocation,
        };

        const locKey = `${latitude}_${longitude}_${locMeta.name || ''}`;
        lastFetchedKeyRef.current = locKey;

        setWeatherData(combinedData);
        setLocation(combinedLocation);

        try {
          localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(combinedLocation));
        } catch (e) {}

        setToast({
          id: Date.now(),
          type: 'success',
          message: `Location detected: ${locMeta.name || 'Current Location'}`,
        });
      } catch (err) {
        console.error('Failed to load weather for GPS position:', err);
        setToast({
          id: Date.now(),
          type: 'error',
          message: err.message || 'Unable to fetch weather forecast for your GPS coordinates.',
          actionLabel: 'Search City',
        });
      } finally {
        setLoading(false);
        setIsLocating(false);
      }
    };

    const handleFinalError = (geoErr) => {
      setIsLocating(false);
      setLoading(false);

      let msg = 'Failed to retrieve your location.';
      if (geoErr) {
        if (geoErr.code === 1 || geoErr.code === geoErr.PERMISSION_DENIED) {
          msg = 'Location permission was denied. Please allow location access or search manually.';
        } else if (geoErr.code === 2 || geoErr.code === geoErr.POSITION_UNAVAILABLE) {
          msg = 'Location information is currently unavailable. Please search for your city or suburb.';
        } else if (geoErr.code === 3 || geoErr.code === geoErr.TIMEOUT) {
          msg = 'Location request timed out. Please try again or search manually.';
        }
      }

      setToast({
        id: Date.now(),
        type: 'error',
        message: msg,
        actionLabel: 'Search City',
      });
    };

    const handleError = (geoErr) => {
      // If high accuracy times out, perform a rapid fallback retry with standard accuracy
      if (geoErr && (geoErr.code === 3 || geoErr.code === geoErr.TIMEOUT)) {
        navigator.geolocation.getCurrentPosition(
          handleSuccess,
          handleFinalError,
          { enableHighAccuracy: false, timeout: 6000, maximumAge: 30000 }
        );
        return;
      }

      handleFinalError(geoErr);
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, geoOptions);
  }, []);

  return {
    weatherData,
    loading,
    isLocating,
    error,
    toast,
    setToast,
    clearToast,
    unit,
    toggleUnit,
    selectLocation,
    refreshWeather,
    useCurrentLocation,
  };
};
