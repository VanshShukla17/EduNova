import React from 'react';
import { Link } from 'react-router-dom';
import PaperCard from './PaperCard';
import Pin from './Pin';
import Tag from './Tag';
import Stamp from './Stamp';
import ProgressBar from './ProgressBar';
import { resolveSubjectKey, SUBJECT_PIN_COLORS } from './subjectUtils';

/**
 * Chapter notebook card with pinned accent, monospace code, mastery stamp, and progress track.
 */
export default function ChapterCard({
  code,
  subject,
  subjectLabel,
  title,
  description,
  progress = 0,
  meta,
  mastered = false,
  isNew = false,
  to,
  onClick,
  pinColor,
  action,
  className = '',
  children,
}) {
  const subjectKey = resolveSubjectKey(subject);
  const resolvedPin = pinColor || SUBJECT_PIN_COLORS[subjectKey] || 'red';

  const cardInner = (
    <PaperCard
      as="article"
      interactive={Boolean(to || onClick)}
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
      <Pin color={resolvedPin} position="left" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--sp-2)',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
            {code ? (
              <span className="type-label" style={{ color: 'var(--ink-soft)' }}>
                {code}
              </span>
            ) : null}
            {subjectLabel || subject ? (
              <Tag variant={subjectKey}>{subjectLabel || subject}</Tag>
            ) : null}
          </div>

          {mastered ? <Stamp variant="mastered">MASTERED</Stamp> : null}
          {!mastered && isNew ? <Stamp variant="new">NEW</Stamp> : null}
        </div>

        <h3 className="type-h3" style={{ color: 'var(--ink)', marginTop: 'var(--sp-1)' }}>
          {title}
        </h3>

        {description ? (
          <p className="type-small" style={{ color: 'var(--ink-muted)' }}>
            {description}
          </p>
        ) : null}

        {children}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)', marginTop: 'auto' }}>
        <ProgressBar value={progress} subject={subjectKey} label={meta} showPercent />
        {action ? <div>{action}</div> : null}
      </div>
    </PaperCard>
  );

  if (to) {
    return (
      <Link to={to} style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
        {cardInner}
      </Link>
    );
  }

  if (onClick) {
    return (
      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick(e);
          }
        }}
        style={{ cursor: 'pointer', height: '100%' }}
      >
        {cardInner}
      </div>
    );
  }

  return cardInner;
}
