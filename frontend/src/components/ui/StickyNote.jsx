import React from 'react';

const TONE_CLASSES = {
  yellow: '',
  blue: 'sticky--blue',
  green: 'sticky--green',
  pink: 'sticky--pink',
};

/**
 * Post-it sticky note for mentor hints, formulas, reminders, or short chats.
 */
export default function StickyNote({
  tone = 'yellow',
  body = false,
  rotation,
  className = '',
  style,
  children,
  ...props
}) {
  const classes = [
    'sticky',
    TONE_CLASSES[tone] || '',
    body ? 'sticky--body' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const mergedStyle = rotation !== undefined ? { '--note-rot': rotation, ...style } : style;

  return (
    <div className={classes} style={mergedStyle} {...props}>
      {children}
    </div>
  );
}
