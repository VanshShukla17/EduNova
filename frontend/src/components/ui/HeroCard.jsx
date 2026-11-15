import React from 'react';
import PaperCard from './PaperCard';
import Tape from './Tape';
import Pin from './Pin';
import Tag from './Tag';
import ProgressBar from './ProgressBar';

/**
 * Primary opening notebook sheet pinned and taped on top of a page.
 */
export default function HeroCard({
  eyebrow,
  eyebrowVariant = 'paper',
  title,
  subtitle,
  description,
  progress,
  progressLabel,
  subject,
  actions,
  illustration,
  badges,
  pinColor = 'red',
  tapeTone = 'kraft',
  variant = 'dots',
  flat = false,
  className = '',
  children,
}) {
  return (
    <PaperCard
      as="section"
      hero
      variant={variant}
      flat={flat}
      className={['hero-card', className].filter(Boolean).join(' ')}
      style={{
        padding: 'var(--sp-6)',
        marginBottom: 'var(--sp-6)',
      }}
    >
      <Tape tone={tapeTone} rotation="-2deg" />
      <Pin color={pinColor} position="right" />

      <div
        className={illustration ? 'hero-card__grid' : ''}
        style={
          illustration
            ? {
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1.35fr) minmax(240px, 1fr)',
                gap: 'var(--sp-5)',
                alignItems: 'center',
              }
            : undefined
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
          {eyebrow || badges ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--sp-2)' }}>
              {eyebrow ? <Tag variant={eyebrowVariant}>{eyebrow}</Tag> : null}
              {badges}
            </div>
          ) : null}

          {title ? (
            <h1 className="type-h1" style={{ color: 'var(--ink)' }}>
              {title}
            </h1>
          ) : null}

          {subtitle ? (
            <p className="type-hand" style={{ color: 'var(--hand-rust)', fontSize: '1.5rem' }}>
              {subtitle}
            </p>
          ) : null}

          {description ? (
            <p className="type-body" style={{ color: 'var(--ink-muted)', maxWidth: '58ch' }}>
              {description}
            </p>
          ) : null}

          {typeof progress === 'number' ? (
            <div style={{ maxWidth: '420px', marginTop: 'var(--sp-1)' }}>
              <ProgressBar
                value={progress}
                subject={subject}
                label={progressLabel}
                showPercent
              />
            </div>
          ) : null}

          {children}

          {actions ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-3)', marginTop: 'var(--sp-2)' }}>
              {actions}
            </div>
          ) : null}
        </div>

        {illustration ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {illustration}
          </div>
        ) : null}
      </div>
    </PaperCard>
  );
}
