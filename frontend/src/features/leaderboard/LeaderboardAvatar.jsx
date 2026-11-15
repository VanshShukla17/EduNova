import React from 'react';

const PALETTES = {
  mint: {
    hair: '#10b981',
    face: '#fed7aa',
    visor: '#047857',
    body: '#059669',
    accent: '#34d399',
  },
  gold: {
    hair: '#f59e0b',
    face: '#fef3c7',
    visor: '#b45309',
    body: '#d97706',
    accent: '#fbbf24',
  },
  purple: {
    hair: '#8b5cf6',
    face: '#ede9fe',
    visor: '#6d28d9',
    body: '#7c3aed',
    accent: '#c4b5fd',
  },
  teal: {
    hair: '#06b6d4',
    face: '#cffafe',
    visor: '#0e7490',
    body: '#0891b2',
    accent: '#22d3ee',
  },
  rose: {
    hair: '#f43f5e',
    face: '#ffe4e6',
    visor: '#be123c',
    body: '#e11d48',
    accent: '#fb7185',
  },
  blue: {
    hair: '#3b82f6',
    face: '#dbeafe',
    visor: '#1d4ed8',
    body: '#2563eb',
    accent: '#60a5fa',
  },
  amber: {
    hair: '#ea580c',
    face: '#ffedd5',
    visor: '#c2410c',
    body: '#f97316',
    accent: '#fdba74',
  },
};

export default function LeaderboardAvatar({ palette = 'mint', size = 36, isCurrentUser = false }) {
  const p = PALETTES[palette] || PALETTES.mint;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      shapeRendering="crispEdges"
      aria-hidden="true"
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        borderRadius: '6px',
        boxShadow: isCurrentUser ? '0 0 8px rgba(45, 212, 191, 0.6)' : 'none',
      }}
    >
      {/* Background Frame */}
      <rect width="16" height="16" fill="#0b171f" rx="3" />

      {/* Hair Top */}
      <rect x="4" y="2" width="8" height="2" fill={p.hair} />
      <rect x="3" y="3" width="2" height="4" fill={p.hair} />
      <rect x="11" y="3" width="2" height="4" fill={p.hair} />

      {/* Face */}
      <rect x="5" y="4" width="6" height="6" fill={p.face} />

      {/* Eyes / Visor */}
      <rect x="5" y="6" width="2" height="2" fill={p.visor} />
      <rect x="9" y="6" width="2" height="2" fill={p.visor} />
      <rect x="6" y="6" width="1" height="1" fill="#ffffff" />
      <rect x="10" y="6" width="1" height="1" fill="#ffffff" />

      {/* Smile */}
      <rect x="7" y="9" width="2" height="1" fill={p.visor} />

      {/* Body / Shoulders */}
      <rect x="3" y="11" width="10" height="4" fill={p.body} />
      <rect x="6" y="11" width="4" height="4" fill={p.accent} />
    </svg>
  );
}
