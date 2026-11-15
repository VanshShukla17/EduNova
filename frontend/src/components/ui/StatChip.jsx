import React from 'react';

const VARIANT_CLASSES = {
  default: 'stat-chip',
  streak: 'stat-chip stat-chip--streak',
  level: 'level-chip',
};

/**
 * Compact stat pill used on hero sheets and dashboard summary bars.
 */
export default function StatChip({ variant = 'default', icon: Icon, className = '', children, ...props }) {
  const classes = [VARIANT_CLASSES[variant] || 'stat-chip', className].filter(Boolean).join(' ');
  return (
    <span className={classes} {...props}>
      {Icon ? <Icon size={15} strokeWidth={2} aria-hidden="true" /> : null}
      {children}
    </span>
  );
}
