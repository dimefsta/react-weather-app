import React from 'react';

function SkeletonLoader() {
  return (
    <div className="skeleton-dashboard dashboard-grid" aria-busy="true" aria-label="Loading forecast data">
      {/* Hero Card Skeleton */}
      <div className="skeleton-card current-weather-hero skeleton-hero">
        <div className="skeleton-row space-between">
          <div className="skeleton-box" style={{ width: '140px', height: '24px' }} />
          <div className="skeleton-box" style={{ width: '90px', height: '18px' }} />
        </div>
        <div className="skeleton-row" style={{ marginTop: '16px', alignItems: 'center' }}>
          <div className="skeleton-box" style={{ width: '120px', height: '60px' }} />
          <div className="skeleton-circle" style={{ width: '60px', height: '60px', marginLeft: 'auto' }} />
        </div>
        <div className="skeleton-row" style={{ marginTop: '14px' }}>
          <div className="skeleton-box" style={{ width: '180px', height: '18px' }} />
        </div>
        <div className="skeleton-footer-row" style={{ marginTop: 'auto', paddingTop: '16px' }}>
          <div className="skeleton-box" style={{ width: '30%', height: '32px' }} />
          <div className="skeleton-box" style={{ width: '30%', height: '32px' }} />
          <div className="skeleton-box" style={{ width: '30%', height: '32px' }} />
        </div>
      </div>

      {/* Hourly Forecast Skeleton */}
      <div className="skeleton-card hourly-card">
        <div className="skeleton-box" style={{ width: '130px', height: '18px', marginBottom: '12px' }} />
        <div className="skeleton-hourly-track">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="skeleton-hourly-item" />
          ))}
        </div>
      </div>

      {/* 7-Day Forecast Skeleton */}
      <div className="skeleton-card daily-card">
        <div className="skeleton-box" style={{ width: '120px', height: '18px', marginBottom: '14px' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[...Array(7)].map((_, i) => (
            <div key={i} className="skeleton-box" style={{ width: '100%', height: '36px' }} />
          ))}
        </div>
      </div>

      {/* Metrics Grid Skeleton */}
      <div className="metrics-grid">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="skeleton-card metric-card" style={{ height: '110px' }}>
            <div className="skeleton-box" style={{ width: '80px', height: '14px' }} />
            <div className="skeleton-box" style={{ width: '60px', height: '24px' }} />
            <div className="skeleton-box" style={{ width: '100%', height: '6px' }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkeletonLoader;
