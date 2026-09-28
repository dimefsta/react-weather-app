import React from 'react';

function SkeletonLoader() {
  return (
    <div className="skeleton-dashboard" aria-busy="true" aria-label="Loading forecast data">
      {/* Hero Card Skeleton */}
      <div className="skeleton-card skeleton-hero">
        <div className="skeleton-row space-between">
          <div className="skeleton-box" style={{ width: '180px', height: '32px' }} />
          <div className="skeleton-box" style={{ width: '120px', height: '24px' }} />
        </div>
        <div className="skeleton-row" style={{ marginTop: '24px' }}>
          <div className="skeleton-box" style={{ width: '140px', height: '72px' }} />
          <div className="skeleton-circle" style={{ width: '80px', height: '80px', marginLeft: 'auto' }} />
        </div>
        <div className="skeleton-row" style={{ marginTop: '20px' }}>
          <div className="skeleton-box" style={{ width: '220px', height: '20px' }} />
        </div>
        <div className="skeleton-footer-row" style={{ marginTop: '24px' }}>
          <div className="skeleton-box" style={{ width: '30%', height: '36px' }} />
          <div className="skeleton-box" style={{ width: '30%', height: '36px' }} />
          <div className="skeleton-box" style={{ width: '30%', height: '36px' }} />
        </div>
      </div>

      {/* Hourly Forecast Skeleton */}
      <div className="skeleton-card" style={{ height: '160px' }}>
        <div className="skeleton-box" style={{ width: '160px', height: '22px', marginBottom: '16px' }} />
        <div className="skeleton-hourly-track">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="skeleton-hourly-item" />
          ))}
        </div>
      </div>

      {/* Metrics Grid Skeleton */}
      <div className="skeleton-grid">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="skeleton-card" style={{ height: '140px' }}>
            <div className="skeleton-box" style={{ width: '110px', height: '18px', marginBottom: '12px' }} />
            <div className="skeleton-box" style={{ width: '70px', height: '32px', marginBottom: '12px' }} />
            <div className="skeleton-box" style={{ width: '100%', height: '8px' }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkeletonLoader;
