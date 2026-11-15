import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Pin from '../ui/Pin';
import Tag from '../ui/Tag';
import Stamp from '../ui/Stamp';
import ProgressBar from '../ui/ProgressBar';
import { resolveSubjectKey, SUBJECT_PIN_COLORS } from '../ui/subjectUtils';

/**
 * Interactive two-zone cream-paper notebook card with 3D pixel pushpin,
 * pointer-responsive micro-tilt, stamp, progress bar, and live procedural pixel-art canvas.
 */
export default function NotebookCard({
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
  tilt,
  SceneComponent,
  className = '',
  children,
}) {
  const subjectKey = resolveSubjectKey(subject);
  const resolvedPin = pinColor || SUBJECT_PIN_COLORS[subjectKey] || 'blue';

  const cardRef = useRef(null);
  const tooltipTimerRef = useRef(null);

  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [tooltip, setTooltip] = useState('');

  useEffect(() => {
    return () => {
      if (tooltipTimerRef.current) {
        clearTimeout(tooltipTimerRef.current);
      }
    };
  }, []);

  const handleTooltipChange = useCallback((message) => {
    setTooltip(message);
    if (tooltipTimerRef.current) {
      clearTimeout(tooltipTimerRef.current);
    }
    tooltipTimerRef.current = setTimeout(() => {
      setTooltip('');
    }, 2800);
  }, []);

  const handlePointerMove = useCallback((e) => {
    const el = cardRef.current;
    if (!el || e.pointerType === 'touch') return;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty('--card-rx', `${(-ny * 2.2).toFixed(2)}deg`);
    el.style.setProperty('--card-ry', `${(nx * 2.2).toFixed(2)}deg`);
  }, []);

  const handlePointerEnter = useCallback(() => {
    setIsCardHovered(true);
  }, []);

  const handlePointerLeave = useCallback(() => {
    setIsCardHovered(false);
    setIsPressed(false);
    const el = cardRef.current;
    if (el) {
      el.style.setProperty('--card-rx', '0deg');
      el.style.setProperty('--card-ry', '0deg');
    }
  }, []);

  const handlePointerDown = useCallback(() => {
    setIsPressed(true);
  }, []);

  const handlePointerUp = useCallback(() => {
    setIsPressed(false);
  }, []);

  const cardClasses = [
    'notebook-card',
    `notebook-card--${subjectKey}`,
    isPressed ? 'is-pressed' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const cardStyle = tilt !== undefined ? { '--tilt': tilt } : undefined;

  const cardContent = (
    <article
      ref={cardRef}
      className={cardClasses}
      style={cardStyle}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <Pin pixel color={resolvedPin} position="left" />

      {mastered ? (
        <Stamp variant="mastered" className="notebook-card__stamp">
          MASTERED
        </Stamp>
      ) : isNew ? (
        <Stamp variant="new" className="notebook-card__stamp">
          NEW
        </Stamp>
      ) : null}

      <div className="notebook-card__main">
        {/* Left side: Notebook metadata, badge, heading, sync status */}
        <div className="notebook-card__info">
          <div className="notebook-card__top">
            {code ? <span className="notebook-card__code">{code}</span> : null}
            {subjectLabel || subject ? (
              <Tag variant={subjectKey} className="notebook-card__badge">
                {subjectLabel || subject}
              </Tag>
            ) : null}
          </div>

          <h3 className="notebook-card__title">{title}</h3>

          {description ? <p className="notebook-card__desc">{description}</p> : null}

          {children}
        </div>

        {/* Right side: Procedural animated pixel-art laboratory */}
        <div className="notebook-card__scene-wrap">
          {tooltip ? (
            <div className="notebook-card__tooltip" role="status" aria-live="polite">
              {tooltip}
            </div>
          ) : null}

          {SceneComponent ? (
            <SceneComponent
              isCardHovered={isCardHovered}
              onTooltipChange={handleTooltipChange}
            />
          ) : null}
        </div>
      </div>

      {/* Bottom full-width chapter count, percentage, and progress bar */}
      <div className="notebook-card__footer">
        <ProgressBar value={progress} subject={subjectKey} label={meta} showPercent />
        {action ? <div style={{ marginTop: 'var(--sp-2)' }}>{action}</div> : null}
      </div>
    </article>
  );

  if (to) {
    return (
      <Link to={to} className="notebook-card-link">
        {cardContent}
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
        className="notebook-card-link"
      >
        {cardContent}
      </div>
    );
  }

  return cardContent;
}
