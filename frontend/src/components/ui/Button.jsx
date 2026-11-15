import React from 'react';
import { Link } from 'react-router-dom';

const VARIANT_CLASSES = {
  primary: 'btn--primary',
  kraft: 'btn--kraft',
  note: 'btn--note',
  dark: 'btn--dark',
  ghost: 'btn--ghost',
  danger: 'btn--danger',
  cream: 'btn--cream',
  glass: 'btn--glass',
};

/**
 * Physical-press button primitive compliant with DESIGN.md Section 6.1.
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  to,
  href,
  as,
  type = 'button',
  className = '',
  children,
  ...props
}) {
  const classes = [
    'btn',
    VARIANT_CLASSES[variant] || 'btn--primary',
    size === 'sm' ? 'btn--sm' : '',
    fullWidth ? 'btn--full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  if (href || as === 'a') {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  const Component = as || 'button';
  return (
    <Component type={Component === 'button' ? type : undefined} className={classes} {...props}>
      {children}
    </Component>
  );
}
