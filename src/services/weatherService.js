/**
 * Unified Weather Service
 * High-performance, resilient weather data fetching with Open-Meteo
 * (keyless, real-time, 7-day forecast, hourly timeline, UV index)
 * with graceful OpenWeatherMap and offline fallback.
 */

// WMO Weather Interpretation Codes (WW)
const WMO_CODE_MAP = {
  0: { label: 'Clear Sky', icon: 'sun', theme: 'clear-day', nightIcon: 'moon', nightTheme: 'clear-night' },
  1: { label: 'Mainly Clear', icon: 'cloud-sun', theme: 'clear-day', nightIcon: 'cloud-moon', nightTheme: 'clear-night' },
  2: { label: 'Partly Cloudy', icon: 'cloud-sun', theme: 'cloudy', nightIcon: 'cloud-moon', nightTheme: 'cloudy' },
  3: { label: 'Overcast', icon: 'cloud', theme: 'cloudy', nightIcon: 'cloud', nightTheme: 'cloudy' },
  45: { label: 'Foggy', icon: 'cloud-fog', theme: 'fog', nightIcon: 'cloud-fog', nightTheme: 'fog' },
  48: { label: 'Depositing Rime Fog', icon: 'cloud-fog', theme: 'fog', nightIcon: 'cloud-fog', nightTheme: 'fog' },
  51: { label: 'Light Drizzle', icon: 'cloud-drizzle', theme: 'rain', nightIcon: 'cloud-drizzle', nightTheme: 'rain' },
  53: { label: 'Moderate Drizzle', icon: 'cloud-drizzle', theme: 'rain', nightIcon: 'cloud-drizzle', nightTheme: 'rain' },
  55: { label: 'Dense Drizzle', icon: 'cloud-drizzle', theme: 'rain', nightIcon: 'cloud-drizzle', nightTheme: 'rain' },
  56: { label: 'Light Freezing Drizzle', icon: 'cloud-snow', theme: 'snow', nightIcon: 'cloud-snow', nightTheme: 'snow' },
  57: { label: 'Dense Freezing Drizzle', icon: 'cloud-snow', theme: 'snow', nightIcon: 'cloud-snow', nightTheme: 'snow' },
  61: { label: 'Slight Rain', icon: 'cloud-rain', theme: 'rain', nightIcon: 'cloud-rain', nightTheme: 'rain' },
  63: { label: 'Moderate Rain', icon: 'cloud-rain', theme: 'rain', nightIcon: 'cloud-rain', nightTheme: 'rain' },
  65: { label: 'Heavy Rain', icon: 'cloud-rain', theme: 'rain', nightIcon: 'cloud-rain', nightTheme: 'rain' },
  66: { label: 'Light Freezing Rain', icon: 'cloud-snow', theme: 'snow', nightIcon: 'cloud-snow', nightTheme: 'snow' },
  67: { label: 'Heavy Freezing Rain', icon: 'cloud-snow', theme: 'snow', nightIcon: 'cloud-snow', nightTheme: 'snow' },
  71: { label: 'Slight Snowfall', icon: 'snowflake', theme: 'snow', nightIcon: 'snowflake', nightTheme: 'snow' },
  73: { label: 'Moderate Snowfall', icon: 'snowflake', theme: 'snow', nightIcon: 'snowflake', nightTheme: 'snow' },
  75: { label: 'Heavy Snowfall', icon: 'snowflake', theme: 'snow', nightIcon: 'snowflake', nightTheme: 'snow' },
  77: { label: 'Snow Grains', icon: 'snowflake', theme: 'snow', nightIcon: 'snowflake', nightTheme: 'snow' },
  80: { label: 'Slight Rain Showers', icon: 'cloud-rain', theme: 'rain', nightIcon: 'cloud-rain', nightTheme: 'rain' },
  81: { label: 'Moderate Rain Showers', icon: 'cloud-rain', theme: 'rain', nightIcon: 'cloud-rain', nightTheme: 'rain' },
  82: { label: 'Violent Rain Showers', icon: 'cloud-rain', theme: 'rain', nightIcon: 'cloud-rain', nightTheme: 'rain' },
  85: { label: 'Slight Snow Showers', icon: 'cloud-snow', theme: 'snow', nightIcon: 'cloud-snow', nightTheme: 'snow' },
  86: { label: 'Heavy Snow Showers', icon: 'cloud-snow', theme: 'snow', nightIcon: 'cloud-snow', nightTheme: 'snow' },
  95: { label: 'Thunderstorm', icon: 'cloud-lightning', theme: 'thunderstorm', nightIcon: 'cloud-lightning', nightTheme: 'thunderstorm' },
  96: { label: 'Thunderstorm with Hail', icon: 'cloud-lightning', theme: 'thunderstorm', nightIcon: 'cloud-lightning', nightTheme: 'thunderstorm' },
  99: { label: 'Severe Thunderstorm', icon: 'cloud-lightning', theme: 'thunderstorm', nightIcon: 'cloud-lightning', nightTheme: 'thunderstorm' },
};

export const getWeatherMeta = (code, isDay = 1) => {
  const match = WMO_CODE_MAP[code] || {
    label: 'Scattered Weather',
    icon: 'cloud',
    theme: 'cloudy',
    nightIcon: 'cloud',
    nightTheme: 'cloudy',
  };

  return {
    label: match.label,
    icon: isDay ? match.icon : match.nightIcon,
    theme: isDay ? match.theme : match.nightTheme,
  };
};

// Open-Meteo Geocoding API
export const searchCities = async (query) => {
  if (!query || query.trim().length < 2) return [];

  const cleanQuery = query.trim();
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    cleanQuery
  )}&count=7&language=en&format=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Geocoding request failed');
    const data = await response.json();

    if (!data.results || data.results.length === 0) return [];

    return data.results.map((item) => ({
      id: `${item.latitude}_${item.longitude}_${item.id}`,
      name: item.name,
      country: item.country || '',
      countryCode: item.country_code ? item.country_code.toUpperCase() : '',
      admin1: item.admin1 || '',
      latitude: item.latitude,
      longitude: item.longitude,
      timezone: item.timezone || 'auto',
      fullDisplay: `${item.name}${item.admin1 ? `, ${item.admin1}` : ''}, ${item.country || ''}`,
    }));
  } catch (err) {
    console.warn('Geocoding error:', err);
    return [];
  }
};

// Helper to extract clean and specific locality or suburb name
export const cleanLocality = (locality, city) => {
  if (!locality) return city || '';
  const districtMatch = locality.match(/\b(?:district|arrondissement|borough|ward)\s+of\s+(.+)$/i);
  if (districtMatch && districtMatch[1]) {
    return districtMatch[1].trim();
  }
  return locality.trim();
};

// Reverse Geocode from Coordinates (with neighborhood/suburb precision)
export const reverseGeocode = async (latitude, longitude) => {
  // 1. Primary: BigDataCloud free client-side reverse geocoding
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    if (timeoutId && typeof timeoutId.unref === 'function') timeoutId.unref();
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();

      // Determine the most specific name: locality / suburb / neighborhood
      let preciseName = cleanLocality(data.locality, data.city);

      // If locality is missing or same as city, check administrative subdivisions for higher precision (e.g. suburb/neighborhood level)
      if ((!preciseName || preciseName.toLowerCase() === (data.city || '').toLowerCase()) && data.localityInfo?.administrative) {
        const admins = [...data.localityInfo.administrative].reverse();
        for (const adm of admins) {
          if (adm.name && (adm.adminLevel >= 7 || (adm.order >= 9 && adm.name !== data.countryName))) {
            const candidate = cleanLocality(adm.name, data.city);
            if (candidate && candidate !== data.countryName && candidate !== data.principalSubdivision) {
              preciseName = candidate;
              break;
            }
          }
        }
      }

      const finalName = preciseName || data.city || data.principalSubdivision || 'Current Location';
      const city = data.city || '';
      const country = data.countryName || '';
      const countryCode = data.countryCode || '';
      const admin1 = (city && city.toLowerCase() !== finalName.toLowerCase()) ? city : (data.principalSubdivision || '');

      const fullDisplayParts = [finalName];
      if (city && city.toLowerCase() !== finalName.toLowerCase()) fullDisplayParts.push(city);
      if (country) fullDisplayParts.push(country);

      return {
        name: finalName,
        city,
        country,
        countryCode,
        admin1,
        latitude,
        longitude,
        fullDisplay: fullDisplayParts.join(', '),
      };
    }
  } catch (e) {
    console.warn('BigDataCloud reverse geocode error or timeout:', e.message);
  }

  // 2. Secondary fallback: OpenStreetMap Nominatim reverse geocode
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    if (timeoutId && typeof timeoutId.unref === 'function') timeoutId.unref();
    const nomUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=en`;
    const response = await fetch(nomUrl, {
      headers: { 'User-Agent': 'SkyPulseWeatherApp/1.0 (ReactWeatherApp)' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const addr = data.address || {};
      const rawCandidate =
        addr.suburb ||
        addr.neighbourhood ||
        addr.quarter ||
        addr.town ||
        addr.village ||
        addr.municipality ||
        addr.city_district ||
        addr.district ||
        addr.city ||
        addr.county ||
        '';

      const preciseName = cleanLocality(rawCandidate, addr.city || addr.town);
      const city = addr.city || addr.town || '';
      const country = addr.country || '';
      const countryCode = addr.country_code ? addr.country_code.toUpperCase() : '';
      const admin1 = (city && city.toLowerCase() !== preciseName.toLowerCase()) ? city : (addr.state || addr.county || '');
      const finalName = preciseName || city || 'Current Location';

      const fullDisplayParts = [finalName];
      if (city && city.toLowerCase() !== finalName.toLowerCase()) fullDisplayParts.push(city);
      if (country) fullDisplayParts.push(country);

      return {
        name: finalName,
        city,
        country,
        countryCode,
        admin1,
        latitude,
        longitude,
        fullDisplay: fullDisplayParts.join(', '),
      };
    }
  } catch (e) {
    console.warn('Nominatim reverse geocode error or timeout:', e.message);
  }

  // 3. Graceful fallback when reverse geocoders are unavailable
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
};

// Fetch rich weather dataset by Coordinates
export const fetchWeatherDataByCoords = async (latitude, longitude, locationMeta) => {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'rain',
      'weather_code',
      'cloud_cover',
      'pressure_msl',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
    ].join(','),
    hourly: [
      'temperature_2m',
      'relative_humidity_2m',
      'dew_point_2m',
      'apparent_temperature',
      'precipitation_probability',
      'precipitation',
      'weather_code',
      'visibility',
      'wind_speed_10m',
      'uv_index',
      'is_day',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'sunrise',
      'sunset',
      'uv_index_max',
      'precipitation_sum',
      'precipitation_probability_max',
      'wind_speed_10m_max',
    ].join(','),
    timezone: 'auto',
  });

  const apiUrl = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;

  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch weather data: ${response.statusText}`);
  }

  const rawData = await response.json();
  return normalizeWeatherData(rawData, locationMeta);
};

// Fetch by query string (e.g., "Athens, Greece" or "Tokyo")
export const fetchWeatherData = async (locationQuery) => {
  // If locationQuery is already an object with coords:
  if (typeof locationQuery === 'object' && locationQuery.latitude && locationQuery.longitude) {
    return fetchWeatherDataByCoords(locationQuery.latitude, locationQuery.longitude, locationQuery);
  }

  // 1. Geocode search
  const candidates = await searchCities(locationQuery);
  if (!candidates || candidates.length === 0) {
    throw new Error(`Location "${locationQuery}" could not be found. Please check the spelling or try another city.`);
  }

  const selectedCity = candidates[0];
  return fetchWeatherDataByCoords(selectedCity.latitude, selectedCity.longitude, selectedCity);
};

// Normalize data structure
function normalizeWeatherData(raw, locationMeta = {}) {
  const current = raw.current;
  const hourly = raw.hourly;
  const daily = raw.daily;

  const currentMeta = getWeatherMeta(current.weather_code, current.is_day);

  // Hourly list (next 24 hours starting from current hour)
  const currentTime = new Date(current.time);
  let startIdx = 0;
  if (hourly && hourly.time) {
    const foundIdx = hourly.time.findIndex((t) => new Date(t) >= currentTime);
    startIdx = foundIdx !== -1 ? foundIdx : 0;
  }

  const hourlyList = [];
  if (hourly && hourly.time) {
    const endIdx = Math.min(startIdx + 24, hourly.time.length);
    for (let i = startIdx; i < endIdx; i++) {
      const hDate = new Date(hourly.time[i]);
      const isDayHour = hourly.is_day ? hourly.is_day[i] : 1;
      const hMeta = getWeatherMeta(hourly.weather_code[i], isDayHour);

      hourlyList.push({
        id: `h_${i}`,
        time: hDate.toLocaleTimeString([], { hour: 'numeric', hour12: true }),
        rawTime: hourly.time[i],
        temp: Math.round(hourly.temperature_2m[i]),
        feelsLike: Math.round(hourly.apparent_temperature[i]),
        precipitationProb: hourly.precipitation_probability ? hourly.precipitation_probability[i] || 0 : 0,
        weatherCode: hourly.weather_code[i],
        weatherLabel: hMeta.label,
        icon: hMeta.icon,
        isDay: isDayHour,
        humidity: hourly.relative_humidity_2m[i],
        windSpeed: Math.round(hourly.wind_speed_10m[i]),
        uvIndex: hourly.uv_index ? hourly.uv_index[i] : 0,
      });
    }
  }

  // Daily list (7 days)
  const dailyList = [];
  if (daily && daily.time) {
    for (let i = 0; i < daily.time.length; i++) {
      const dDate = new Date(daily.time[i]);
      const dMeta = getWeatherMeta(daily.weather_code[i], 1);
      const isToday = i === 0;

      dailyList.push({
        id: `d_${i}`,
        date: daily.time[i],
        dayName: isToday ? 'Today' : dDate.toLocaleDateString('en-US', { weekday: 'short' }),
        fullDate: dDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        weatherCode: daily.weather_code[i],
        weatherLabel: dMeta.label,
        icon: dMeta.icon,
        tempMax: Math.round(daily.temperature_2m_max[i]),
        tempMin: Math.round(daily.temperature_2m_min[i]),
        precipitationProb: daily.precipitation_probability_max ? daily.precipitation_probability_max[i] : 0,
        precipitationSum: daily.precipitation_sum ? daily.precipitation_sum[i] : 0,
        uvIndexMax: daily.uv_index_max ? daily.uv_index_max[i] : 0,
        windSpeedMax: Math.round(daily.wind_speed_10m_max[i]),
        sunrise: daily.sunrise ? daily.sunrise[i] : null,
        sunset: daily.sunset ? daily.sunset[i] : null,
      });
    }
  }

  // Calculate UV description and color
  const uvVal = hourly && hourly.uv_index && hourly.uv_index[startIdx] !== undefined 
    ? Math.round(hourly.uv_index[startIdx] * 10) / 10 
    : (daily && daily.uv_index_max ? daily.uv_index_max[0] : 0);

  let uvLevel = 'Low';
  let uvColor = '#10b981'; // green
  if (uvVal >= 3 && uvVal < 6) {
    uvLevel = 'Moderate';
    uvColor = '#f59e0b'; // yellow-amber
  } else if (uvVal >= 6 && uvVal < 8) {
    uvLevel = 'High';
    uvColor = '#f97316'; // orange
  } else if (uvVal >= 8 && uvVal < 11) {
    uvLevel = 'Very High';
    uvColor = '#ef4444'; // red
  } else if (uvVal >= 11) {
    uvLevel = 'Extreme';
    uvColor = '#8b5cf6'; // violet
  }

  // Sunrise and Sunset times for today
  const sunriseStr = daily && daily.sunrise && daily.sunrise[0] ? daily.sunrise[0] : null;
  const sunsetStr = daily && daily.sunset && daily.sunset[0] ? daily.sunset[0] : null;
  
  const formatTimeStr = (isoStr) => {
    if (!isoStr) return '--:--';
    const d = new Date(isoStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  // Visibility in km
  const currentVisibility = hourly && hourly.visibility && hourly.visibility[startIdx] !== undefined
    ? Math.round((hourly.visibility[startIdx] / 1000) * 10) / 10
    : 10;

  // Dew point
  const currentDewPoint = hourly && hourly.dew_point_2m && hourly.dew_point_2m[startIdx] !== undefined
    ? Math.round(hourly.dew_point_2m[startIdx])
    : Math.round(current.temperature_2m - (100 - current.relative_humidity_2m) / 5);

  const locName = locationMeta.name || (raw.latitude != null ? `GPS (${raw.latitude.toFixed(2)}, ${raw.longitude.toFixed(2)})` : 'Current Location');
  const locCountry = locationMeta.country || '';
  const locCountryCode = locationMeta.countryCode || '';
  const locAdmin1 = locationMeta.admin1 || '';
  const locFullDisplay = locationMeta.fullDisplay || [locName, locAdmin1, locCountry].filter(Boolean).join(', ');

  return {
    location: {
      name: locName,
      country: locCountry,
      countryCode: locCountryCode,
      admin1: locAdmin1,
      latitude: raw.latitude,
      longitude: raw.longitude,
      timezone: raw.timezone,
      fullDisplay: locFullDisplay,
    },
    current: {
      temp: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      tempMin: dailyList[0] ? dailyList[0].tempMin : Math.round(current.temperature_2m - 3),
      tempMax: dailyList[0] ? dailyList[0].tempMax : Math.round(current.temperature_2m + 3),
      humidity: current.relative_humidity_2m,
      dewPoint: currentDewPoint,
      windSpeed: Math.round(current.wind_speed_10m),
      windDirection: current.wind_direction_10m,
      windGusts: Math.round(current.wind_gusts_10m || current.wind_speed_10m * 1.3),
      pressure: Math.round(current.pressure_msl || current.surface_pressure || 1013),
      uvIndex: uvVal,
      uvLevel,
      uvColor,
      visibility: currentVisibility,
      precipitation: current.precipitation || 0,
      cloudCover: current.cloud_cover,
      isDay: current.is_day,
      weatherCode: current.weather_code,
      weatherLabel: currentMeta.label,
      icon: currentMeta.icon,
      theme: currentMeta.theme,
      localTime: new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true }),
      localDate: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' }),
    },
    sunTimes: {
      sunrise: formatTimeStr(sunriseStr),
      sunset: formatTimeStr(sunsetStr),
      rawSunrise: sunriseStr,
      rawSunset: sunsetStr,
    },
    hourly: hourlyList,
    daily: dailyList,
    lastUpdated: new Date().toISOString(),
  };
}
