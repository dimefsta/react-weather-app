# 🌤️ SkyPulse — Modern React Weather App

An ultra-sleek, responsive weather application built with **React 18**, **Lucide Icons**, and modern **Glassmorphism CSS**, powered by live global weather data with zero mandatory API configuration.

---

## ✨ Features

- **🎨 Modern Glassmorphism UI**: Frosted glass surfaces (`backdrop-filter: blur(24px)`), ambient gradient lighting, subtle borders, and smooth micro-interactions.
- **🌈 Dynamic Weather-Reactive Themes**: Backgrounds and ambient lighting adapt automatically to current conditions:
  - *Clear Sky (Day / Night)*, *Cloudy / Overcast*, *Rain / Drizzle*, *Thunderstorm*, *Snow / Frost*, and *Fog / Mist*.
- **📍 Smart Autocomplete Search**: Debounced city lookup with country flags, admin regions, and full keyboard navigation (Arrow Up/Down, Enter, Esc).
- **⏱️ 24-Hour Timeline Forecast**: Smooth horizontal scrollable hourly rail with temperature curves, weather icons, and precipitation probability.
- **📅 7-Day Precision Forecast**: Daily weather conditions with dynamic proportional temperature range gradient bars.
- **📊 Advanced Weather Metrics Grid**:
  - **UV Index**: Live value with safety hazard rating & visual gauge.
  - **Wind & Gusts**: Velocity with animated compass needle aligned to real wind direction (e.g. `SW 225°`).
  - **Sun Schedule**: Sunrise & sunset times with active daylight progress tracker.
  - **Humidity & Comfort**: Percentage, dew point, and air comfort classification.
  - **Visibility & Barometric Pressure**: Distance in km/mi and atmospheric pressure in hPa.
  - **Cloud Coverage**: Real-time sky cloud coverage percentage meter.
- **⭐ Saved Favorite Cities**: Save favorite locations to `localStorage`, accessible via quick pill selectors with instant switching and removal.
- **🧭 One-Tap GPS Geolocation**: Fast browser geolocation lookup using `navigator.geolocation` and reverse geocoding.
- **🌡️ Unit Toggling**: Seamless one-click conversion between Celsius (`°C`) and Fahrenheit (`°F`) across all cards.
- **🔄 Instant Auto-Refresh**: Live data reload with smooth spin indicator.
- **💀 Shimmer Skeleton Loading & Resilient Error Handling**: Zero layout shift (CLS) during transitions, with graceful error recovery and quick fallback cities.

---

## 🛠️ Architecture & Tech Stack

- **React 18.3** (Custom Hooks, Concurrent Features, StrictMode)
- **Lucide React** (Clean, crisp, accessible SVG icon set)
- **Open-Meteo API** (Keyless, zero-setup, real-time forecasts, hourly curves, UV index)
- **OpenWeatherMap Integration Support** (Optional fallback via `REACT_APP_WEATHER_API_KEY`)
- **Pure Modern CSS3** (CSS custom properties, glassmorphism, flexbox & grid, reduced-motion queries)
- **Jest & React Testing Library** (Unit & component test coverage)

---

## 🚀 Getting Started

### 1. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/dimefsta/react-weather-app.git
cd react-weather-app
npm install
```

### 2. Run Locally
```bash
npm start
```
Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

### 3. Run Tests
```bash
npm test -- --watchAll=false
```

### 4. Build for Production
```bash
npm run build
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── CurrentWeather.jsx    # Hero card with temperature & condition artwork
│   ├── DailyForecast.jsx     # 7-day forecast with proportional temp bars
│   ├── ErrorMessage.jsx      # Glass error state with retry & fallback cities
│   ├── FavoritesBar.jsx      # Saved city pills carousel
│   ├── Header.jsx            # Top navbar, branding, actions & search
│   ├── HourlyForecast.jsx    # 24-hour horizontal scrolling rail
│   ├── SearchBar.jsx         # Debounced search input with autocomplete
│   ├── SkeletonLoader.jsx    # Shimmer loading placeholder
│   ├── WeatherApp.jsx        # Main application layout & theme coordinator
│   ├── WeatherIcon.jsx       # Semantic weather icon resolver
│   ├── WeatherMetrics.jsx    # 6-card advanced weather metrics grid
│   └── WeatherApp.css        # Glassmorphism design system & dynamic themes
├── hooks/
│   ├── useFavorites.js       # LocalStorage favorites state manager
│   └── useWeather.js         # Weather data fetcher, units & geolocation
├── services/
│   └── weatherService.js     # Unified API engine (Open-Meteo & OpenWeather)
├── utils/
│   └── weatherUtils.js       # Unit conversions, math & compass directions
├── index.css                 # Global reset & typography
├── index.js                  # React DOM entry point
└── WeatherApp.test.js        # Comprehensive test suite
```

---

## 📄 License
MIT
