import React from 'react';
import { ShieldCheck, Lock, Database, Sparkles, ArrowLeft } from 'lucide-react';
import {
  PaperCard,
  Tape,
  Pin,
  Tag,
  Button,
  StickyNote,
} from '../components/ui';

export default function PrivacyPage() {
  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
      <PaperCard
        as="article"
        variant="ruled-margin"
        flat
        style={{ padding: 'var(--sp-6) var(--sp-5) var(--sp-6) 64px' }}
      >
        <Tape tone="green" rotation="-1deg" />
        <Pin color="green" position="right" />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-3)', marginBottom: 'var(--sp-5)' }}>
          <Tag variant="verified">Student Data Protection</Tag>
          <h1 className="type-h1" style={{ color: 'var(--ink)' }}>
            Privacy & AI Safety Controls
          </h1>
          <p className="type-hand" style={{ color: 'var(--hand-rust)', fontSize: '1.35rem' }}>
            Transparent data rules designed for school students and parents.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
          <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
            <h2 className="type-h3" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ink)' }}>
              <ShieldCheck size={20} strokeWidth={2} style={{ color: 'var(--emerald-700)' }} aria-hidden="true" />
              1. Minimal Student Information
            </h2>
            <p className="type-body" style={{ color: 'var(--ink-muted)' }}>
              EVidya stores only your name, board, class level, preferred language, lesson completion progress, and test practice results so your notebook stays synced across sessions.
            </p>
          </section>

          <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
            <h2 className="type-h3" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ink)' }}>
              <Sparkles size={20} strokeWidth={2} style={{ color: 'var(--amber-500)' }} aria-hidden="true" />
              2. Chotu (AI Saarthi) Memory Control
            </h2>
            <p className="type-body" style={{ color: 'var(--ink-muted)' }}>
              You can turn AI learning memory ON or OFF anytime from your Notebook Settings page, or delete individual stored memories inside the AI Saarthi workspace.
            </p>
          </section>

          <section style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-2)' }}>
            <h2 className="type-h3" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ink)' }}>
              <Database size={20} strokeWidth={2} style={{ color: 'var(--physics-ink)' }} aria-hidden="true" />
              3. Offline Storage & No Third-Party Ads
            </h2>
            <p className="type-body" style={{ color: 'var(--ink-muted)' }}>
              Lessons, test histories, and UI assets cached locally on your device are never shared with advertising networks or third-party data brokers.
            </p>
          </section>

          <StickyNote tone="yellow" body rotation="-0.6deg">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, marginBottom: '4px' }}>
              <Lock size={16} strokeWidth={2} aria-hidden="true" />
              Manage your preferences anytime
            </div>
            Visit My Notebook to adjust Chotu memory, board, or language settings.
          </StickyNote>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-3)', paddingTop: 'var(--sp-2)' }}>
            <Button variant="primary" to="/profile">
              Open Notebook Settings
            </Button>
            <Button variant="ghost" to="/dashboard">
              <ArrowLeft size={16} strokeWidth={2} aria-hidden="true" />
              Back to Home
            </Button>
          </div>
        </div>
      </PaperCard>
    </div>
  );
}
