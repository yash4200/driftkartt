import React from 'react';
import './SkeletonCard.css';

export default function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image"></div>
      <div className="skeleton-content">
        <div className="skeleton-title"></div>
        <div className="skeleton-meta"></div>
        <div className="skeleton-price-row">
          <div className="skeleton-price"></div>
          <div className="skeleton-badge"></div>
        </div>
        <div className="skeleton-btn"></div>
      </div>
    </div>
  );
}
