import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Shield,
  BookOpen,
  Globe,
  LogOut,
  Check,
  Sparkles,
  FileText,
  BarChart3,
  Lock,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import {
  PaperCard,
  Tape,
  Pin,
  Tag,
  Field,
  Button,
  SectionHeader,
  useToast,
} from '../components/ui';

export default function ProfilePage() {
  const { user, logout, updateProfile } = useAuth();
  const { t, i18n } = useTranslation();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [board, setBoard] = useState(user?.board || 'CBSE');
  const [classLevel, setClassLevel] = useState(user?.classLevel || user?.class || 10);
  const [language, setLanguage] = useState(user?.preferredLanguage || user?.language || i18n.language || 'en');
  const [saarthiMemory, setSaarthiMemory] = useState(user?.saarthiMemoryEnabled !== false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({
        board,
        class: Number(classLevel),
        classLevel: Number(classLevel),
        language,
        preferredLanguage: language,
        saarthiMemoryEnabled: saarthiMemory,
      });

      await i18n.changeLanguage(language);
      localStorage.setItem('i18nextLng', language);
      showToast(t('settings.savedSuccess', 'Settings saved cleanly!'), 'success');
    } catch (err) {
      showToast(err.message || 'Failed to save preferences', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const initials = (user?.name || 'S')
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-6)' }}>
      {/* Hero Student ID Card */}
      <PaperCard
        as="section"
        hero
        variant="ruled-margin"
        style={{ padding: 'var(--sp-6) var(--sp-5) var(--sp-6) 64px' }}
      >
        <Tape tone="kraft" rotation="-1.5deg" />
        <Pin color="green" position="right" />

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--sp-4)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--sp-4)' }}>
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: 'var(--r-pill)',
                background: 'var(--avatar-bg)',
                border: '2px solid var(--emerald-700)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '1.5rem',
                color: 'var(--emerald-800)',
                flexShrink: 0,
              }}
              aria-hidden="true"
            >
              {initials || <User size={28} />}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-1)' }}>
              <span className="type-label" style={{ color: 'var(--hand-rust)' }}>
                {t('settings.title', 'My Notebook & Settings')}
              </span>
              <h1 className="type-h1" style={{ color: 'var(--ink)' }}>
                {user?.name || 'Student'}
              </h1>
              <p className="type-small" style={{ color: 'var(--ink-muted)' }}>
                {user?.email || user?.phone || 'Offline Student Account'}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)', marginTop: 'var(--sp-1)' }}>
                <Tag variant="verified">{board}</Tag>
                <Tag variant="paper">Class {classLevel}</Tag>
                {user?.role === 'admin' ? <Tag variant="physics">Admin</Tag> : null}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
            <Button variant="note" size="sm" to="/notes">
              <FileText size={16} strokeWidth={2} aria-hidden="true" />
              My Notes
            </Button>
            <Button variant="note" size="sm" to="/results">
              <BarChart3 size={16} strokeWidth={2} aria-hidden="true" />
              Test History
            </Button>
            <Button variant="note" size="sm" to="/privacy">
              <Lock size={16} strokeWidth={2} aria-hidden="true" />
              Privacy
            </Button>
          </div>
        </div>
      </PaperCard>

      {/* Notebook Preferences Card (Flat paper so inputs stay un-tilted) */}
      <section>
        <SectionHeader
          tag="Study Preferences"
          title="Curriculum & Language"
          note="Changes update your syllabus and Chotu tutor context immediately"
        />

        <PaperCard flat style={{ padding: 'var(--sp-6)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--sp-5)' }}>
            {/* Educational Board */}
            <div>
              <div className="field__label" style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: 'var(--sp-2)' }}>
                <Shield size={16} strokeWidth={2} aria-hidden="true" />
                <span>{t('settings.boardLabel', 'Educational Board')}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--sp-2)' }}>
                {['CBSE', 'ICSE', 'State Board'].map((b) => (
                  <Button
                    key={b}
                    type="button"
                    variant={board === b ? 'primary' : 'note'}
                    size="sm"
                    onClick={() => setBoard(b)}
                    aria-pressed={board === b ? 'true' : 'false'}
                  >
                    {b}
                  </Button>
                ))}
              </div>
            </div>

            {/* Class & Language */}
            <div className="paper-grid paper-grid--2" style={{ gap: 'var(--sp-4)' }}>
              <Field
                as="select"
                label={
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <BookOpen size={15} strokeWidth={2} aria-hidden="true" />
                    {t('settings.classLabel', 'Class / Standard')}
                  </span>
                }
                value={String(classLevel)}
                onChange={(e) => setClassLevel(Number(e.target.value))}
              >
                <option value="9">Class 9</option>
                <option value="10">Class 10 (SSC)</option>
                <option value="11">Class 11</option>
                <option value="12">Class 12 (HSC)</option>
              </Field>

              <Field
                as="select"
                label={
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Globe size={15} strokeWidth={2} aria-hidden="true" />
                    {t('settings.languageLabel', 'App & Content Language')}
                  </span>
                }
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="en">English (EN)</option>
                <option value="hi">Hindi (हिंदी)</option>
                <option value="mr">Marathi (मराठी)</option>
              </Field>
            </div>

            {/* Chotu AI Memory Setting */}
            <div
              style={{
                padding: 'var(--sp-4)',
                background: 'var(--paper-warm)',
                borderRadius: 'var(--r-md)',
                border: '1px solid var(--paper-border-warm)',
              }}
            >
              <Field
                as="checkbox"
                checked={saarthiMemory}
                onChange={(e) => setSaarthiMemory(e.target.checked)}
                label={
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={15} strokeWidth={2} aria-hidden="true" />
                    Enable Chotu (AI Saarthi) Learning Memory
                  </span>
                }
                helper="Allows Chotu to remember weak topics and guide personalized revision."
              />
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: 'var(--sp-3)',
                paddingTop: 'var(--sp-3)',
                borderTop: '1px solid var(--paper-border-warm)',
              }}
            >
              <Button variant="primary" onClick={handleSave} disabled={saving}>
                <Check size={17} strokeWidth={2} aria-hidden="true" />
                {saving ? 'Saving...' : t('settings.saveBtn', 'Save Preferences')}
              </Button>

              <Button variant="danger" onClick={handleLogout}>
                <LogOut size={17} strokeWidth={2} aria-hidden="true" />
                {t('settings.logoutBtn', 'Log out')}
              </Button>
            </div>
          </div>
        </PaperCard>
      </section>
    </div>
  );
}
