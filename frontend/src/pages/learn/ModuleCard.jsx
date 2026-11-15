import React from 'react';
import { Play, Layers } from 'lucide-react';
import {
  PaperCard,
  Pin,
  Tag,
  Button,
  resolveSubjectKey,
  SUBJECT_PIN_COLORS,
} from '../../components/ui';

/**
 * Reusable interactive STEM lab card rendered on a pinned cream notebook sheet.
 */
export default function ModuleCard({ module }) {
  const subjectKey = resolveSubjectKey(module.subject || module.subjectLabel);
  const pinColor = SUBJECT_PIN_COLORS[subjectKey] || 'blue';

  return (
    <PaperCard
      as="article"
      interactive
      style={{
        padding: 'var(--sp-5)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 'var(--sp-3)',
        height: '100%',
      }}
    >
      <Pin color={pinColor} position="left" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 'var(--sp-2)',
            flexWrap: 'wrap',
          }}
        >
          <Tag variant={subjectKey}>
            {module.subjectLabel} · {module.grade}
          </Tag>
          <Tag variant="verified">{module.type}</Tag>
        </div>

        <h3 className="type-h3" style={{ color: 'var(--ink)', marginTop: 'var(--sp-1)' }}>
          {module.title}
        </h3>

        <p className="type-small" style={{ color: 'var(--ink-muted)' }}>
          {module.description}
        </p>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--sp-2)',
          paddingTop: 'var(--sp-3)',
          borderTop: '1px solid var(--paper-border-warm)',
          marginTop: 'auto',
        }}
      >
        <span
          className="type-label"
          style={{
            color: 'var(--ink-soft)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Layers size={14} strokeWidth={2} aria-hidden="true" />
          Interactive Lab
        </span>

        <Button variant="primary" size="sm" to={module.route}>
          <Play size={14} strokeWidth={2} aria-hidden="true" />
          {module.type === '3D Lab' ? 'Launch 3D' : 'Launch Lab'}
        </Button>
      </div>
    </PaperCard>
  );
}
