import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send, X, Maximize2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import PaperCard from './PaperCard';
import Tape from './Tape';
import Paperclip from './Paperclip';
import StickyNote from './StickyNote';
import Button from './Button';
import Field from './Field';
import ChotuMascot from './ChotuMascot';

/**
 * Quick-access Chotu notebook drawer backed by the existing /api/mentor/chat endpoint.
 */
export default function ChotuPanel({ open, onClose }) {
  const { token, user } = useAuth();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hi ${user?.name || 'there'}! I am Chotu, your STEM notebook buddy. Ask any quick concept question or open the full workspace.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const endRef = useRef(null);

  useEffect(() => {
    if (open) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [open, messages]);

  if (!open) return null;

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: trimmed }]);
    setSending(true);

    try {
      const headers = { 'Content-Type': 'application/json' };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch('/api/mentor/chat', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          message: trimmed,
          sessionId,
          mode: 'doubt',
        }),
      });

      const data = await response.json();
      if (data.sessionId) {
        setSessionId(data.sessionId);
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply || data.error || 'Could not reach Chotu right now. Please try again.',
          sources: Array.isArray(data.sources) ? data.sources : [],
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Connection issue while talking to Chotu. You can retry or open the full AI Saarthi workspace.',
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <PaperCard
      as="aside"
      flat
      className="chotu-panel"
      aria-label="Chotu quick doubt solver"
    >
      <Tape tone="green" rotation="-1deg" />

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--sp-2)',
          paddingBottom: 'var(--sp-3)',
          borderBottom: '1px solid var(--paper-border-warm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-2)' }}>
          <ChotuMascot size={32} />
          <div>
            <div className="type-h3" style={{ fontSize: '1rem', color: 'var(--ink)' }}>
              Chotu Mentor
            </div>
            <div className="type-label" style={{ color: 'var(--emerald-700)', fontSize: '0.6875rem' }}>
              STEM NOTEBOOK HELPER
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-1)' }}>
          <Link
            to="/mentor"
            onClick={onClose}
            className="btn btn--ghost btn--sm"
            aria-label="Open full Chotu workspace"
            title="Full Workspace"
            style={{ minWidth: '40px', padding: '0 8px' }}
          >
            <Maximize2 size={15} strokeWidth={2} aria-hidden="true" />
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close Chotu drawer"
            style={{ minWidth: '40px', padding: '0 8px' }}
          >
            <X size={16} strokeWidth={2} aria-hidden="true" />
          </Button>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: 'var(--sp-3) var(--sp-1)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--sp-3)',
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            <StickyNote
              tone={msg.role === 'user' ? 'blue' : 'yellow'}
              body
              rotation={msg.role === 'user' ? '0.6deg' : '-0.5deg'}
              style={{
                maxWidth: '90%',
                padding: '10px 12px',
              }}
            >
              {idx === 0 && msg.role === 'assistant' ? <Paperclip /> : null}
              <p className="type-small" style={{ whiteSpace: 'pre-wrap' }}>
                {msg.content}
              </p>
              {msg.sources?.length ? (
                <div style={{ marginTop: 'var(--sp-2)', fontSize: '0.75rem', color: 'var(--ink-muted)' }}>
                  Notes: {msg.sources.slice(0, 2).map((s) => s.title || s.chapter || 'Reference').join(' · ')}
                </div>
              ) : null}
            </StickyNote>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={handleSend}
        style={{
          display: 'flex',
          gap: 'var(--sp-2)',
          alignItems: 'flex-end',
          paddingTop: 'var(--sp-3)',
          borderTop: '1px solid var(--paper-border-warm)',
        }}
      >
        <div style={{ flex: 1 }}>
          <Field
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a quick STEM question..."
            aria-label="Ask a quick STEM question"
            disabled={sending}
          />
        </div>
        <Button type="submit" variant="primary" disabled={sending || !input.trim()} aria-label="Send question">
          <Send size={16} strokeWidth={2} aria-hidden="true" />
        </Button>
      </form>
    </PaperCard>
  );
}
