import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import WeatherApp from './components/WeatherApp'; // Import your main WeatherApp component
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <WeatherApp />  {/* Render your WeatherApp component */}
  </React.StrictMode>
);

reportWebVitals();  // Optional: Keep this for performance measurements or remove if not needed
