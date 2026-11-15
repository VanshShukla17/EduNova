import React from 'react';

/**
 * Matte-plastic or 3D pixel-art pushpin marker anchored onto a paper card.
 */
export default function Pin({
  color = 'red',
  position = 'left',
  pixel = false,
  className = '',
  style,
}) {
  const classes = [
    'pin',
    `pin--${color}`,
    `pin--${position}`,
    pixel ? 'pin--pixel' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <span className={classes} style={style} aria-hidden="true" />;
}
