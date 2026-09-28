import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import WeatherApp from './components/WeatherApp';
import { formatTemp, formatSpeed, getCompassDirection, calculateSunProgress } from './utils/weatherUtils';
import { getWeatherMeta, reverseGeocode, cleanLocality } from './services/weatherService';

// Mock weather data
const mockWeatherData = {
  latitude: 37.98,
  longitude: 23.73,
  timezone: 'Europe/Athens',
  current: {
    time: '2026-09-28T21:00',
    temperature_2m: 22,
    relative_humidity_2m: 55,
    apparent_temperature: 22,
    is_day: 0,
    precipitation: 0,
    weather_code: 0,
    cloud_cover: 10,
    pressure_msl: 1015,
    wind_speed_10m: 12,
    wind_direction_10m: 210,
    wind_gusts_10m: 18,
  },
  hourly: {
    time: ['2026-09-28T21:00', '2026-09-28T22:00'],
    temperature_2m: [22, 21],
    relative_humidity_2m: [55, 58],
    apparent_temperature: [22, 21],
    precipitation_probability: [0, 0],
    weather_code: [0, 0],
    wind_speed_10m: [12, 11],
    visibility: [10000, 10000],
    is_day: [0, 0],
    uv_index: [0, 0],
  },
  daily: {
    time: ['2026-09-28', '2026-09-29'],
    weather_code: [0, 1],
    temperature_2m_max: [26, 27],
    temperature_2m_min: [18, 19],
    apparent_temperature_max: [26, 27],
    apparent_temperature_min: [18, 19],
    sunrise: ['2026-09-28T07:15', '2026-09-29T07:16'],
    sunset: ['2026-09-28T19:20', '2026-09-29T19:18'],
    uv_index_max: [6.2, 6.4],
    precipitation_sum: [0, 0],
    precipitation_probability_max: [5, 10],
    wind_speed_10m_max: [15, 14],
  },
};

describe('Weather Utilities', () => {
  test('formats temperature correctly in Celsius and Fahrenheit', () => {
    expect(formatTemp(25, 'C')).toBe('25°C');
    expect(formatTemp(0, 'C')).toBe('0°C');
    expect(formatTemp(25, 'F')).toBe('77°F');
    expect(formatTemp(null, 'C')).toBe('--');
  });

  test('formats speed correctly in km/h and mph', () => {
    expect(formatSpeed(20, 'C')).toBe('20 km/h');
    expect(formatSpeed(20, 'F')).toBe('12 mph');
    expect(formatSpeed(null, 'C')).toBe('--');
  });

  test('calculates compass direction from degrees', () => {
    expect(getCompassDirection(0)).toBe('N');
    expect(getCompassDirection(90)).toBe('E');
    expect(getCompassDirection(180)).toBe('S');
    expect(getCompassDirection(270)).toBe('W');
    expect(getCompassDirection(225)).toBe('SW');
  });

  test('calculates sun progress within range 0-100', () => {
    const sunrise = new Date(Date.now() - 3600000).toISOString();
    const sunset = new Date(Date.now() + 3600000).toISOString();
    const progress = calculateSunProgress(sunrise, sunset);
    expect(progress).toBeGreaterThanOrEqual(0);
    expect(progress).toBeLessThanOrEqual(100);
  });

  test('maps WMO weather codes to appropriate icons and themes', () => {
    const clearDay = getWeatherMeta(0, 1);
    expect(clearDay.icon).toBe('sun');
    expect(clearDay.theme).toBe('clear-day');

    const clearNight = getWeatherMeta(0, 0);
    expect(clearNight.icon).toBe('moon');
    expect(clearNight.theme).toBe('clear-night');

    const thunderstorm = getWeatherMeta(95, 1);
    expect(thunderstorm.theme).toBe('thunderstorm');
  });

  test('cleans locality strings and preserves suburbs like Palaio Faliro', () => {
    expect(cleanLocality('Palaio Faliro', 'Athens')).toBe('Palaio Faliro');
    expect(cleanLocality('4th District of Peristeri', 'Athens')).toBe('Peristeri');
    expect(cleanLocality('', 'Athens')).toBe('Athens');
  });

  test('resolves precise suburb/neighborhood like Palaio Faliro using OpenStreetMap Nominatim', async () => {
    const originalFetch = global.fetch;
    global.fetch = jest.fn((url) => {
      if (String(url).includes('nominatim')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              address: {
                suburb: 'Palaio Faliro',
                municipality: 'Municipality of Palaio Faliro',
                state: 'Attica',
                country: 'Greece',
                country_code: 'gr',
              },
            }),
        });
      }
      return Promise.reject(new Error('Unknown url'));
    });

    const result = await reverseGeocode(37.928, 23.698);
    expect(result.name).toBe('Palaio Faliro');
    expect(result.countryCode).toBe('GR');
    expect(result.fullDisplay).toContain('Palaio Faliro');
    global.fetch = originalFetch;
  });

  test('falls back to BigDataCloud when primary reverse geocoder is unavailable', async () => {
    const originalFetch = global.fetch;
    global.fetch = jest.fn((url) => {
      if (String(url).includes('nominatim')) {
        return Promise.resolve({ ok: false, status: 500 });
      }
      if (String(url).includes('bigdatacloud')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              locality: 'Palaio Faliro',
              city: 'Athens',
              countryName: 'Greece',
              countryCode: 'GR',
              principalSubdivision: 'Attiki',
            }),
        });
      }
      return Promise.reject(new Error('Unknown url'));
    });

    const result = await reverseGeocode(37.928, 23.698);
    expect(result.name).toBe('Palaio Faliro');
    expect(result.countryCode).toBe('GR');
    global.fetch = originalFetch;
  });
});

describe('WeatherApp Component', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockWeatherData),
      })
    );
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders application header and branding', async () => {
    render(<WeatherApp />);
    const elements = screen.getAllByText(/SkyPulse/i);
    expect(elements.length).toBeGreaterThan(0);
    expect(screen.getByPlaceholderText(/Search city, province, or country.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Humidity & Air/i)).toBeInTheDocument();
    });
  });

  test('triggers geolocation with enableHighAccuracy: true on GPS button click', async () => {
    const mockGetCurrentPosition = jest.fn();
    global.navigator.geolocation = {
      getCurrentPosition: mockGetCurrentPosition,
    };

    render(<WeatherApp />);
    await waitFor(() => {
      expect(screen.getByText(/Humidity & Air/i)).toBeInTheDocument();
    });

    const gpsBtn = screen.getByLabelText(/Use current location/i);
    fireEvent.click(gpsBtn);

    expect(mockGetCurrentPosition).toHaveBeenCalled();
    const options = mockGetCurrentPosition.mock.calls[0][2];
    expect(options).toMatchObject({ enableHighAccuracy: true });
  });

  test('displays friendly toast notification and falls back to Athens when location access is denied', async () => {
    const mockGetCurrentPosition = jest.fn((success, error) => {
      error({ code: 1, PERMISSION_DENIED: 1, message: 'User denied geolocation' });
    });
    global.navigator.geolocation = {
      getCurrentPosition: mockGetCurrentPosition,
    };

    render(<WeatherApp />);
    await waitFor(() => {
      expect(screen.getByText(/Humidity & Air/i)).toBeInTheDocument();
    });

    const gpsBtn = screen.getByLabelText(/Use current location/i);
    fireEvent.click(gpsBtn);

    await waitFor(() => {
      expect(screen.getByText(/Location permission was denied/i)).toBeInTheDocument();
      expect(screen.getByText(/Search City/i)).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Athens' })).toBeInTheDocument();
    });
  });

  test('updates to precise suburb like Palaio Faliro on geolocation success', async () => {
    const mockGetCurrentPosition = jest.fn((success) => {
      success({
        coords: {
          latitude: 37.928,
          longitude: 23.698,
        },
      });
    });
    global.navigator.geolocation = {
      getCurrentPosition: mockGetCurrentPosition,
    };

    global.fetch = jest.fn((url) => {
      if (String(url).includes('nominatim')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              address: {
                suburb: 'Palaio Faliro',
                municipality: 'Municipality of Palaio Faliro',
                state: 'Attica',
                country: 'Greece',
                country_code: 'gr',
              },
            }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockWeatherData),
      });
    });

    render(<WeatherApp />);
    await waitFor(() => {
      expect(screen.getByText(/Humidity & Air/i)).toBeInTheDocument();
    });

    const gpsBtn = screen.getByLabelText(/Use current location/i);
    fireEvent.click(gpsBtn);

    await waitFor(() => {
      expect(screen.getByText(/Location detected: Palaio Faliro/i)).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Palaio Faliro' })).toBeInTheDocument();
    });
  });
});
