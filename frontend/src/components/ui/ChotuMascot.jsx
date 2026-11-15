import React from 'react';

/**
 * Chotu AI mentor mascot drawn strictly with EVidya CSS design tokens.
 */
export default function ChotuMascot({ size = 40, label = 'Chotu Mentor' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      role="img"
      aria-label={label}
    >
      <circle cx="32" cy="34" r="24" fill="var(--desk-700)" stroke="var(--paper-edge)" strokeWidth="2.5" />
      <path d="M16 20 L22 10 L27 20 Z" fill="var(--amber-400)" stroke="var(--ink)" strokeWidth="1.5" />
      <path d="M48 20 L42 10 L37 20 Z" fill="var(--amber-400)" stroke="var(--ink)" strokeWidth="1.5" />
      <circle cx="24" cy="33" r="8" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2" />
      <circle cx="40" cy="33" r="8" fill="var(--paper)" stroke="var(--ink)" strokeWidth="2" />
      <line x1="31" y1="33" x2="33" y2="33" stroke="var(--ink)" strokeWidth="2" />
      <circle cx="25" cy="33" r="3" fill="var(--ink)" />
      <circle cx="41" cy="33" r="3" fill="var(--ink)" />
      <path d="M29 41 L32 45 L35 41 Z" fill="var(--amber-400)" stroke="var(--ink)" strokeWidth="1.5" />
      <path d="M22 50 C27 54 37 54 42 50" stroke="var(--emerald-300)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
