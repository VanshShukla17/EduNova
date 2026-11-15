import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Bot, CheckCircle2 } from 'lucide-react';
import { PaperCard, Tag, Button } from '../../components/ui';
import { SUBJECT_PIN_COLORS } from '../../components/ui/subjectUtils';

/**
 * Shared Scrapbook workbench frame for all /learn/:subject/:module pages.
 * Keeps breadcrumb, Ask Chotu action, module header card, tab switcher,
 * learning objectives, and subject hub link consistent across all labs.
 */
export default function LearnLabShell({
  subject = 'physics',
  backTo = '/learn',
  backLabel = 'Back to Modules',
  hubTitle,
  hubSubtitle,
  badgeIcon: BadgeIcon,
  badgeLabel,
  subBadgeLabel,
  title,
  description,
  askLabel = 'Ask Chotu about this lab',
  onAskSaarthi,
  tabs = [],
  activeTab,
  onTabChange,
  objectives = [],
  children,
}) {
  const pinColor = SUBJECT_PIN_COLORS[subject] || 'teal';

  return (
    <div style={{ maxWidth: '940px', margin: '0 auto', paddingBottom: 'var(--sp-8)' }}>
      {/* Top breadcrumb + AI mentor link */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 'var(--sp-2)',
          marginBottom: 'var(--sp-4)',
        }}
      >
        <Button as={Link} to={backTo} variant="ghost" size="sm">
          <ArrowLeft size={16} /> {backLabel}
        </Button>

        {onAskSaarthi ? (
          <Button variant="secondary" size="sm" onClick={onAskSaarthi}>
            <Bot size={15} /> {askLabel}
          </Button>
        ) : null}
      </div>

      {/* Header PaperCard with pinned specimen aesthetic */}
      <PaperCard
        pinned
        pinColor={pinColor}
        tilt={0}
        style={{ marginBottom: 'var(--sp-5)' }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--sp-2)',
            flexWrap: 'wrap',
            marginBottom: 'var(--sp-2)',
          }}
        >
          {badgeLabel ? (
            <Tag variant="verified">
              {BadgeIcon ? <BadgeIcon size={12} aria-hidden="true" /> : null}
              {badgeLabel}
            </Tag>
          ) : null}
          {subBadgeLabel ? <Tag variant="paper">{subBadgeLabel}</Tag> : null}
        </div>

        <h1 className="type-h1" style={{ marginTop: 'var(--sp-1)', marginBottom: 'var(--sp-2)' }}>
          {title}
        </h1>

        <p className="type-body" style={{ color: 'var(--ink-muted)', margin: 0 }}>
          {description}
        </p>

        {tabs.length > 0 ? (
          <div
            role="tablist"
            aria-label={`${title} views`}
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 'var(--sp-2)',
              marginTop: 'var(--sp-4)',
              paddingTop: 'var(--sp-4)',
              borderTop: '1px dashed var(--paper-edge)',
            }}
          >
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <Button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  variant={isActive ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => onTabChange?.(tab.id)}
                >
                  {Icon ? <Icon size={14} /> : null}
                  {tab.label}
                </Button>
              );
            })}
          </div>
        ) : null}
      </PaperCard>

      {/* Active tab body */}
      <div style={{ marginBottom: 'var(--sp-5)' }}>{children}</div>

      {/* Learning objectives checklist */}
      {objectives.length > 0 ? (
        <PaperCard
          flat
          style={{ marginBottom: 'var(--sp-5)', background: 'var(--paper-warm)' }}
        >
          <h2
            className="type-h3"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--sp-2)',
              marginBottom: 'var(--sp-3)',
            }}
          >
            <CheckCircle2 size={18} style={{ color: 'var(--green-600)' }} />
            Learning Objectives
          </h2>
          <div className="paper-grid paper-grid--2">
            {objectives.map((obj, idx) => (
              <div
                key={idx}
                className="type-small"
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--sp-2)',
                  color: 'var(--ink)',
                }}
              >
                <span style={{ color: 'var(--green-600)', fontWeight: 700 }} aria-hidden="true">
                  ✓
                </span>
                <span>{obj}</span>
              </div>
            ))}
          </div>
        </PaperCard>
      ) : null}

      {/* Return to subject hub */}
      {hubTitle ? (
        <Link to={backTo} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
          <PaperCard interactive tilt="tilt-a">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--sp-3)' }}>
              <div>
                <div className="type-eyebrow" style={{ color: 'var(--green-600)' }}>
                  {subject.toUpperCase()} MODULES
                </div>
                <div className="type-h3" style={{ marginTop: '2px' }}>{hubTitle}</div>
                {hubSubtitle ? (
                  <div className="type-small" style={{ color: 'var(--ink-muted)' }}>{hubSubtitle}</div>
                ) : null}
              </div>
              <ArrowRight size={18} style={{ color: 'var(--ink-muted)', flexShrink: 0 }} />
            </div>
          </PaperCard>
        </Link>
      ) : null}
    </div>
  );
}
