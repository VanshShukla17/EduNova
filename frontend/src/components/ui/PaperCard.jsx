import React from 'react';

const VARIANT_CLASSES = {
  plain: '',
  dots: 'paper--dots',
  ruled: 'paper--ruled',
  'ruled-margin': 'paper--ruled-margin',
  dark: 'paper--dark',
  locked: 'paper--locked',
};

/**
 * Canonical cream paper card primitive anchored to the green desk.
 */
export default function PaperCard({
  as: Component = 'div',
  variant = 'plain',
  hero = false,
  flat = false,
  interactive = false,
  tilt,
  className = '',
  style,
  children,
  ...props
}) {
  const classes = [
    'paper',
    VARIANT_CLASSES[variant] || '',
    hero ? 'paper--hero' : '',
    flat ? 'paper--flat' : '',
    interactive ? 'paper--interactive' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const mergedStyle = tilt !== undefined ? { '--tilt': tilt, ...style } : style;

  return (
    <Component className={classes} style={mergedStyle} {...props}>
      {children}
    </Component>
  );
}
