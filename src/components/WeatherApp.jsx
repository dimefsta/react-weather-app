import React, { useState, useRef } from 'react';
import { useWeather } from '../hooks/useWeather';
import { useFavorites } from '../hooks/useFavorites';
import Header from './Header';
import FavoritesBar from './FavoritesBar';
import CurrentWeather from './CurrentWeather';
import HourlyForecast from './HourlyForecast';
import DailyForecast from './DailyForecast';
import WeatherMetrics from './WeatherMetrics';
import SkeletonLoader from './SkeletonLoader';
import ErrorMessage from './ErrorMessage';
import Toast from './Toast';
import './WeatherApp.css';

function WeatherApp() {
  const searchInputRef = useRef(null);

  const {
    weatherData,
    loading,
    isLocating,
    error,
    toast,
    clearToast,
    unit,
    toggleUnit,
    selectLocation,
    refreshWeather,
    useCurrentLocation,
  } = useWeather();

  const {
    favorites,
    isFavorite,
    toggleFavorite,
    removeFavorite,
  } = useFavorites();

  const [showFavoritesBar, setShowFavoritesBar] = useState(true);

  const activeTheme = weatherData?.current?.theme || 'clear-day';

  return (
    <div className={`weather-app-root theme-${activeTheme}`}>
      {/* Dynamic atmospheric ambient lighting blobs */}
      <div className="ambient-background" aria-hidden="true">
        <div className="ambient-blob blob-1" />
        <div className="ambient-blob blob-2" />
        <div className="ambient-blob blob-3" />
      </div>

      {/* Notifications / Toast Feedback */}
      <Toast
        toast={toast}
        onClose={clearToast}
        onAction={() => {
          if (searchInputRef.current) {
            searchInputRef.current.focus();
            searchInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }}
      />

      <div className="app-container">
        {/* Top Header & Search Navigation */}
        <Header
          onSelectLocation={selectLocation}
          onUseCurrentLocation={useCurrentLocation}
          isLocating={isLocating}
          onRefresh={refreshWeather}
          isRefreshing={loading}
          unit={unit}
          onToggleUnit={toggleUnit}
          currentLocation={weatherData?.location}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          showFavoritesBar={showFavoritesBar}
          onToggleFavoritesBar={() => setShowFavoritesBar((prev) => !prev)}
          searchInputRef={searchInputRef}
        />

        {/* Favorite Cities Quick Access Bar */}
        {showFavoritesBar && (
          <FavoritesBar
            favorites={favorites}
            activeCityName={weatherData?.location?.name}
            onSelectLocation={selectLocation}
            onRemoveFavorite={removeFavorite}
          />
        )}

        {/* Main Weather Dashboard */}
        <main className="dashboard-content">
          {loading && !weatherData && <SkeletonLoader />}

          {error && !weatherData && (
            <ErrorMessage
              error={error}
              onRetry={refreshWeather}
              onSelectLocation={selectLocation}
            />
          )}

          {weatherData && (
            <div className="dashboard-grid">
              {/* 1. Current Weather (Hero Focal Point) */}
              <CurrentWeather weatherData={weatherData} unit={unit} />

              {/* 2. 24-Hour Hourly Timeline */}
              <HourlyForecast hourlyData={weatherData.hourly} unit={unit} />

              {/* 3. 7-Day Precision Forecast */}
              <DailyForecast dailyData={weatherData.daily} unit={unit} />

              {/* 4. Advanced Metrics (UV, Wind, Sun, Humidity, etc.) */}
              <WeatherMetrics weatherData={weatherData} unit={unit} />
            </div>
          )}
        </main>

        <footer className="app-footer">
          <p className="footer-credits">
            SkyPulse Weather • Hyperlocal Real-Time Forecast • Precision Metrics
          </p>
        </footer>
      </div>
    </div>
  );
}

export default WeatherApp;
