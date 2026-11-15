import React from 'react';
import PixelButton from './PixelButton';

/**
 * Physical-press pixel-art button primitive compliant with DESIGN.md Section 6.1.
 * Routes all EVidya button variants through the unified 2D stepped PixelButton system.
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  to,
  href,
  as,
  type = 'button',
  className = '',
  children,
  ...props
}) {
  const resolvedVariant = variant === 'pixel' ? 'primary' : variant;

  return (
    <PixelButton
      variant={resolvedVariant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      to={to}
      href={href}
      as={as}
      type={type}
      className={className}
      {...props}
    >
      {children}
    </PixelButton>
  );
}
