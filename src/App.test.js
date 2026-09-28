import { render, screen } from '@testing-library/react';
import WeatherApp from './components/WeatherApp';

test('renders SkyPulse brand', () => {
  render(<WeatherApp />);
  const brandElements = screen.getAllByText(/SkyPulse/i);
  expect(brandElements.length).toBeGreaterThan(0);
});
