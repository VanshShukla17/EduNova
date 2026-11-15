import React from 'react';
import { resolveSubjectKey } from './subjectUtils';

/**
 * Horizontal progress track filled with subject ink or emerald-amber gradient.
 */
export default function ProgressBar({
  value = 0,
  subject,
  tone,
  label,
  showPercent = false,
  className = '',
}) {
  const clamped = Math.max(0, Math.min(100, Number(value) || 0));
  const fillTone = tone || (subject ? resolveSubjectKey(subject) : '');
  const fillClass = fillTone ? `progress-bar-fill progress-bar-fill--${fillTone}` : 'progress-bar-fill';

  return (
    <div className={className} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-1)' }}>
      {label || showPercent ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 'var(--sp-2)',
          }}
        >
          {label ? <span className="type-small" style={{ color: 'var(--ink-muted)' }}>{label}</span> : <span />}
          {showPercent ? (
            <span className="type-label" style={{ color: 'var(--ink)' }}>
              {Math.round(clamped)}%
            </span>
          ) : null}
        </div>
      ) : null}
      <div
        className="progress-bar-bg"
        role="progressbar"
        aria-valuenow={Math.round(clamped)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label || 'Progress'}
      >
        <div className={fillClass} style={{ width: `${clamped}%` }} />
      </div>
    </div>
  );
}
