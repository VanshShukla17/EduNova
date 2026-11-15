import React, { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { playPixelSound } from '../../utils/pixelSound';

const VARIANT_CLASSES = {
  primary: 'pixel-btn--primary',
  emerald: 'pixel-btn--primary',
  kraft: 'pixel-btn--kraft',
  note: 'pixel-btn--note',
  secondary: 'pixel-btn--note',
  dark: 'pixel-btn--dark',
  ghost: 'pixel-btn--ghost',
  danger: 'pixel-btn--danger',
  cream: 'pixel-btn--cream',
  glass: 'pixel-btn--glass',
  amber: 'pixel-btn--amber',
  blue: 'pixel-btn--blue',
  purple: 'pixel-btn--purple',
};

const SIZE_CLASSES = {
  sm: 'pixel-btn--sm',
  md: 'pixel-btn--md',
  lg: 'pixel-btn--lg',
};

/**
 * Reusable retro 16-bit pixel-art button with stepped polygon borders,
 * bright mint top bevel, dark extruded 3D bottom lip, and physical press feel.
 * Built strictly with React and CSS layers (no images or SVGs).
 */
export default function PixelButton({
  label,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  to,
  href,
  as,
  type = 'button',
  onClick,
  className = '',
  children,
  onPointerDown,
  onPointerUp,
  onPointerLeave,
  onPointerCancel,
  onKeyDown,
  onKeyUp,
  ...props
}) {
  const [isPressed, setIsPressed] = useState(false);

  const handlePointerDown = useCallback(
    (e) => {
      if (!disabled) setIsPressed(true);
      onPointerDown?.(e);
    },
    [disabled, onPointerDown]
  );

  const handlePointerRelease = useCallback(
    (e) => {
      setIsPressed(false);
      onPointerUp?.(e);
    },
    [onPointerUp]
  );

  const handlePointerLeave = useCallback(
    (e) => {
      setIsPressed(false);
      onPointerLeave?.(e);
    },
    [onPointerLeave]
  );

  const handlePointerCancel = useCallback(
    (e) => {
      setIsPressed(false);
      onPointerCancel?.(e);
    },
    [onPointerCancel]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
        setIsPressed(true);
      }
      onKeyDown?.(e);
    },
    [disabled, onKeyDown]
  );

  const handleKeyUp = useCallback(
    (e) => {
      setIsPressed(false);
      onKeyUp?.(e);
    },
    [onKeyUp]
  );

  const handleClick = useCallback(
    (e) => {
      if (disabled) {
        e.preventDefault();
        return;
      }
      playPixelSound(e);
      onClick?.(e);
    },
    [disabled, onClick]
  );

  const classes = [
    'pixel-btn',
    VARIANT_CLASSES[variant] || VARIANT_CLASSES.primary,
    SIZE_CLASSES[size] || SIZE_CLASSES.md,
    fullWidth ? 'pixel-btn--full' : '',
    isPressed && !disabled ? 'is-pressed' : '',
    disabled ? 'is-disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const content = children ?? label ?? 'Open Hub';

  const innerLayers = (
    <>
      <span className="pixel-btn__shadow" aria-hidden="true" />
      <span className="pixel-btn__extrude" aria-hidden="true" />
      <span className="pixel-btn__surface">
        <span className="pixel-btn__highlight" aria-hidden="true" />
        <span className="pixel-btn__shimmer" aria-hidden="true" />
        <span className="pixel-btn__pixels" aria-hidden="true" />
        <span className="pixel-btn__label">{content}</span>
      </span>
    </>
  );

  const sharedEvents = {
    className: classes,
    onPointerDown: handlePointerDown,
    onPointerUp: handlePointerRelease,
    onPointerLeave: handlePointerLeave,
    onPointerCancel: handlePointerCancel,
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp,
    onClick: handleClick,
  };

  if (to && !disabled) {
    return (
      <Link to={to} {...sharedEvents} {...props}>
        {innerLayers}
      </Link>
    );
  }

  if ((href || as === 'a') && !disabled) {
    return (
      <a href={href} {...sharedEvents} {...props}>
        {innerLayers}
      </a>
    );
  }

  const Component = as && !disabled ? as : 'button';

  return (
    <Component
      type={Component === 'button' ? type : undefined}
      disabled={Component === 'button' ? disabled : undefined}
      aria-disabled={disabled ? 'true' : undefined}
      {...sharedEvents}
      {...props}
    >
      {innerLayers}
    </Component>
  );
}
