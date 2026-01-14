'use client';

import React from 'react';

interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
  className?: string;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onRatingChange,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleStarClick = (starRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(starRating);
    }
  };

  const renderStar = (starNumber: number) => {
    const isFilled = starNumber <= rating;
    const isHalfFilled = starNumber === Math.ceil(rating) && rating % 1 !== 0;
    
    return (
      <svg
        key={starNumber}
        className={`${sizeClasses[size]} ${
          interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''
        } ${
          isFilled || isHalfFilled ? 'text-yellow-400' : 'text-gray-300'
        } ${className}`}
        fill={isFilled ? 'currentColor' : isHalfFilled ? 'url(#half-star)' : 'none'}
        viewBox="0 0 24 24"
        stroke="currentColor"
        onClick={() => handleStarClick(starNumber)}
      >
        <defs>
          <linearGradient id="half-star" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
    );
  };

  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: maxRating }, (_, i) => renderStar(i + 1))}
      {interactive && (
        <span className="ml-2 text-sm text-gray-500">
          {rating.toFixed(1)} / {maxRating}
        </span>
      )}
    </div>
  );
}; 