import React from 'react';
import ReactDOM from 'react-dom/client';
import 'boxicons/css/boxicons.min.css';
import './index.css'; // You can keep or modify this
import WeatherApp from './components/WeatherApp'; // Import your main WeatherApp component
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <WeatherApp />  {/* Render your WeatherApp component */}
  </React.StrictMode>
);

reportWebVitals();  // Optional: Keep this for performance measurements or remove if not needed
