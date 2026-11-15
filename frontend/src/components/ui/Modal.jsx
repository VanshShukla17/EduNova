import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import PaperCard from './PaperCard';
import Tape from './Tape';
import Button from './Button';

/**
 * Focus-trapped modal dialog rendered on a flat taped paper card.
 */
export default function Modal({
  open,
  onClose,
  title,
  tapeTone = 'yellow',
  maxWidth = '520px',
  footer,
  children,
}) {
  const cardRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const prevActive = document.activeElement;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose?.();
        return;
      }

      if (event.key === 'Tab' && cardRef.current) {
        const focusable = cardRef.current.querySelectorAll(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const focusTimer = setTimeout(() => {
      if (cardRef.current) {
        const firstInput = cardRef.current.querySelector(
          'button, input, select, textarea, a[href]'
        );
        firstInput?.focus();
      }
    }, 10);

    return () => {
      clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);
      if (prevActive && typeof prevActive.focus === 'function') {
        prevActive.focus();
      }
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal-scrim"
      role="dialog"
      aria-modal="true"
      aria-label={typeof title === 'string' ? title : 'Dialog'}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose?.();
        }
      }}
    >
      <div ref={cardRef} style={{ width: '100%', maxWidth }}>
        <PaperCard flat className="modal-card" style={{ maxWidth }}>
          <Tape tone={tapeTone} rotation="-1.5deg" />

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 'var(--sp-3)',
              marginBottom: 'var(--sp-4)',
            }}
          >
            {title ? (
              <h2 className="type-h3" style={{ color: 'var(--ink)' }}>
                {title}
              </h2>
            ) : (
              <span />
            )}

            {onClose ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                aria-label="Close dialog"
                style={{ minWidth: '44px', padding: '0 10px' }}
              >
                <X size={18} strokeWidth={2} aria-hidden="true" />
              </Button>
            ) : null}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)' }}>
            {children}
          </div>

          {footer ? (
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'flex-end',
                gap: 'var(--sp-3)',
                marginTop: 'var(--sp-5)',
                paddingTop: 'var(--sp-4)',
                borderTop: '1px solid var(--paper-border-warm)',
              }}
            >
              {footer}
            </div>
          ) : null}
        </PaperCard>
      </div>
    </div>
  );
}
