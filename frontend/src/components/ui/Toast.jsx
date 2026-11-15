import React, { createContext, useCallback, useContext, useState } from 'react';
import { X, AlertCircle, CheckCircle2, Info } from 'lucide-react';
import Pin from './Pin';
import StickyNote from './StickyNote';

const ToastContext = createContext(null);

const TONE_MAP = {
  success: 'green',
  error: 'pink',
  info: 'yellow',
  warning: 'yellow',
};

const PIN_MAP = {
  success: 'green',
  error: 'red',
  info: 'blue',
  warning: 'amber',
};

function ToastIcon({ type }) {
  if (type === 'error') return <AlertCircle size={18} strokeWidth={2} aria-hidden="true" />;
  if (type === 'success') return <CheckCircle2 size={18} strokeWidth={2} aria-hidden="true" />;
  return <Info size={18} strokeWidth={2} aria-hidden="true" />;
}

/**
 * Sticky-note notification provider anchored bottom-left above mobile navigation.
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const showToast = useCallback(
    (message, type = 'info') => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev.slice(-3), { id, message, type }]);
      if (type !== 'error') {
        setTimeout(() => dismiss(id), 5000);
      }
      return id;
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ showToast, dismiss }}>
      {children}
      <div className="toast-wrap" role="status" aria-live="polite">
        {toasts.map((toast) => (
          <StickyNote
            key={toast.id}
            tone={TONE_MAP[toast.type] || 'yellow'}
            body
            rotation="-1deg"
            style={{
              minWidth: '240px',
              maxWidth: '340px',
              padding: '14px 16px 12px',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: 'var(--sp-2)',
            }}
          >
            <Pin color={PIN_MAP[toast.type] || 'blue'} position="center" />
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
              <ToastIcon type={toast.type} />
              <span className="type-small" style={{ fontWeight: 600 }}>
                {toast.message}
              </span>
            </div>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              aria-label="Dismiss notification"
              style={{
                background: 'transparent',
                border: 0,
                cursor: 'pointer',
                color: 'var(--ink)',
                minWidth: '28px',
                minHeight: '28px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={16} strokeWidth={2} aria-hidden="true" />
            </button>
          </StickyNote>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return { showToast: () => {}, dismiss: () => {} };
  }
  return ctx;
}
