import React from 'react';
import Button from './Button';

/**
 * Dashed cream empty notebook sheet for missing chapters, search hits, or empty logs.
 */
export default function EmptyState({
  icon: Icon,
  title = 'Nothing pinned here yet',
  description,
  actionLabel,
  to,
  onAction,
  className = '',
  children,
}) {
  return (
    <div className={['empty-page', className].filter(Boolean).join(' ')}>
      {Icon ? (
        <div
          style={{
            width: '52px',
            height: '52px',
            borderRadius: 'var(--r-pill)',
            background: 'var(--paper-warm)',
            border: '1px solid var(--paper-edge)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--ink-muted)',
          }}
        >
          <Icon size={24} strokeWidth={2} aria-hidden="true" />
        </div>
      ) : null}

      <h3 className="type-h3" style={{ color: 'var(--ink)' }}>
        {title}
      </h3>

      {description ? (
        <p className="type-body" style={{ color: 'var(--ink-muted)', maxWidth: '46ch' }}>
          {description}
        </p>
      ) : null}

      {children}

      {actionLabel && (to || onAction) ? (
        <div style={{ marginTop: 'var(--sp-2)' }}>
          <Button variant="primary" to={to} onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
