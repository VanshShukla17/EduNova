import React from 'react';
import { Lock } from 'lucide-react';
import PaperCard from './PaperCard';
import Pin from './Pin';
import Stamp from './Stamp';
import Button from './Button';

/**
 * Dark slate locked-chapter state with grey pushpin and double-dashed stamp.
 */
export default function LockedChapterCard({
  code,
  title,
  reason = 'Complete the prerequisite chapter to unlock this unit.',
  unlockLabel,
  to,
  onClick,
  className = '',
}) {
  return (
    <PaperCard
      as="article"
      variant="locked"
      className={className}
      style={{
        padding: 'var(--sp-5)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 'var(--sp-3)',
        height: '100%',
      }}
    >
      <Pin color="grey" position="left" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--sp-2)',
          }}
        >
          <span className="type-label" style={{ color: 'var(--locked-ink)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Lock size={14} strokeWidth={2} aria-hidden="true" />
            {code || 'LOCKED'}
          </span>
          <Stamp variant="locked">LOCKED</Stamp>
        </div>

        <h3 className="type-h3" style={{ color: 'var(--on-desk)' }}>
          {title}
        </h3>

        <p className="type-small" style={{ color: 'var(--locked-ink)' }}>
          {reason}
        </p>
      </div>

      {unlockLabel && (to || onClick) ? (
        <div style={{ marginTop: 'auto' }}>
          <Button variant="dark" size="sm" to={to} onClick={onClick}>
            {unlockLabel}
          </Button>
        </div>
      ) : null}
    </PaperCard>
  );
}
