import React from 'react';

import { genres }
from '../data/badgeGenre';

const BadgeGenre = ({
  genreId,
  size = 'md',
  className = '',
}) => {

  const genre =
    genres.find(
      (g) =>
        g.id === genreId
    );

  if (!genre)
    return null;

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (

    <span
      style={{
        backgroundColor:
          genre.color,

        color:
          genre.textColor,
      }}

      className={`
        inline-flex items-center
        rounded-full font-medium
        ${sizes[size]}
        ${className}
      `}
    >

      {genre.name}

    </span>
  );
};

export default BadgeGenre;