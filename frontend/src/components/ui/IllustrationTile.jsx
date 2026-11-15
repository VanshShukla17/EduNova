import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PaperCard from './PaperCard';
import Tape from './Tape';
import Tag from './Tag';
import Button from './Button';
import { resolveSubjectKey, SUBJECT_TAPE_TONES } from './subjectUtils';

/**
 * Interactive science lab / diagram card using a taped plain paper sheet and monochrome SVG illustration.
 */
export default function IllustrationTile({
  subject,
  subjectLabel,
  title,
  subtitle,
  description,
  badge,
  illustration,
  actionLabel = 'Launch',
  to,
  onClick,
  className = '',
}) {
  const subjectKey = resolveSubjectKey(subject);
  const tapeTone = SUBJECT_TAPE_TONES[subjectKey] || 'yellow';

  return (
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
      <Tape tone={tapeTone} rotation="-1.5deg" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--sp-2)', flexWrap: 'wrap' }}>
          {subjectLabel || subject ? (
            <Tag variant={subjectKey}>{subjectLabel || subject}</Tag>
          ) : null}
          {badge}
        </div>

        {illustration ? (
          <div
            style={{
              background: 'var(--paper-warm)',
              border: '1px solid var(--paper-border-warm)',
              borderRadius: 'var(--r-md)',
              padding: 'var(--sp-4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '132px',
              margin: 'var(--sp-1) 0',
              color: 'var(--ink)',
            }}
          >
            {illustration}
          </div>
        ) : null}

        <h3 className="type-h3" style={{ color: 'var(--ink)' }}>
          {title}
        </h3>

        {subtitle ? (
          <p className="type-hand" style={{ color: 'var(--hand-rust)' }}>
            {subtitle}
          </p>
        ) : null}

        {description ? (
          <p className="type-small" style={{ color: 'var(--ink-muted)' }}>
            {description}
          </p>
        ) : null}
      </div>

      {to || onClick ? (
        <div style={{ marginTop: 'auto', paddingTop: 'var(--sp-2)' }}>
          {to ? (
            <Button variant="primary" size="sm" fullWidth as={Link} to={to}>
              {actionLabel}
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </Button>
          ) : (
            <Button variant="primary" size="sm" fullWidth onClick={onClick}>
              {actionLabel}
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </Button>
          )}
        </div>
      ) : null}
    </PaperCard>
  );
}
