import React from 'react';

const TONE_CLASSES = {
  yellow: '',
  green: 'tape--green',
  kraft: 'tape--kraft',
};

/**
 * Washi tape strip for anchoring paper sheets.
 */
export default function Tape({ tone = 'yellow', rotation, className = '', style }) {
  const classes = ['tape', TONE_CLASSES[tone] || '', className].filter(Boolean).join(' ');
  const mergedStyle = rotation !== undefined ? { '--tape-rot': rotation, ...style } : style;
  return <span className={classes} style={mergedStyle} aria-hidden="true" />;
}
