/**
 * Weather utilities for conversions, formatting, and mathematical calculations
 */

export const formatTemp = (tempInCelsius, unit = 'C') => {
  if (tempInCelsius === null || tempInCelsius === undefined || isNaN(tempInCelsius)) return '--';
  if (unit === 'F') {
    return `${Math.round((tempInCelsius * 9) / 5 + 32)}°F`;
  }
  return `${Math.round(tempInCelsius)}°C`;
};

export const formatSpeed = (speedKmh, unit = 'C') => {
  if (speedKmh === null || speedKmh === undefined || isNaN(speedKmh)) return '--';
  if (unit === 'F') {
    return `${Math.round(speedKmh * 0.621371)} mph`;
  }
  return `${Math.round(speedKmh)} km/h`;
};

export const formatDistance = (distKm, unit = 'C') => {
  if (distKm === null || distKm === undefined || isNaN(distKm)) return '--';
  if (unit === 'F') {
    return `${(distKm * 0.621371).toFixed(1)} mi`;
  }
  return `${distKm.toFixed(1)} km`;
};

export const getCompassDirection = (degrees) => {
  if (degrees === undefined || degrees === null) return 'N';
  const directions = [
    'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
    'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'
  ];
  const index = Math.round(((degrees %= 360) < 0 ? degrees + 360 : degrees) / 22.5) % 16;
  return directions[index];
};

export const calculateSunProgress = (rawSunrise, rawSunset) => {
  if (!rawSunrise || !rawSunset) return 50;
  const now = new Date().getTime();
  const rise = new Date(rawSunrise).getTime();
  const set = new Date(rawSunset).getTime();

  if (now <= rise) return 0;
  if (now >= set) return 100;

  const total = set - rise;
  const current = now - rise;
  return Math.min(100, Math.max(0, Math.round((current / total) * 100)));
};

export const getAirComfortDescription = (humidity) => {
  if (humidity < 30) return { label: 'Dry air', sub: 'May feel dry to skin' };
  if (humidity <= 60) return { label: 'Comfortable', sub: 'Ideal humidity levels' };
  if (humidity <= 80) return { label: 'Humid', sub: 'Noticeable moisture in air' };
  return { label: 'Very Muggy', sub: 'High oppressive moisture' };
};
