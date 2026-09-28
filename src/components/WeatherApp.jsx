import React, { useState } from 'react';
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
import './WeatherApp.css';

function WeatherApp() {
  const {
    weatherData,
    loading,
    error,
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

      <div className="app-container">
        {/* Top Header & Search Navigation */}
        <Header
          onSelectLocation={selectLocation}
          onUseCurrentLocation={useCurrentLocation}
          onRefresh={refreshWeather}
          isRefreshing={loading}
          unit={unit}
          onToggleUnit={toggleUnit}
          currentLocation={weatherData?.location}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          showFavoritesBar={showFavoritesBar}
          onToggleFavoritesBar={() => setShowFavoritesBar((prev) => !prev)}
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
              {/* Primary Column: Hero Weather & 7-Day Forecast */}
              <div className="dashboard-column col-primary">
                <CurrentWeather weatherData={weatherData} unit={unit} />
                <DailyForecast dailyData={weatherData.daily} unit={unit} />
              </div>

              {/* Secondary Column: 24h Hourly Curve & 6 Advanced Metric Cards */}
              <div className="dashboard-column col-secondary">
                <HourlyForecast hourlyData={weatherData.hourly} unit={unit} />
                <WeatherMetrics weatherData={weatherData} unit={unit} />
              </div>
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
