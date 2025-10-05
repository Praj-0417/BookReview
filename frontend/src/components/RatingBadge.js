import React from 'react';

const RatingBadge = ({ rating = 0 }) => {
  const value = Number.isFinite(rating) ? rating : 0;
  return (
    <span className="inline-flex items-center rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
      ⭐ {value.toFixed(1)}
    </span>
  );
};

export default RatingBadge;
