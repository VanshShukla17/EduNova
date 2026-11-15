import React from 'react';
import Tag from './Tag';

/**
 * Desk-level section heading separating taped/pinned paper groups.
 * Title sits in white ink directly on the desk surface.
 */
export default function SectionHeader({
  as: Heading = 'h2',
  tag,
  tagVariant = 'tape',
  title,
  note,
  action,
  className = '',
}) {
  return (
    <header className={['section-header', className].filter(Boolean).join(' ')}>
      <div className="section-header__left">
        {tag ? <Tag variant={tagVariant}>{tag}</Tag> : null}
        {title ? (
          <Heading className="type-h2 section-header__title">
            {title}
          </Heading>
        ) : null}
        {note ? <p className="section-header__note">{note}</p> : null}
      </div>
      {action ? <div>{action}</div> : null}
    </header>
  );
}
