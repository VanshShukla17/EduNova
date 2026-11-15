import React from 'react';

/**
 * Matte-plastic pushpin marker anchored onto a paper card.
 */
export default function Pin({
  color = 'red',
  position = 'left',
  className = '',
  style,
}) {
  const classes = [
    'pin',
    `pin--${color}`,
    `pin--${position}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <span className={classes} style={style} aria-hidden="true" />;
}
