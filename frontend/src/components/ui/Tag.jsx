import React from 'react';

const VARIANT_CLASSES = {
  paper: 'tag--paper',
  tape: 'tag--tape',
  ready: 'tag--ready',
  verified: 'tag--verified',
  maths: 'tag--maths',
  physics: 'tag--physics',
  chemistry: 'tag--chemistry',
  biology: 'tag--biology',
};

/**
 * Pill or tape tag primitive supporting subject accents and readiness states.
 */
export default function Tag({
  variant = 'paper',
  dot = false,
  className = '',
  children,
  ...props
}) {
  const classes = ['tag', VARIANT_CLASSES[variant] || 'tag--paper', className]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={classes} {...props}>
      {dot || variant === 'ready' ? <span className="tag--ready-dot" aria-hidden="true" /> : null}
      {children}
    </span>
  );
}
