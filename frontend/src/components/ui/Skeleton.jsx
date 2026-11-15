import React from 'react';
import PaperCard from './PaperCard';

/**
 * Cream loading skeleton primitives that respect reduced-motion rules.
 */
export function SkeletonBlock({ width = '100%', height = '18px', className = '', style }) {
  return (
    <div
      className={['skeleton', className].filter(Boolean).join(' ')}
      style={{ width, height, ...style }}
      aria-hidden="true"
    />
  );
}

export default function Skeleton({ lines = 3, card = true, className = '' }) {
  const inner = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }} aria-busy="true" aria-label="Loading">
      <SkeletonBlock width="42%" height="14px" />
      <SkeletonBlock width="78%" height="24px" />
      {Array.from({ length: lines }, (_, idx) => (
        <SkeletonBlock
          key={idx}
          width={idx === lines - 1 ? '64%' : '100%'}
          height="14px"
        />
      ))}
    </div>
  );

  if (!card) return inner;

  return (
    <PaperCard flat className={className} style={{ padding: 'var(--sp-5)' }}>
      {inner}
    </PaperCard>
  );
}
