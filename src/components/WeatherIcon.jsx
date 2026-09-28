import React from 'react';
import {
  Sun,
  Moon,
  CloudSun,
  CloudMoon,
  Cloud,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  Snowflake,
  CloudLightning,
  Wind,
  Droplets,
  Eye,
  Gauge,
  Thermometer,
  Sunrise,
  Sunset,
  Compass,
} from 'lucide-react';

const ICON_MAP = {
  sun: Sun,
  moon: Moon,
  'cloud-sun': CloudSun,
  'cloud-moon': CloudMoon,
  cloud: Cloud,
  'cloud-fog': Cloud,
  'cloud-drizzle': CloudDrizzle,
  'cloud-rain': CloudRain,
  'cloud-snow': CloudSnow,
  snowflake: Snowflake,
  'cloud-lightning': CloudLightning,
  wind: Wind,
  droplets: Droplets,
  eye: Eye,
  gauge: Gauge,
  thermometer: Thermometer,
  sunrise: Sunrise,
  sunset: Sunset,
  compass: Compass,
};

const WeatherIcon = ({ name, size = 28, className = '', color }) => {
  const IconComponent = ICON_MAP[name] || Cloud;
  return <IconComponent size={size} className={`weather-icon ${className}`} color={color} />;
};

export default WeatherIcon;
