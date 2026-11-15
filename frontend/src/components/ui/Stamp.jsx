import React from 'react';

const VARIANT_CLASSES = {
  mastered: '',
  new: 'stamp--new',
  locked: 'stamp--locked',
  unlocked: 'stamp--unlocked',
};

/**
 * Ink stamp indicator for completion, mastery, new items, or lock states.
 */
export default function Stamp({
  variant = 'mastered',
  animate = false,
  className = '',
  children,
  ...props
}) {
  const classes = [
    'stamp',
    VARIANT_CLASSES[variant] || '',
    animate ? 'stamp--animate' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
}
