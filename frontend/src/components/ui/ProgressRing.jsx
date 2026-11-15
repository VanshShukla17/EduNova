import React from 'react';

const SUBJECT_STROKE_VARS = {
  maths: 'var(--maths)',
  physics: 'var(--physics)',
  chemistry: 'var(--chemistry)',
  biology: 'var(--biology)',
  emerald: 'var(--emerald-500)',
  amber: 'var(--amber-400)',
};

/**
 * Compact SVG progress ring for dashboard metrics and chapter mastery.
 */
export default function ProgressRing({
  value = 0,
  size = 64,
  strokeWidth = 6,
  tone = 'emerald',
  label,
  inverse = false,
}) {
  const clamped = Math.max(0, Math.min(100, Number(value) || 0));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (clamped / 100) * circumference;
  const stroke = SUBJECT_STROKE_VARS[tone] || 'var(--emerald-500)';

  return (
    <div
      style={{
        position: 'relative',
        width: `${size}px`,
        height: `${size}px`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
      role="img"
      aria-label={label ? `${label}: ${Math.round(clamped)}%` : `${Math.round(clamped)}%`}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ rotate: '-90deg' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={inverse ? 'var(--grid-major)' : 'var(--track)'}
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <span
        className="type-label"
        style={{
          position: 'absolute',
          color: inverse ? 'var(--on-desk)' : 'var(--ink)',
        }}
      >
        {Math.round(clamped)}%
      </span>
    </div>
  );
}
